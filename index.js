import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { DynamoDBClient, PutCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

// Create service clients
const s3 = new S3Client({ region: process.env.AWS_REGION });
const lambda = new LambdaClient({ region: process.env.AWS_REGION });
const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
const sns = new SNSClient({ region: process.env.AWS_REGION });
const sqs = new SQSClient({ region: process.env.AWS_REGION });

// 1. Upload a file to S3
const uploadParams = {
  Bucket: process.env.S3_BUCKET,
  Key: process.env.S3_KEY,
  Body: "Hello, world!",
};

const uploadParams2 = {
  Bucket: process.env.S3_BUCKET_1,
  Key: process.env.S3_KEY,
  Body: "Hello, world!",
};

const uploadParams3 = {
  Bucket: "my_bucket_2",
  Key: process.env.S3_KEY,
  Body: "Hello, world!",
};

s3.send(new PutObjectCommand(uploadParams))
  .then((data) => {
    console.log("Upload Success");

    // 2. Invoke a Lambda function
    const lambdaParams = {
      FunctionName: process.env.LAMBDA_FUNCTION,
      Payload: JSON.stringify({
        key: process.env.S3_KEY,
        bucket: process.env.S3_BUCKET,
      }),
    };

    lambda
      .send(new InvokeCommand(lambdaParams))
      .then((data) => {
        console.log("Lambda Success");

        // 3. Write to DynamoDB
        const dynamoParams = {
          TableName: process.env.DYNAMODB_TABLE,
          Item: {
            id: { S: "123" },
            data: { S: "Hello, world!" },
          },
        };

        dynamodb
          .send(new PutCommand(dynamoParams))
          .then((data) => {
            console.log("DynamoDB Write Success");

            // 4. Publish to SNS
            const snsParams = {
              Message: "Hello, world!",
              TopicArn: process.env.SNS_TOPIC_ARN,
            };

            sns
              .send(new PublishCommand(snsParams))
              .then((data) => {
                console.log("SNS Publish Success");

                // 5. Send a message to SQS
                const sqsParams = {
                  MessageBody: "Hello, world!",
                  QueueUrl: process.env.SQS_QUEUE_URL,
                };

                sqs
                  .send(new SendMessageCommand(sqsParams))
                  .then((data) => {
                    console.log("SQS Send Message Success");
                  })
                  .catch((err) => console.log("SQS Error", err));
              })
              .catch((err) => console.log("SNS Error", err));
          })
          .catch((err) => console.log("DynamoDB Error", err));
      })
      .catch((err) => console.log("Lambda Error", err));
  })
  .catch((err) => console.log("S3 Upload Error", err));

s3.send(uploadParams2);
s3.send(uploadParams3);
