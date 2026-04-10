import { App } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";
import { WebSocketStack } from "./stacks/WebSocketStack";

const environment = "Prod"; // swap between "Dev" and "Prod" to deploy to the correct environment
const appName = `PomodoroPlans-${environment}`;

const app = new App();

// Region setup:
// - DataStack, LambdaStack, AuthStack, ApiStack → eu-west-2 (backend infrastructure)
// - UiDeploymentStack → us-east-1 (CloudFront requires ACM certificates in us-east-1)
// - Route 53 is global, so DNS works from either region

const euWestEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT, // this is your cli credential not set manually
  region: "eu-west-2",
};

// CloudFront requires ACM certificates in us-east-1
const usEastEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: "us-east-1",
};

const dataStack = new DataStack(app, `${appName}-DataStack`, {
  env: euWestEnv,
  appName: appName,
});

const lambdaStack = new LambdaStack(app, `${appName}-LambdaStack`, {
  env: euWestEnv,
  userItemsTable: dataStack.userItemsTable,
  connectionsTable: dataStack.websocketConnectionsTable,
});

const authStack = new AuthStack(app, `${appName}-AuthStack`, {
  env: euWestEnv,
  appName,
});

const apiStack = new ApiStack(app, `${appName}-ApiStack`, {
  env: euWestEnv,
  eventsLambdaIntegration: lambdaStack.eventsLambdaIntegration,
  todosLambdaIntegration: lambdaStack.todosLambdaIntegration,
  pomodorosLambdaIntegration: lambdaStack.pomodorosLambdaIntegration,
  profileLambdaIntegration: lambdaStack.profileLambdaIntegration,
  userPool: authStack.userPool,
});

// WebSocket API stack – uses the connections table from DataStack and Cognito from AuthStack
const webSocketStack = new WebSocketStack(app, `${appName}-WebSocketStack`, {
  env: euWestEnv,
  connectionsTable: dataStack.websocketConnectionsTable,
  userPool: authStack.userPool,
  userPoolClient: authStack.userPoolClient,
});

// Grant the Pomodoro Lambda permission to push messages through the WebSocket API
lambdaStack.pomodorosLambda.addEnvironment(
  "WEBSOCKET_API_ENDPOINT",
  webSocketStack.callbackUrl,
);
lambdaStack.pomodorosLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["execute-api:ManageConnections"],
    resources: [webSocketStack.manageConnectionsArn],
  }),
);

// UI stack goes to us-east-1 (required for CloudFront + ACM certificate)
const uiStack = new UiDeploymentStack(app, `${appName}-UiDeploymentStack`, {
  env: usEastEnv,
}); // { env: usEastEnv } because CloudFront requires ACM certificates in us-east-1

// delete flow:
//cdk destroy PomodoroPlans-Dev-ApiStack
// cdk destroy PomodoroPlans-Dev-LambdaStack
// cdk destroy PomodoroPlans-Dev-WebSocketStack
// cdk destroy PomodoroPlans-Dev-AuthStack
// cdk destroy PomodoroPlans-Dev-DataStack
