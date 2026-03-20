"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthServices_1 = require("./AuthServices");
const client_s3_1 = require("@aws-sdk/client-s3");
async function testAuth() {
    const authServices = new AuthServices_1.AuthServices();
    const signInOutput = await authServices.login("Batman", "Batman13579!");
    console.log(signInOutput);
    const idToken = await authServices.getIdToken();
    console.log(idToken);
    const credetnials = await authServices.generateTemporaryCredentials();
    const buckets = await ListBuckets(credetnials);
    console.log(buckets);
}
async function ListBuckets(credentials) {
    const client = new client_s3_1.S3Client({
        credentials: credentials,
    });
    const command = new client_s3_1.ListBucketsCommand({});
    const result = await client.send(command);
    return result;
}
testAuth();
