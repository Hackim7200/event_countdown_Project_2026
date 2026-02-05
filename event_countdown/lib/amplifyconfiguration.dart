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
              "PoolId": "eu-west-2:b74c11d6-a63b-4bb2-98db-21016aed0523",
              "Region": "eu-west-2"
            }
          }
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "eu-west-2_DNDWikzXR",
            "AppClientId": "56mrb7d6afs4k68ujloe78l0fe",
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
          "endpoint": "https://r3rf9gpp6e.execute-api.eu-west-2.amazonaws.com/prod/",
          "region": "eu-west-2",
          "authorizationType": "AMAZON_COGNITO_USER_POOLS"
        }
      }
    }
  }
}
''';
