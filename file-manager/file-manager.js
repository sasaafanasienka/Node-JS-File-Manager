import { readFile, readdir, writeFile, rename, rm, rmdir, copyFile } from "fs/promises";
import { validateStartParams } from "../helpers/validation/validateStartParams.js";
import { homedir } from 'os';
import path from "path";
import { TableMaker } from "../table-maker/table-maker.js";
import { PathMaker } from "../path-maker/path-maker.js";
import { createReadStream } from "fs";
import { OsManager } from "../os-manager/os-manager.js";
import { HashManager } from "../hash-manager/hash-manager.js";
import { CompressManager } from "../compress-manager/compress-manager.js";

export class FileManager {
  constructor({manager}) {
    this.manager = manager;
    this.tableMaker = new TableMaker()
    this.manager.pathMaker = manager.pathMaker
  }

  commandHandler = (commandParts) => {
    const commandName = commandParts[0];
    switch (commandName) {
      case 'cat':
        this.catHandler(commandParts)
        break
      case 'add':
        this.addHandler(commandParts)
        break
      case 'rn':
        this.rnHandler(commandParts)
        break
      case 'cp':
        this.cpHandler(commandParts)
        break
      case 'mv': 
        this.mvHandler(commandParts)
        break
      case 'rm':
        this.rmHanlder(commandParts)
        break
      default:
        this.manager.throwError()
    }
  }

  catHandler = async (commanParts) => {
    this.manager.pathMaker.checkIfPathExists(commanParts[1]).then(targetPath => {
      if (targetPath) {
        const readStream = createReadStream(targetPath)
        readStream.on('data', (chunk) => {
          this.manager.message(chunk.toString('utf-8'), false)
        })
        readStream.on('end', () => {
          this.manager.message(undefined);
        })
      }
    }).catch(_ => {
      this.manager.throwError('Something went wrong')
    })
  };

  addHandler = async (commandParts) => {
    this.manager.pathMaker.checkIfPathFree(commandParts[1]).then(async targetPath => {
      if (targetPath) {
        try {
          await writeFile(targetPath, commandParts[2] ?? '', {encoding: 'utf-8'})
          this.manager.message(`${commandParts[2] ? 'File' : 'Empty file'} ${commandParts[1]} was created in ${this.manager.currentDir.join('/')}`)
        } catch (error) {
          this.manager.throwError('Something went wrong')
        }
      } else {
        this.manager.throwError('Something went wrong')
      }
    })
  }

  //Надо переписать
  rnHandler = async (commandParts) => {
    const originPath = path.join(commandParts[1])
    const newName = path.join(commandParts[2])
    Promise.all([
      this.manager.pathMaker.checkIfPathExists(originPath),
      this.manager.pathMaker.checkIfPathFree(newName)
    ]).then(async ([originPath, newNamePath]) => {
      if (!originPath) {
        this.manager.throwError('Origin path does not exists')
      } else if (!newNamePath) {
        this.manager.throwError('Target path has been already taken')
      } else {
        try {
          await rename(originPath, newNamePath)
          this.manager.message(`File ${originPath} was renamed to ${newName}`)
        } catch (error) {
          this.manager.throwError('Something went wrong')
        }
      }
    })
  }

  cpHandler = async (commandParts, move = false) => {
    const originPath = commandParts[1] ?? ''
    const targetFolderPath = commandParts[2] ?? ''

    Promise.all([
      this.manager.pathMaker.checkPathType(originPath),
      this.manager.pathMaker.checkPathType(targetFolderPath),
    ]).then(([{ type: originType }, { type: targetType }]) => {
      if (originType === 'dir') {
        throw new Error('Origin path is not a file')
      }
      if (targetType === 'file') {
        throw new Error('Target path is not a directory')
      }
    }).then(() => {
      const originFileName = path.basename(originPath)
      const targetFilePath = path.join(targetFolderPath, originFileName)
      return Promise.all([
        this.manager.pathMaker.checkIfPathExists(originPath),
        this.manager.pathMaker.checkIfPathFree(targetFilePath),
      ]).then(async ([originPath, targetPath]) => {
  
        if (!originPath) {
          throw new Error('Origin file does not exist')
        }
        if (!targetPath) {
          throw new Error('Target file already exists')
        }
        try {
          await copyFile(originPath, targetPath)
          if (move) {
            this.rmHanlder(commandParts, false)
          }
          this.manager.message(`File ${originPath} was ${move ? 'moved' : 'copied'} to ${targetPath}`)
        } catch (error) {
          this.manager.throwError('Something went wrong')
        }
      })
    }).catch(error => {
      this.manager.throwError(error.message)
    })
  }

  rmHanlder = async (commandParts, withMessage = true) => {
    this.manager.pathMaker.checkPathType(commandParts[1]).then(async ({targetPath, type}) => {
      if (type) {
        try {
          if (type === 'dir') {
            await rmdir(targetPath)
            if (withMessage) {
              this.manager.message(`Directory ${commandParts[1]} was deleted`)
            }
          } else if (type === 'file') {
            await rm(targetPath)
            if (withMessage) {
              this.manager.message(`File ${commandParts[1]} was deleted`)
            }
          } else {
            throw new Error('Something went wrong')
          }
        } catch (error) {
          this.manager.throwError(error ?? 'Something went wrong')
        }
      } else {
        this.manager.throwError('Something went wrong')
      }
    })
  }

  mvHandler = async (commandParts) => {
    this.cpHandler(commandParts, true);
  }
}