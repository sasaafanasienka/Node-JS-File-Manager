import path from 'path';
import { access } from "node:fs/promises"
import { constants } from 'fs';

export class PathMaker {
  constructor({manager}) {
    this.manager = manager
  }

  normalizePath = async (pathString) => {
    const targetPath = path.isAbsolute(pathString) ? pathString : path.join(...this.manager.currentDir, pathString);

    try {
      await access(targetPath, constants.R_OK | constants.W_OK);
      return targetPath
    } catch {
      this.manager.throwError(`Path ${targetPath} does not exist`);
      return undefined
    } 
  }

}
