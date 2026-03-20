import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";

const app = new App();

const appName = "CountdownApp"; // this is the name of the application, if you dont change it, it will redeploy to existing infrastructure

// Region setup:
// - DataStack, LambdaStack, AuthStack, ApiStack → eu-west-2 (backend infrastructure)
// - UiDeploymentStack → us-east-1 (CloudFront requires ACM certificates in us-east-1)
// - Route 53 is global, so DNS works from either region

const euWestEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: "eu-west-2",
};

// CloudFront requires ACM certificates in us-east-1
const usEastEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: "us-east-1",
};

const dataStack = new DataStack(app, `${appName}-DataStack`, { env: euWestEnv });
const lambdaStack = new LambdaStack(app, `${appName}-LambdaStack`, {
  env: euWestEnv,
  userItemsTable: dataStack.userItemsTable,
});

const authStack = new AuthStack(app, `${appName}-AuthStack`, { env: euWestEnv });

const apiStack = new ApiStack(app, `${appName}-ApiStack`, {
  env: euWestEnv,
  eventsLambdaIntegration: lambdaStack.eventsLambdaIntegration,
  todosLambdaIntegration: lambdaStack.todosLambdaIntegration,
  pomodorosLambdaIntegration: lambdaStack.pomodorosLambdaIntegration,
  userPool: authStack.userPool,
});

// UI stack goes to us-east-1 (required for CloudFront + ACM certificate)
const uiStack = new UiDeploymentStack(app, `${appName}-UiDeploymentStack`, { env: usEastEnv });
