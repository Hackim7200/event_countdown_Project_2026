const String amplifyconfig = '''
{
  "version": "1",
  "auth": {
    "plugins": {
      "awsCognitoAuthPlugin": {
        "UserAgent": "aws-amplify-cli/0.1.0",
        "Version": "0.1.0",
        "IdentityManager": {
          "Default": {}
        },
        "CredentialsProvider": {
          "CognitoIdentity": {
            "Default": {
              "PoolId": "eu-west-2:477a8f38-276f-43a8-8e7c-bb09bf6dea5b",
              "Region": "eu-west-2"
            }
          }
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "eu-west-2_z0Re9MH7Y",
            "AppClientId": "2496ol99l0u1cl90417qredkc2",
            "Region": "eu-west-2"
          }
        },
        "Auth": {
          "Default": {
            "authenticationFlowType": "USER_SRP_AUTH",
            "usernameAttributes": ["EMAIL"],
            "signupAttributes": ["EMAIL"],
            "passwordProtectionSettings": {
              "passwordPolicyMinLength": 8,
              "passwordPolicyCharacters": [
                "REQUIRES_LOWERCASE",
                "REQUIRES_UPPERCASE",
                "REQUIRES_NUMBERS"
              ]
            }
          }
        }
      }
    }
  },
  "api": {
    "plugins": {
      "awsAPIPlugin": {
        "CountdownApi": {
          "endpointType": "REST",
          "endpoint": "https://zodi0oj39l.execute-api.eu-west-2.amazonaws.com/prod/",
          "region": "eu-west-2",
          "authorizationType": "AMAZON_COGNITO_USER_POOLS"
        }
      }
    }
  }
}
''';
// datastack is not added here since its accessed via lambda apigateway