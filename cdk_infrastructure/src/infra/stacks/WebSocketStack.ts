import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { WebSocketApi, WebSocketStage } from "aws-cdk-lib/aws-apigatewayv2";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { WebSocketLambdaAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { IUserPool, IUserPoolClient } from "aws-cdk-lib/aws-cognito";

interface WebSocketStackProps extends StackProps {
  connectionsTable: ITable;
  userPool: IUserPool;
  userPoolClient: IUserPoolClient;
}

export class WebSocketStack extends Stack {
  constructor(scope: Construct, id: string, props: WebSocketStackProps) {
    super(scope, id, props);

    const { connectionsTable, userPool, userPoolClient } = props;

    //////////// Authorizer Lambda ////////////

    const authorizerLambda = new NodejsFunction(this, "WsAuthorizerLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "services",
        "lambdas",
        "websocket",
        "authorizer.ts",
      ),
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        CLIENT_ID: userPoolClient.userPoolClientId,
      },
    });

    //////////// Main WebSocket handler Lambda ////////////

    const wsHandlerLambda = new NodejsFunction(this, "WsHandlerLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "services",
        "lambdas",
        "websocket",
        "handler.ts",
      ),
      environment: {
        CONNECTIONS_TABLE_NAME: connectionsTable.tableName,
      },
    });

    // DynamoDB permissions for the handler (PutItem, DeleteItem, Query on table + GSI)
    wsHandlerLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          connectionsTable.tableArn,
          `${connectionsTable.tableArn}/index/*`,
        ],
        actions: ["dynamodb:PutItem", "dynamodb:DeleteItem", "dynamodb:Query"],
      }),
    );

    //////////// WebSocket API ////////////

    const authorizer = new WebSocketLambdaAuthorizer(
      "WsConnectAuthorizer",
      authorizerLambda,
      { identitySource: ["route.request.querystring.token"] },
    );

    const wsApi = new WebSocketApi(this, "WebsocketApi", {
      apiName: "Websocket API",
      description: "WebSocket API for real-time same-user fan-out",
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "ConnectIntegration",
          wsHandlerLambda,
        ),
        authorizer,
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DisconnectIntegration",
          wsHandlerLambda,
        ),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DefaultIntegration",
          wsHandlerLambda,
        ),
      },
    });

    // Stage that auto-deploys changes
    const stage = new WebSocketStage(this, "WsProdStage", {
      webSocketApi: wsApi,
      stageName: "prod",
      autoDeploy: true,
    });

    // Allow the handler to push messages back to connected clients
    wsHandlerLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["execute-api:ManageConnections"],
        resources: [
          `arn:aws:execute-api:${this.region}:${this.account}:${wsApi.apiId}/${stage.stageName}/POST/@connections/*`,
        ],
      }),
    );

    //////////// Outputs ////////////

    new CfnOutput(this, "WebSocketUrl", {
      value: stage.url,
      description:
        "WebSocket endpoint (wss://…). Append ?token=<IdToken> to connect.",
    });
  }
}
