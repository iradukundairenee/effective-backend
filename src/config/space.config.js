const AWS = require('aws-sdk');

const { SPACES_ENDPOINT, SPACES_KEY, SPACES_SECRET } = process.env;

const spacesEndpoint = new AWS.Endpoint(SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: SPACES_KEY,
  secretAccessKey: SPACES_SECRET,
});

export default s3;
