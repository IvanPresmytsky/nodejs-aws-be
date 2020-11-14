export const getUrls = (files, bucketName) => files
  .filter(file => file.Size)
  .map(file => `https://${bucketName}.s3.amazonaws.com/${file.Key}`);
