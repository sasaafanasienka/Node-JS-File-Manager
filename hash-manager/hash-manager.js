// import path from 'node:path';
import {createHash} from 'crypto';
import { createReadStream } from 'node:fs';

export class HashManager {
  constructor({manager}) {
    this.manager = manager
  }

  commandHandler = async (commandParts) => {
    const filePath = commandParts[1]
    this.calculate(filePath)
  }

  calculate = async (filePath) => {
    this.manager.pathMaker.checkIfPathExists(filePath).then((filePath) => {
      if (filePath) {
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
      } else {
        this.manager.throwError(`Path does not exist`)
      }
    })
  }
}