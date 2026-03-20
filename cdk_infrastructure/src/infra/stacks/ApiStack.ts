import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  ResourceOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  eventsLambdaIntegration: LambdaIntegration;
  todosLambdaIntegration: LambdaIntegration;
  pomodorosLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "CountdownApi"); // Create a REST API named CountdownApi.

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "CountdownApiAuthorizer",
      {
        cognitoUserPools: [props.userPool],
        identitySource: "method.request.header.Authorization",
      },
    );
    authorizer._attachToApi(api);

    const optionsWithAuth: MethodOptions = {
      // Automatically authenticate requests before responding.
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    //////////// Events Resource ////////////
    const eventsResource = api.root.addResource("events", optionsWithCors);
    eventsResource.addMethod(
      "GET",
      props.eventsLambdaIntegration,
      optionsWithAuth,
    );
    eventsResource.addMethod(
      "POST",
      props.eventsLambdaIntegration,
      optionsWithAuth,
    );
    eventsResource.addMethod(
      "PUT",
      props.eventsLambdaIntegration,
      optionsWithAuth,
    );
    eventsResource.addMethod(
      "DELETE",
      props.eventsLambdaIntegration,
      optionsWithAuth,
    );

    //////////// Todos Resource ////////////
    const todosResource = api.root.addResource("todos", optionsWithCors);

    todosResource.addMethod(
      "GET",
      props.todosLambdaIntegration,
      optionsWithAuth,
    );
    todosResource.addMethod(
      "POST",
      props.todosLambdaIntegration,
      optionsWithAuth,
    );
    todosResource.addMethod(
      "PUT",
      props.todosLambdaIntegration,
      optionsWithAuth,
    );
    todosResource.addMethod(
      "DELETE",
      props.todosLambdaIntegration,
      optionsWithAuth,
    );

    //////////// Pomodoros Resource ////////////
    const pomodorosResource = api.root.addResource(
      "pomodoros",
      optionsWithCors,
    );
    pomodorosResource.addMethod(
      "GET",
      props.pomodorosLambdaIntegration,
      optionsWithAuth,
    );
    pomodorosResource.addMethod(
      "POST",
      props.pomodorosLambdaIntegration,
      optionsWithAuth,
    );
    pomodorosResource.addMethod(
      "PUT",
      props.pomodorosLambdaIntegration,
      optionsWithAuth,
    );
    pomodorosResource.addMethod(
      "DELETE",
      props.pomodorosLambdaIntegration,
      optionsWithAuth,
    );
  }
}
