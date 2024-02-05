import os from 'node:os';
import { TableMaker } from '../table-maker/table-maker.js';

export class OsManager {
  constructor({ manager }) {
    this.manager = manager
    this.tableMaker = new TableMaker({
      columnsTemplate: [8, 32, 10]
    })
  }

  commandHandler = (commandParts) => {
    switch (commandParts[1] ?? '') {
      case '--EOL':
        this.eolHandler()
        break;
      case '--cpus':
        this.cpusHandler()
        break
      case '--homedir':
        this.homedirHandler()
        break;
      case '--username':
        this.usernameHandler()
        break
      case '--architecture':
        this.architectureHandler();
        break
      default:
        this.manager.throwError('Unknown OS command')
        break;
    }
  }

  eolHandler = () => {
    this.manager.message(JSON.stringify(os.EOL))
  }

  cpusHandler = () => {
    const cpus = os.cpus();
    this.manager.message(`Total CPUs amount ${cpus.length}`, false)
    const header = ['Index', 'Model', 'Speed']
    const cpusList = cpus.map((cpu, index) => {
      return [
        index, cpu.model,`${(cpu.speed / 1000).toFixed(2)} GHz`
      ]
    })
    this.tableMaker.showTable([header, ...cpusList])
    this.manager.message(undefined)
  }

  homedirHandler = () => {
    this.manager.message(os.homedir())
  }

  usernameHandler = () => {
    const {username} = os.userInfo();
    this.manager.message(username)
  }

  architectureHandler = () => {
    this.manager.message(process.arch)
  }
 
  // validateCommand = (commandParts) => {
  //   const command = commandParts[1]
  //   return Object.values(this.availableCommands).includes(commandParts[1]) ? commandParts[1] : undefined
  // }
}