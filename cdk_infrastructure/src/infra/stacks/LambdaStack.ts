import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

interface LambdaStackProps extends StackProps {
  userItemsTable: ITable;
  connectionsTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly eventsLambdaIntegration: LambdaIntegration;
  public readonly todosLambdaIntegration: LambdaIntegration;
  public readonly pomodorosLambdaIntegration: LambdaIntegration;
  public readonly profileLambdaIntegration: LambdaIntegration;
  public readonly pomodorosLambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    //////////// Todos Lambda ////////////

    const table = props.userItemsTable;

    const todosLambda = new NodejsFunction(this, "TodosLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "services",
        "lambdas",
        "todo",
        "handler.ts",
      ),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    todosLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [table.tableArn],
        actions: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchWriteItem",
        ],
      }),
    );
    this.todosLambdaIntegration = new LambdaIntegration(todosLambda);

    //////////// Events Lambda ////////////

    const eventsLambda = new NodejsFunction(this, "EventsLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "services",
        "lambdas",
        "event",
        "handler.ts",
      ),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    eventsLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [table.tableArn],
        actions: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
      }),
    );
    this.eventsLambdaIntegration = new LambdaIntegration(eventsLambda);

    //////////// Pomodoros Lambda ////////////

    const connectionsTable = props.connectionsTable;

    const pomodorosLambda = new NodejsFunction(this, "PomodorosLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "services",
        "lambdas",
        "pomodoro",
        "handler.ts",
      ),
      environment: {
        TABLE_NAME: table.tableName,
        CONNECTIONS_TABLE_NAME: connectionsTable.tableName,
      },
    });
    pomodorosLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [table.tableArn],
        actions: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
      }),
    );
    pomodorosLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          connectionsTable.tableArn,
          `${connectionsTable.tableArn}/index/*`,
        ],
        actions: ["dynamodb:Query", "dynamodb:DeleteItem"],
      }),
    );
    this.pomodorosLambda = pomodorosLambda;
    this.pomodorosLambdaIntegration = new LambdaIntegration(pomodorosLambda);

    //////////// Profile Lambda ////////////

    const profileLambda = new NodejsFunction(this, "ProfileLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "services",
        "lambdas",
        "profile",
        "handler.ts",
      ),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    profileLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [table.tableArn],
        actions: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchWriteItem",
        ],
      }),
    );
    this.profileLambdaIntegration = new LambdaIntegration(profileLambda);

    //////////// Cleanup Old Todos (scheduled) ////////////

    const cleanupLambda = new NodejsFunction(this, "CleanupOldTodosLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "services",
        "lambdas",
        "todo",
        "CleanupOldTodos.ts",
      ),
      environment: {
        TABLE_NAME: table.tableName,
      },
      timeout: Duration.minutes(5),
    });

    cleanupLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [table.tableArn],
        actions: ["dynamodb:Scan", "dynamodb:BatchWriteItem"],
      }),
    );

    new Rule(this, "CleanupOldTodosSchedule", {
      schedule: Schedule.cron({ minute: "0", hour: "0" }),
      targets: [new LambdaFunction(cleanupLambda)],
    });
  }
}
