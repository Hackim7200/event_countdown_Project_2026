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
              "PoolId": "eu-west-2:929320cb-7d2d-4224-be7d-b00c0bd67bce",
              "Region": "eu-west-2"
            }
          }
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "eu-west-2_w5Od4ZXYY",
            "AppClientId": "4soqgdm7niv8tjdasblg60k351",
            "Region": "eu-west-2"
          }
        },
        "Auth": {
          "Default": {
            "authenticationFlowType": "USER_SRP_AUTH",
            "usernameAttributes": [],
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
          "endpoint": "https://vzf3si0iob.execute-api.eu-west-2.amazonaws.com/prod/",
          "region": "eu-west-2",
          "authorizationType": "AMAZON_COGNITO_USER_POOLS"
        }
      }
    }
  }
}
''';
