#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
// import { CdkDemoStack } from '../lib/cdk-demo-stack';
import { CDKDemoPiplelineStack } from '../lib/cdk-demo-pipeline-stack';

const app = new cdk.App();
// new CdkDemoStack(app, 'CdkDemoStack');
new CDKDemoPiplelineStack(app, 'CdkDemoPipelineStack', {
    env: {
        account: process.env.ACCOUNT_ID,
        region: process.env.REGION_NAME
    }
});

