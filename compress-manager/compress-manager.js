import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip, createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream'
import path from 'node:path';

export class CompressManager {
  constructor({manager}) {
    this.manager = manager
  }

  compress = () => {
    const txtPath = path.join('src/zip/files/fileToCompress.txt');
    const zipPath = path.join('src/zip/files/archive.gz');

    const gzip = createGzip();
    const source = createReadStream(txtPath);
    const destination = createWriteStream(zipPath);

    pipeline(source, gzip, destination, (err) => {
      if (err) {
        console.error('An error occurred:', err);
        process.exitCode = 1;
      }
    });
  }

  decompress = () => {
    const txtPath = path.join('src/zip/files/fileToCompress.txt');
    const zipPath = path.join('src/zip/files/archive.gz');

    const readStream = createReadStream(zipPath)
    const gunzip = createGunzip()
    const writeStream = createWriteStream(txtPath)

    pipeline(readStream, gunzip, writeStream, (err) => {
        if (err) {
            console.error('Произошла ошибка:', err);
            process.exitCode = 1;
        }
    });
  }
}