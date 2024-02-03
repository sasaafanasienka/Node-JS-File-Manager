import path from 'path';

export class PathMaker {
  constructor({manager}) {
    this.manager = manager
  }

  normalize = (pathString) => {
    if (path.isAbsolute(pathString)) {
      return pathString;
    } else {
      return path.join(...this.manager.currentDir, pathString);
    }
  }
}