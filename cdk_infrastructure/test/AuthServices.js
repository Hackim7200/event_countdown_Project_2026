"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const aws_amplify_1 = require("aws-amplify");
const auth_1 = require("@aws-amplify/auth");
const client_cognito_identity_1 = require("@aws-sdk/client-cognito-identity");
const credential_providers_1 = require("@aws-sdk/credential-providers");
const AWS_REGION = "eu-west-2";
const USER_POOL_ID = "eu-west-2_qcrsl8aSb";
const IDENTITY_POOL_ID = "eu-west-2:1501a893-c1d4-464b-b680-938dcac7faff";
const USER_POOL_CLIENT_ID = "14pf06359tmc6sg9rb6uh0h2ml";
aws_amplify_1.Amplify.configure({
    Auth: {
        // extract these value from the UI
        Cognito: {
            userPoolId: USER_POOL_ID,
            userPoolClientId: USER_POOL_CLIENT_ID,
            identityPoolId: IDENTITY_POOL_ID,
        },
    },
});
class AuthServices {
    async login(userName, password) {
        const signInOutput = await (0, auth_1.signIn)({
            username: userName,
            password: password,
            options: {
                authFlow: "USER_PASSWORD_AUTH",
            },
        });
        return signInOutput;
    }
    async getIdToken() {
        // grabs JWT token
        const authSession = await (0, auth_1.fetchAuthSession)();
        const idToken = authSession.tokens?.idToken?.toString();
        console.log(idToken);
        return idToken;
    }
    // used to communicate with aws services
    async generateTemporaryCredentials() {
        const idToken = await this.getIdToken();
        if (!idToken) {
            throw new Error("No ID token available. Please login first.");
        }
        const cognitoIdentityPool = `cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`;
        // this identity contains the credential that can be used for auth
        const cognitoIdentity = new client_cognito_identity_1.CognitoIdentityClient({
            credentials: (0, credential_providers_1.fromCognitoIdentityPool)({
                identityPoolId: IDENTITY_POOL_ID,
                logins: {
                    [cognitoIdentityPool]: idToken,
                },
            }),
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}
exports.AuthServices = AuthServices;
