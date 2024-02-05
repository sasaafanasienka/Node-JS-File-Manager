import path from 'path';
import { access, stat } from "node:fs/promises"
import { constants } from 'fs';

export class PathMaker {
  constructor({manager}) {
    this.manager = manager
  }

  _getAbsolutePath = (pathString) => {
    return path.isAbsolute(pathString) ? pathString : path.join(...this.manager.currentDir, pathString);
  }

  checkIfPathExists = async (pathString) => {
    const targetPath = this._getAbsolutePath(pathString);
    try {
      await access(targetPath, constants.R_OK | constants.W_OK);
      return targetPath
    } catch {
      // this.manager.throwError(`Path ${targetPath} does not exist`);
      return undefined
    } 
  }

  checkIfPathFree = async (pathString) => {
    const targetPath = this._getAbsolutePath(pathString);
    try {
      await access(targetPath, constants.F_OK);
      // this.manager.throwError(`Path ${targetPath} is already taken`);
      return undefined
    } catch {
      return targetPath
    }
  }

  checkIfPathIsDirectory = async (pathString) => {
    const targetPath = this._getAbsolutePath(pathString);
    try {
      const stats = await stat(targetPath);
      if (!stats.isDirectory()) {
        this.manager.throwError(`Path ${targetPath} is not a directory`);
      }
      return targetPath
    } catch {
      // this.manager.throwError(`Path ${targetPath} does not exist`);
      return undefined
    }
  }

  checkPathType = async (pathString) => {
    const targetPath = this._getAbsolutePath(pathString);
    try {
      const stats = await stat(targetPath);
      return {targetPath, type: stats.isFile() ? 'file' : stats.isDirectory() ? 'dir' : undefined}
    } catch {
      // this.manager.throwError(`Path ${targetPath} does not exist`);
      return {
        targetPath: undefined,
        type: undefined
      }
    }
  }
}
