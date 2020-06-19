/// <reference path="types.d.ts"/>
/*
 Workflow:
 - S3 Write Event Triggers Main
    - Setup
        - Login to BigParser
        - Get S3 Bucket & Key from S3 Event
        - Read Raw Email from S3 Bucket
        - Parse Raw Email into Email Object
    - Route
        - Query BigParser for Routing Rules
        - Filter Down to actionable Rules
        - Create List of Endpoints off of Active Hooks
        - Send Email to Hooks
 */
// Imports
const AWS = require('aws-sdk');
const axios = require('axios').default;
const s3 = new AWS.S3();
var lambda = new AWS.Lambda();
const simpleParser = require('mailparser').simpleParser;
// Chasebox Constants
const ChaseboxGridId = process.env.CB_routing_gridId;
const ChaseboxViewId = process.env.CB_routing_viewId;
// BigParser Constants
const BigParserEmail = process.env.BP_user;
const BigParserPassword = process.env.BP_password;
// API Constants
const APIBaseURL = 'https://www.bigparser.com/APIServices/api';
const APIBaseURLv2 = 'https://www.bigparser.com/api/v2';
const BigParserAPIv2 = axios.create({
    baseURL: APIBaseURLv2
});
const RULES = [{
        name: "Mail Subject Contains",
        filter: (row, email) => {
            return email.subject.includes(row["Mail Subject Contains"]);
        }
    }];
const HOOKS = [{
        name: "Lambda ARN",
        action: async (url, email) => {
            var params = {
                FunctionName: url,
                InvocationType: "Event",
                Payload: JSON.stringify(email)
            };
            var response = await lambda.invoke(params).promise();
            return response;
        }
    }, {
        name: "Webhook",
        action: async (url, email) => {
            var response = await axios({
                method: 'post',
                url: url,
                data: {
                    email: email
                }
            });
            return response;
        }
    }];
// Helpers
function printf(title, data, error = false) {
    if (process.env.DEBUG || error) {
        var output = {};
        output[title] = JSON.stringify(data);
        console.log(output);
        return output;
    }
}
function error(message, cb) {
    var error = printf("ERROR", message, true);
    cb(JSON.stringify(error), null);
}
// Main Function
exports.handler = async (event, context, callback) => {
    // Log all Event Context
    printf("Event", event);
    printf("Context", context);
    printf("Chasebox Grid Id", ChaseboxGridId);
    printf("Chasebox View Id", ChaseboxViewId);
    printf("BigParser Email", BigParserEmail);
    printf("BigParser Password", BigParserPassword);
    // Login to BigParser
    try {
        var loginResponse = await axios({
            method: 'post',
            url: '/common/login',
            baseURL: APIBaseURL,
            data: {
                emailId: BigParserEmail,
                password: BigParserPassword
            }
        });
        var authId = loginResponse.data.authId;
        BigParserAPIv2.defaults.headers.common['authId'] = authId;
    }
    catch {
        error("BigParser Login Failed", callback);
    }
    printf("authId", BigParserAPIv2.defaults.headers.common['authId']);
    // Get bucket name and email file name
    try {
        var bucket_name = event.Records[0].s3.bucket.name;
        var email_file_name = event.Records[0].s3.object.key;
    }
    catch {
        error("Malformed Request", callback);
    }
    printf("Bucket Name", bucket_name);
    printf("S3 Key", email_file_name);
    // Read S3 object
    try {
        var file = await s3.getObject({ Bucket: bucket_name, Key: email_file_name }).promise();
    }
    catch {
        error("Could not read S3 Object", callback);
    }
    // Get Raw Data
    try {
        var raw_email_data = file.Body;
    }
    catch {
        error("Could not parse S3 Object into binary file", callback);
    }
    // Parse Raw Email Data
    try {
        var email_data = await simpleParser(raw_email_data);
        var sender_email_address = email_data.from.value[0].address;
    }
    catch {
        error("Could not parse S3 binary file into Email", callback);
    }
    printf("Email", email_data);
    printf("Sender", sender_email_address);
    // Query BigParser for Routing Rules
    try {
        var query = {
            query: {
                columnFilter: {
                    filters: [{
                            operator: "IN",
                            column: 'Sender(s)',
                            keyword: sender_email_address
                        }]
                },
                showColumnNamesInResponse: true
            }
        };
        var routerGridResponse = await BigParserAPIv2({
            method: 'post',
            url: '/grid/' + ChaseboxGridId + '/search',
            data: query
        });
        var routerSearchResults = routerGridResponse.data;
    }
    catch {
        error("BigParser Search Query Failed", callback);
    }
    printf('Routing Rules', routerSearchResults);
    // Filter Down to actionable Rules
    try {
        var actions = routerSearchResults.rows;
        for (var i = 0; i < RULES.length; i++) {
            printf('Applying Rule', RULES[i]);
            actions = actions.filter((row) => RULES[i].filter(row, email_data));
        }
    }
    catch {
        error('Creation of Action List Failed', callback);
    }
    printf('Actions', actions);
    // Create List of Endpoints off of Active Hooks
    try {
        var endpoints = [];
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            for (var j = 0; j < HOOKS.length; j++) {
                var hook = HOOKS[j];
                printf("Introducing Hook", hook.name);
                if (action[hook.name]) {
                    endpoints.push({
                        type: hook.name,
                        url: action[hook.name],
                        action: hook.action
                    });
                }
            }
        }
    }
    catch {
        error('Creation of Hook Endpoints Failed', callback);
    }
    printf('Endpoints', endpoints);
    // Send Email to Hooks
    try {
        var endpointResponses = [];
        for (var i = 0; i < endpoints.length; i++) {
            var endpoint = endpoints[i];
            printf("Running Endpoint", endpoint);
            var endpointResponse = await endpoint.action(endpoint.url, email_data);
            endpointResponses.push(endpointResponse);
        }
    }
    catch {
        error('Sending Mail Data to Endpoints Failed', callback);
    }
    printf('Endpoint Responses', endpointResponses);
    callback(null, endpointResponses);
};
