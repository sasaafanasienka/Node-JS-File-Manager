import { readdir, stat } from "fs/promises";
import { validateStartParams } from "./helpers/validation/validateStartParams.js";
import { homedir } from 'os';
import path from "path";
import { TableMaker } from "./table-maker/table-maker.js";
import { PathMaker } from "./path-maker/path-maker.js";
import { OsManager } from "./os-manager/os-manager.js";
import { HashManager } from "./hash-manager/hash-manager.js";
import { CompressManager } from "./compress-manager/compress-manager.js";
import { FileManager } from "./file-manager/file-manager.js";

export class Cli {
  constructor() {
    this.process = undefined;
    this.username = undefined;
    this.homedir = homedir()
    this.currentDir = homedir().split(path.sep);
    this.fileManager = new FileManager({manager: this})
    this.tableMaker = new TableMaker()
    this.pathMaker = new PathMaker({ manager: this })
    this.osManager = new OsManager({ manager: this })
    this.hashManager = new HashManager({ manager: this })
    this.compressManager = new CompressManager({manager: this})

  }

  init = () => {
    this.process = process

    const [flag, username] = process.argv[2]?.split('=') ?? []
    const isParamsValid = validateStartParams({flag, username})
    if (isParamsValid) {
      this.username = username
      this.message(`Welcome to the File Manager, ${this.username}!`)
      this.showCurrentDir()
    } else {
      this.throwError('Incorrect username flag', true)
    }

    this.addSigIntHandler()
    this.addInputHandler()
  }

  addInputHandler = () => {
    this.process.stdin.on('data', this.inputHandler)
  }
  
  inputHandler = (command) => {
    const commandParts = command.toString().trim().split(' ');
    const commandName = commandParts[0];
    switch (commandName) {
      case 'up':
        this.upHandler()
        break
      case 'cd':
        this.cdHandler(commandParts)
        break
      case 'ls':
        this.lsHandler()
        break
      case 'cat':
      case 'add':
      case 'rn':
      case 'cp':
      case 'cp':
      case 'mv': 
      case 'rm':
        this.fileManager.commandHandler(commandParts)
        break
      case 'os':
        this.osManager.commandHandler(commandParts);
        break
      case 'hash':
        this.hashManager.commandHandler(commandParts)
        break
      case 'compress':
      case 'decompress':
        this.compressManager.commandHandler(commandParts)
        break
      default:
        this.throwError()
    }
  }

  addSigIntHandler = () => {
    process.on('SIGINT', this.sigIntHandler)
  }

  sigIntHandler = () => {
    this.message(`Thank you for using File Manager, ${this.username}, goodbye!`)
    this.exit()
  }

  upHandler = () => {
    this.currentDir = this.currentDir.length > 1 ? this.currentDir.slice(0, -1) : this.currentDir
    this.showCurrentDir();
  }

  cdHandler = async (commandParts) => {
    this.pathMaker.checkIfPathExists(commandParts[1]).then(async targetPath => {
      try {
        const dir = await readdir(targetPath)
        if (dir) {
          this.currentDir = targetPath.split(path.sep)
          this.showCurrentDir()
        } else {
          this.throwError('Incorrect path')
        }
      } catch (error) {
        this.throwError('Incorrect path')
      }
    })
  }

  lsHandler = async () => {
    const list = await readdir(path.join(...this.currentDir))
    const header = ['Index', 'Name', 'Type']
    const listData = Promise.all(list.map(async (element, index) => {
      const fileStat = await stat(path.join(...this.currentDir, element))
      return [index, element, fileStat.isFile() ? 'File' : 'Dir']
    }))

    const tableData = await listData;
    this.tableMaker.showTable([header, ...tableData]);
    this.showCurrentDir();
  }

  showCurrentDir = () => {
    this.message(`You are currently in ${this.currentDir.join(path.sep)}`)
  }

  throwError = (message = 'Operation failed', exit = false) => {
    console.error('ERROR')
    console.error(message)
    if (!exit) {
      this.showCurrentDir()
    }
    if (exit) {
      this.exit()
    }
  }

  message = (text = 'Empty message') => {
    console.log(text)
  }

  exit = (code = 1) => {
    this.process.exit(code)
  }
}