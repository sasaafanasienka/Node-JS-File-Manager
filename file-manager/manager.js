import { validateStartParams } from "../helpers/validation/validateStartParams.js";

export class FileManager {
  constructor() {
    this.process = undefined;
    this.username = undefined;
  }

  init = () => {
    this.process = process
    const [flag, username] = process.argv[2]?.split('=') ?? []
    const isParamsValid = validateStartParams({flag, username})
    if (isParamsValid) {
      this.username = username
      this.message(`Welcome to the File Manager, ${this.username}!`)
    } else {
      this.throwError('Incorrect username flag')
      // this.exit()
    }
    this.addSigIntHandler()
    this.addInputHandler()
    // const value = process.stdin
  }

  addInputHandler = () => {
    this.process.stdin.on('data', this.inputHandler)
  }
  
  inputHandler = (data) => {
    console.log(data.toString())
  }

  addSigIntHandler = () => {
    process.on('SIGINT', this.sigIntHandler)
  }

  sigIntHandler = () => {
    this.message(`Thank you for using File Manager, ${this.username}, goodbye!`)
    this.exit()
  }

  throwError = (message = 'Something went wrong') => {
    console.error('ERROR')
    console.error(message)
    this.exit()
  }

  message = (text = 'Empty message') => {
    console.log(text)
  }

  exit = (code = 1) => {
    this.process.exit(code)
  }
}