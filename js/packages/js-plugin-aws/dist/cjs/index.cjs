'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var clientS3 = require('@aws-sdk/client-s3');
var js = require('@metaplex-foundation/js');

class AwsStorageDriver {
  constructor(client, bucketName) {
    this.client = client;
    this.bucketName = bucketName;
  }

  async getUploadPrice(_bytes) {
    return js.lamports(0);
  }

  async upload(file) {
    const command = new clientS3.PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.uniqueName,
      Body: file.buffer,
      ContentType: file.contentType || undefined
    });

    try {
      await this.client.send(command);
      return await this.getUrl(file.uniqueName);
    } catch (err) {
      // TODO: Custom errors.
      throw err;
    }
  }

  async getUrl(key) {
    const region = await this.client.config.region();
    const encodedKey = encodeURIComponent(key);
    return `https://s3.${region}.amazonaws.com/${this.bucketName}/${encodedKey}`;
  }

}

const awsStorage = (client, bucketName) => ({
  install(metaplex) {
    metaplex.storage().setDriver(new AwsStorageDriver(client, bucketName));
  }

});

exports.AwsStorageDriver = AwsStorageDriver;
exports.awsStorage = awsStorage;
//# sourceMappingURL=index.cjs.map
