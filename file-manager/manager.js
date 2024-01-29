import { USERNAME_FLAG } from "../shared/variables.js";

export class FileManager {
  constructor() {
    this.username = undefined;
  }

  init = () => {
    const [flag, username] = process.argv[2]?.split('=') ?? []
    const isParamsValid = this.validateParams({ flag, username })
    if (isParamsValid) {
      this.username = username
      this.message(`Welcome to the File Manager, ${this.username}!`)
    }
  }

  validateParams = ({ flag, username }) => {
    if (!flag || flag !== USERNAME_FLAG) {
      this.throwError('Incorrect flag')
    }
    if (!username) {
      this.throwError('Incorrect username')
    }
    return true
  }

  throwError = (message = 'Something went wrong') => {
    console.error('ERROR')
    console.error(message)
    process.exit(1)
  }

  message = (text = 'Empty message') => {
    console.log(text)
  }
}