import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip, createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream'

export class CompressManager {
  constructor({manager}) {
    this.manager = manager
  }

  commandHandler = (commandParts) => {
    const commandName = commandParts[0]
    switch (commandName) {
      case 'compress':
        this.compress(commandParts)
        break
      case 'decompress':
        this.decompress(commandParts)
        break
      default:
        this.manager.throwError('Unknown compress command')
        break
    }
  }

  compress = (commandParts) => {
    const originPath = commandParts[1] ?? ''
    const targetPath = commandParts[2] ?? ''
    
    Promise.all([
      this.manager.pathMaker.checkIfPathExists(originPath),
      this.manager.pathMaker.checkIfPathFree(targetPath),
    ]).then(([originPath, targetPath]) => {
      if (!originPath) {
        this.manager.throwError(`Origin path does not exists`)
        return
      }
      if (!targetPath) {
        this.manager.throwError(`Target Path is already taken`)
        return
      }
      const gzip = createGzip();
      const source = createReadStream(originPath);
      const destination = createWriteStream(targetPath);
      destination.on('finish', () => {
        this.manager.message(`Successfully compressed`)
      })
      pipeline(source, gzip, destination, (err) => {
        if (err) {
          this.manager.throwError(`Error while compress: ${err}`)
        }
      });
    })
  }
  
  decompress = (commandParts) => {
    const originPath = commandParts[1] ?? ''
    const targetPath = commandParts[2] ?? ''
    Promise.all([
      this.manager.pathMaker.checkIfPathExists(originPath),
      this.manager.pathMaker.checkIfPathFree(targetPath),
    ]).then(([originPath, targetPath]) => {
      if (!originPath) {
        this.manager.throwError(`Origin path does not exists`)
        return
      }
      if (!targetPath) {
        this.manager.throwError(`Target Path is already taken`)
        return
      }
      const readStream = createReadStream(originPath)
      const gunzip = createGunzip()
      const writeStream = createWriteStream(targetPath)
      writeStream.on('finish', () => {
        this.manager.message(`Successfully decompressed`)
      })
      
      pipeline(readStream, gunzip, writeStream, (err) => {
        if (err) {
          this.manager.throwError(`Error while decompress: ${err}`)
        }
      });
    })
  }
}