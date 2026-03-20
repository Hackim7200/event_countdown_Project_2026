"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../src/services/lambdas/todo/handler");
// Set environment variables for local testing
process.env.TABLE_NAME = "SpacesTable-026c60252c2f";
process.env.AWS_REGION = "eu-west-2";
(0, handler_1.handler)({
    httpMethod: "POST",
    body: JSON.stringify({
        title: "Guardians of the Galaxy",
        year: "2014",
        photoUrl: "https://example.com/photo.jpg",
    }),
}, {})
    .then((result) => console.log(result))
    .catch((error) => console.error("Error:", error));
// handler(
//   {
//     httpMethod: "GET",
//     // queryStringParameters: {
//     //   id: "ad2e3dfb-bfef-48d7-8db4-6f4cd8c006ea",
//     // },
//   } as any,
//   {} as any
// );
// handler(
//   {
//     httpMethod: "GET",
//      queryStringParameters: {
//        id: "ad2e3dfb-bfef-48d7-8db4-6f4cd8c006ea",
//     // },
//   } as any,
//   {} as any
// );
// handler(
//   {
//     httpMethod: "PUT",
//     queryStringParameters: {
//       id: "1c998ea9-c7da-459f-a711-f486cbb8bf65",
//     },
//     body: JSON.stringify({
//       title: "dublin updated",
//     }),
//   } as any,
//   {} as any
// );
// handler(
//   {
//     httpMethod: "DELETE",
//     queryStringParameters: {
//       id: "1c998ea9-c7da-459f-a711-f486cbb8bf65",
//     },
//   } as any,
//   {} as any
// ).then((result) => console.log(result));
