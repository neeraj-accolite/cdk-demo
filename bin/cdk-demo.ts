#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
// import { CdkDemoStack } from '../lib/cdk-demo-stack';
import { CDKDemoPiplelineStack } from '../lib/cdk-demo-pipeline-stack';

const app = new cdk.App();
// new CdkDemoStack(app, 'CdkDemoStack');
console.log('accout  ', process.env.account);
console.log('region ', process.env.region);
new CDKDemoPiplelineStack(app, 'CdkDemoPipelineStack', {
    env: {
        account: process.env.account,
        region: process.env.region
    }
});

