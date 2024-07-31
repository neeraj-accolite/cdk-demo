import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from "aws-cdk-lib/pipelines";
import { CdkDemoPipelineStage } from "./cdk-demp-pipeline-stage";

export class CDKDemoPiplelineStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const repo = new codecommit.Repository(this, 'CdkDemoRepoConstruct', {
            repositoryName: 'CdkDemoRepo'
        });

        const pipeline = new CodePipeline(this, 'CdkPipleline', {
            pipelineName: 'CdkDemoPipeline',
            synth: new CodeBuildStep('SynthStep', {
                input: CodePipelineSource.codeCommit(repo, 'main'),
                installCommands: [
                    'npm install -g aws-cdk'
                ],
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ]
            })
        })

        const deployment = new CdkDemoPipelineStage(this, 'CdkDeployment');
        const deploymentStage = pipeline.addStage(deployment);
        deploymentStage.addPost(
            new CodeBuildStep('TestHitCounterTableViewerEndPoint', {
                projectName: 'TestHitCounterTableViewerEndPoint',
                envFromCfnOutputs: {
                    ENDPOINT_URL: deployment.hitCounterTableViewEndpoint
                },
                commands: [
                    'curl -Ssf $ENDPOINT_URL'
                ]
            })
        );

        deploymentStage.addPost(
            new CodeBuildStep('TestHitCounterApiGatewayEndpoint', {
                projectName: 'TestHitCounterApiGatewayEndpoint',
                envFromCfnOutputs: {
                    ENDPOINT_URL: deployment.hitCounterEndpoint
                },
                commands: [
                    'curl -Ssf $ENDPOINT_URL/hit1',
                    'curl -Ssf $ENDPOINT_URL/hit2',
                    'curl -Ssf $ENDPOINT_URL/hit3'
                ]
            })
        )
    }


}