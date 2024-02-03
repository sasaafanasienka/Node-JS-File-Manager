import { readFile, readdir } from "fs/promises";
import { validateStartParams } from "../helpers/validation/validateStartParams.js";
import { homedir } from 'os';
import path from "path";
import { TableMaker } from "../table-maker/table-maker.js";
import { PathMaker } from "../path-maker/path-maker.js";

export class FileManager {
  constructor() {
    this.process = undefined;
    this.username = undefined;
    this.homedir = homedir()
    this.currentDir = homedir().split(path.sep);
    this.tableMaker = new TableMaker()
    this.pathMaker = new PathMaker({manager: this})
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
    // const value = process.stdin
  }

  //#region MAIN HANDLERS

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
        this.catHandler(commandParts)
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

  //#endregion

  upHandler = () => {
    this.currentDir = this.currentDir.length > 1 ? this.currentDir.slice(0, -1) : this.currentDir
    this.showCurrentDir();
  }

  cdHandler = async (commandParts) => {
    const targetPath = this.pathMaker(commandParts[1])

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
  }

  lsHandler = async () => {
    const list = await readdir(path.join(...this.currentDir))
    this.tableMaker.showTable(list)
    // console.log(list)
  }

  catHandler = async (commanParts) => {
    const targetPath = this.pathMaker.normalize(commanParts[1])
    const fileContent = await readFile(targetPath, 'utf-8')
    console.log(fileContent)
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