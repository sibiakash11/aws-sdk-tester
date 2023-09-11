import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const { AWS_S3_BUCKET_NAME, AWS_DEFAULT_REGION } = process.env;

const s3Client = new S3Client({ region: AWS_DEFAULT_REGION }); // S3 Client SDK will pick up credentials from the env variables loaded by dotenv

async function putTextObject(body = "", key = "my_test_object.txt") {
  const putObjectCommand = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
    Body: body,
  });

  return await s3Client.send(putObjectCommand);
}

putTextObject("My test object").then(console.log).catch(console.error);
