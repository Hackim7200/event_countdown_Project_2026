import { Stack, StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  Table as DynamoDBTable,
  ITable,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

interface DataStackProps extends StackProps {
  appName: string;
}

export class DataStack extends Stack {
  /** Single table for all entities (todos, events) using PK/SK access patterns */
  public readonly userItemsTable: ITable;
  /** WebSocket connection registry – maps connectionId to userId for fan-out */
  public readonly websocketConnectionsTable: ITable;

  constructor(scope: Construct, id: string, props: DataStackProps) {
    super(scope, id, props);

    const { appName } = props;

    this.userItemsTable = new DynamoDBTable(this, "UserItemsTable", {
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: AttributeType.STRING,
      },
      tableName: `${appName}-UserItems`,
    });

    // PK = connectionId so $disconnect can DeleteItem without knowing the userId
    const connectionsTable = new DynamoDBTable(
      this,
      "WebSocketConnectionsTable",
      {
        partitionKey: {
          name: "connectionId",
          type: AttributeType.STRING,
        },
        tableName: `${appName}-WebSocketConnections`,
      },
    );

    // GSI to query all connections for a given userId (fan-out to same user's devices)
    connectionsTable.addGlobalSecondaryIndex({
      indexName: "UserConnections",
      partitionKey: {
        name: "userId",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "connectionId",
        type: AttributeType.STRING,
      },
    });

    this.websocketConnectionsTable = connectionsTable;
  }
}
