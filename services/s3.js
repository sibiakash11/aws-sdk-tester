import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default class Client {
  constructor() {
    this.s3 = new S3Client({ region: process.env.AWS_REGION });
  }

  async uploadFile(uploadParams) {
    return await this.s3.send(new PutObjectCommand(uploadParams));
  }
}
