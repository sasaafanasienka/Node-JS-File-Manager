import path from 'path';
import { access } from "node:fs/promises"
import { constants } from 'fs';

export class PathMaker {
  constructor({manager}) {
    this.manager = manager
  }

  _getAbsolutePath = (pathString) => {
    return path.isAbsolute(pathString) ? pathString : path.join(...this.manager.currentDir, pathString);
  }

  normalizePath = async (pathString) => {
    const targetPath = this._getAbsolutePath(pathString);
    try {
      await access(targetPath, constants.R_OK | constants.W_OK);
      return targetPath
    } catch {
      this.manager.throwError(`Path ${targetPath} does not exist`);
      return undefined
    } 
  }

  checkIfPathFree = async (pathString) => {
    const targetPath = this._getAbsolutePath(pathString);
    try {
      await access(targetPath, constants.R_OK | constants.W_OK);
      this.manager.throwError(`Path ${targetPath} is already taken`);
      return undefined
    } catch {
      return targetPath
    }
  }
}
