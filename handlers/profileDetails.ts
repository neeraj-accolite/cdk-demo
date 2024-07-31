import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * Handlers to execute Profie Details Request.
 * @param event 
 * @param context 
 * @returns 
 */
exports.handler = async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    console.log("Profile Details: request:", JSON.stringify(event, undefined, 2));
    return {
        statusCode: 200,
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            id: 1234,
            first_name: "profile-first",
            last_name: "last_name",
            department: "Accounts & Management",
            email: "profile@email.com",
            mobileNumber: "+91-1234567890",
            avatar: "https://reqres.in/img/faces/5-image.jpg"
        }),
    }
}