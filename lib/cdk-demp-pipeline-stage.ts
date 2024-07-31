import { CfnOutput, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CdkDemoStack } from "./cdk-demo-stack";

export class CdkDemoPipelineStage extends Stage {
    public readonly hitCounterEndpoint: CfnOutput;
    public readonly hitCounterTableViewEndpoint: CfnOutput;
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const service = new CdkDemoStack(this, 'CdkDemoDeploymentService');

        this.hitCounterEndpoint = service.hitCounterUrl;
        this.hitCounterTableViewEndpoint = service.hitCounterTableViewUrl;
    }
}