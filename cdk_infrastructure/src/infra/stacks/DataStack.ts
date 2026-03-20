import { Stack, StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  Table as DynamoDBTable,
  ITable,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../utils";

export class DataStack extends Stack {
  /** Single table for all entities (todos, events) using PK/SK access patterns */
  public readonly userItemsTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.userItemsTable = new DynamoDBTable(this, "UserItemsTable", {
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: AttributeType.STRING,
      },
      tableName: `UserItemsTable-${suffix}`,
    });
  }
}
