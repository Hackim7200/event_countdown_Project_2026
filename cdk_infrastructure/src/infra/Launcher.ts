import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";
import { WebSocketStack } from "./stacks/WebSocketStack";


const environment = "Dev"; // swap between "Dev" and "Prod" to deploy to the correct environment
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

// UI stack goes to us-east-1 (required for CloudFront + ACM certificate)
const uiStack = new UiDeploymentStack(app, `${appName}-UiDeploymentStack`, {
  env: usEastEnv,
}); // { env: usEastEnv } because CloudFront requires ACM certificates in us-east-1
