import { validateStartParams } from "../helpers/validation/validateStartParams.js";
import { homedir } from 'os';
import path from "path";

export class FileManager {
  constructor() {
    this.process = undefined;
    this.username = undefined;
    this.homedir = homedir()
    this.currentDir = homedir().split(path.sep);
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
      this.throwError('Incorrect username flag')
      // this.exit()
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
        this.upHandler(commandParts)
        break
      case 'ls':
        // this.listDir()
        // break
      case 'exit':
        // this.exit()
        // break
      default:
        this.throwError('Incorrect command')
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

  showCurrentDir = () => {
    this.message(`You are currently in ${this.currentDir.join(path.sep)}`)
  }

  throwError = (message = 'Something went wrong', exit = false) => {
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