// import path from 'node:path';
import {createHash} from 'crypto';
import { createReadStream } from 'node:fs';

export class HashManager {
  constructor({manager}) {
    this.manager = manager
  }

  calculate = async (filePath) => {
    const readStream = createReadStream(filePath)
    let result = ''
    readStream.on('data', (data) => {
        result = result + data
    })
    readStream.on('end', () => {
      const hash = createHash('sha256')
      const hashString = hash.update(result).digest('hex')
      this.manager.message(hashString)
    })
  }
}