/// <reference path="types.d.ts"/>
/*
 Workflow:
 */
// Imports
const axios = require('axios').default;
// BigParser Constants
const BigParserEmail = process.env.BP_user;
const BigParserPassword = process.env.BP_password;
// API Constants
const APIBaseURL = 'https://www.bigparser.com/APIServices/api';
const APIBaseURLv2 = 'https://www.bigparser.com/api/v2';
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
    printf("BigParser Email", BigParserEmail);
    printf("BigParser Password", BigParserPassword);
    callback(null, "SUCCESS!!");
};
