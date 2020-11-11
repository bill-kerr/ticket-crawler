import stream from 'stream';
import { Config, S3 } from 'aws-sdk';
import config from './config';

export interface PdfFile {
  filename: string;
  buffer: Buffer;
}

const awsConfig = new Config({
  region: config.s3Region,
  credentials: {
    accessKeyId: config.s3AccessKeyId,
    secretAccessKey: config.s3SecretAccessKey,
  },
});

export function upload(
  filename: string,
  callback: (err: Error, data: S3.ManagedUpload.SendData) => void
) {
  const s3 = new S3(awsConfig);
  const pass = new stream.PassThrough();

  s3.upload(
    {
      Bucket: config.s3Bucket,
      Key: config.s3DownloadsPath + filename,
      Body: pass,
    },
    (err, data) => {
      if (err) {
        console.error(err);
        callback(err, data);
        return;
      }
      console.log(`Saved ${data.Location} to AWS S3...`);
      callback(err, data);
    }
  );

  return pass;
}

export function uploadFromBytes(bytes: Uint8Array, filename: string) {
  return new Promise<void>((resolve, reject) => {
    const s3 = new S3(awsConfig);
    s3.upload({ Bucket: config.s3Bucket, Key: filename, Body: Buffer.from(bytes) }, (err, data) => {
      if (err) {
        console.error(err);
        return reject(new Error('The upload failed.'));
      }
      console.log(`Uploaded buffer data to ${data.Location} in AWS S3...`);
      return resolve();
    });
  });
}

export function getFile(filename: string): Promise<PdfFile> {
  return new Promise((resolve, reject) => {
    const s3 = new S3(awsConfig);
    s3.getObject({ Bucket: config.s3Bucket, Key: filename }, (err, data) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve({ filename, buffer: data.Body as Buffer });
    });
  });
}

export async function getFiles(filenames: string[]): Promise<PdfFile[]> {
  return Promise.all(filenames.map(async filename => await getFile(filename)));
}
