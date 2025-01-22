const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.AWS_S3_ENDPOINT),
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  token: process.env.AWS_TOKEN,
  signatureVersion: process.env.AWS_SIGNATURE_VERSION,
});

module.exports = s3;