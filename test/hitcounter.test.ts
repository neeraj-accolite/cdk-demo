import { Template, Capture } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { HitCounter } from '../lib/hitcounter';

test("Dynamo DB Created", () => {
    const stack = new cdk.Stack();

    //when

    new HitCounter(stack, 'TestConstruct', {
        downstream: new lambda.Function(stack, 'TestFunction', {
            runtime: lambda.Runtime.NODEJS_LATEST,
            handler: 'profileDetails.handler',
            code: lambda.Code.fromAsset("handlers")
        })
    })

    //Then
    const template = Template.fromStack(stack);
    template.resourceCountIs("AWS::DynamoDB::Table", 1);
});
test('Lambda Has Environment Variables', () => {
    const stack = new cdk.Stack();
    // WHEN
    new HitCounter(stack, 'MyTestConstruct', {
        downstream: new lambda.Function(stack, 'TestFunction', {
            runtime: lambda.Runtime.NODEJS_LATEST,
            handler: 'profileDetails.handler',
            code: lambda.Code.fromAsset('handlers')
        })
    });
    // THEN
    const template = Template.fromStack(stack);
    const envCapture = new Capture();
    template.hasResourceProperties("AWS::Lambda::Function", {
        Environment: envCapture,
    });

    expect(envCapture.asObject()).toEqual(
        {
            Variables: {
                DOWNSTREAM_FUNCTION_NAME: {
                    Ref: "TestFunction22AD90FC",
                },
                HITS_TABLE_NAME: {
                    Ref: "MyTestConstructHits24A357F0",
                },
            },
        }
    );
});


test('DynamoDB Table Created With Encryption', () => {
    const stack = new cdk.Stack();
    // WHEN
    new HitCounter(stack, 'MyTestConstruct', {
        downstream: new lambda.Function(stack, 'TestFunction', {
            runtime: lambda.Runtime.NODEJS_LATEST,
            handler: 'profileDetails.handler',
            code: lambda.Code.fromAsset('handlers')
        })
    });
    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::DynamoDB::Table', {
        SSESpecification: {
            SSEEnabled: true
        }
    });
});

test('Configure read capacity', () => {
    const stack = new cdk.Stack();

    expect(() => {
        new HitCounter(stack, 'SmallReadCapacityConstruct', {
            downstream: new lambda.Function(stack, 'SmallReadCapacityFunction', {
                runtime: lambda.Runtime.NODEJS_LATEST,
                handler: 'profileDetails.handler',
                code: lambda.Code.fromAsset('handlers')
            }),
            readCapacity: 23
        })
    }).toThrow(/readCapacity should be between 5 and 20/);

    expect(() => {
        new HitCounter(stack, 'OverusedReadCapacityConstruct', {
            downstream: new lambda.Function(stack, 'OverusedReadCapacityFunction', {
                runtime: lambda.Runtime.NODEJS_LATEST,
                handler: 'profileDetails.handler',
                code: lambda.Code.fromAsset('handlers')
            }),
            readCapacity: 4
        })
    }).toThrow(/readCapacity should be between 5 and 20/);

});