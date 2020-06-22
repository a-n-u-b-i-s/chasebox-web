/// <reference path="types.d.ts"/>
/*
Workflow:
- New Email Object to be parser Triggers Main Function
	- Extract Data & Assert
	- If Dead Letter:
		- Add to Deadletter List
		- Send SNS Notification
	- Else:
		- Sync Google Sheet to Grid
		- Add Record to Grid
		- Sync Grid to Google Sheet
*/

// Imports
const axios = require('axios').default;

// BigParser Constants
const BigParserEmail: string = process.env.BP_user;
const BigParserPassword: string = process.env.BP_password;

// API Constants
const APIBaseURL: string = 'https://www.bigparser.com/APIServices/api';
const APIBaseURLv2: string = 'https://www.bigparser.com/api/v2';

// Helpers
function printf(title: string, data: any, error: boolean = false): any {
	if (process.env.DEBUG || error) {
		var output: any = {};
		output[title] = JSON.stringify(data);
		console.log(output);
		return output;
	}
}

function error(message: string, cb: Callback): void {
	var error: object = printf("ERROR", message, true);
	cb(JSON.stringify(error), null);
}

// Main Function
exports.handler = async (event: Email, context: JSON, callback: Callback) => {

	// Log all Event Context
	printf("Event", event);
	printf("Context", context);
	printf("BigParser Email", BigParserEmail);
	printf("BigParser Password", BigParserPassword);



	callback(null, "SUCCESS!!");
}