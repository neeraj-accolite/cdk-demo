import { Construct } from "constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';

export interface HitCounterProps {
    downstream: lambda.Function;
    readCapacity?: number;
}

export class HitCounter extends Construct {

    private DEFAULT_READ_CAPACITY = 5;
    public readonly handler: lambda.Function;
    public readonly table: dynamodb.Table;

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        if (props.readCapacity !== undefined && (props.readCapacity < 5 || props.readCapacity > 20)) {
            //If the readCapacity on the table is less than 5 or greater than 20, then it should throw the error.
            throw new Error("readCapacity should be between 5 and 20");
        }
        super(scope, id);

        const table = new dynamodb.Table(this, "Hits", {
            partitionKey: {
                name: 'path',
                type: dynamodb.AttributeType.STRING,
            },
            readCapacity: props.readCapacity ?? this.DEFAULT_READ_CAPACITY,
            encryption: dynamodb.TableEncryption.AWS_MANAGED,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        this.table = table;

        this.handler = new lambda.Function(this, "HitsCounterHandler", {
            runtime: lambda.Runtime.NODEJS_LATEST,
            code: lambda.Code.fromAsset("handlers"),
            handler: "hitcounter.handler",
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName
            }
        })
        table.grantReadWriteData(this.handler);
        props.downstream.grantInvoke(this.handler);
    }
}