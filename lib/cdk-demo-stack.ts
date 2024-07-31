import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkDemoStack extends Stack {
  public readonly hitCounterUrl: CfnOutput;
  public readonly hitCounterTableViewUrl: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const profileDetailsRequestHandler = new lambda.Function(this, 'ProfileDetailsHandler', {
      runtime: lambda.Runtime.NODEJS_LATEST, //execution environment 
      code: lambda.Code.fromAsset("handlers"), //Directory of the lambda functions 
      handler: 'profileDetails.handler' //FileName.(exported Function name)
    });

    const hitCounterHandler = new HitCounter(this, 'HitCounter', {
      downstream: profileDetailsRequestHandler
    })

    const apiGateway = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hitCounterHandler.handler
    });

    const tableViewer = new TableViewer(this, "ViewHitCounter", {
      title: 'Hits Table',
      table: hitCounterHandler.table
    })

    this.hitCounterUrl = new CfnOutput(this, 'CdkDemoOutputUrl', {
      value: apiGateway.url
    })

    this.hitCounterTableViewUrl = new CfnOutput(this, 'HitCounterViewerUrl', {
      value: tableViewer.endpoint
    })

  }
}
