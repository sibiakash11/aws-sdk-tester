import {
  S3Client,
  PutObjectCommand,
  GetBucketAclCommand,
} from "@aws-sdk/client-s3";

export default class Client {
  constructor() {
    this.s3 = new S3Client({ region: process.env.AWS_REGION });
  }

  async uploadFile(params) {
    return await this.s3.send(new PutObjectCommand(params));
  }

  async getBucketAcl(params) {
    return await this.s3.send(new GetBucketAclCommand(params));
  }
}
