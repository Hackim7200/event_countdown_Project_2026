const String amplifyconfig = '''
{
  "version": "1",
  "auth": {
    "aws_region": "eu-west-2",
    "user_pool_id": "eu-west-2_PxKswmVes",
    "user_pool_client_id": "3nh7db1iv0u984uev4b8u3djkc",
    "identity_pool_id": "eu-west-2:ecd9ef99-3ced-49f4-b5fd-da40ae2c57bb",
    "username_attributes": [],
    "standard_required_attributes": [
      "email"
    ],
    "password_policy": {
      "min_length": 8,
      "require_lowercase": true,
      "require_uppercase": true,
      "require_numbers": true,
      "require_symbols": false
    }
  },


  
  "custom": {
    "api": {
      "name": "SpacesApi",
      "endpoint": "https://paet3fbabi.execute-api.eu-west-2.amazonaws.com/prod/",
      "region": "eu-west-2",
      "authorization_type": "AMAZON_COGNITO_USER_POOLS"
    },


    "data": {
      "spaces_table_name": "MoviesTable-06beee1689e9",
      "spaces_table_arn": "arn:aws:dynamodb:eu-west-2:759135634975:table/MoviesTable-06beee1689e9"
    },


    "lambda": {
      "reservation_lambda_arn": "arn:aws:lambda:eu-west-2:759135634975:function:LambdaStack-ReservationLambda2785A78F-4uaLuCaThafs",
      "movies_lambda_arn": "arn:aws:lambda:eu-west-2:759135634975:function:LambdaStack-MoviesLambda074129B0-kyMPaOVoJzsB"
    }
  }
}
''';
