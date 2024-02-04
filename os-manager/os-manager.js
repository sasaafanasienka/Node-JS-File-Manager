import os from 'node:os';
import { TableMaker } from '../table-maker/table-maker.js';

export class OsManager {
  constructor({ manager }) {
    this.manager = manager
    this.os = os
    this.availableCommands = {
      eol: '--EOL',
      cpus: '--cpus',
      homedir: '--homedir',
      username: '--username',
      architecture: '--architecture',
    }
    this.tableMaker = new TableMaker({
      columnsTemplate: [8, 32, 10]
    })
  }

  commandHandler = (commandParts) => {
    const command = this.validateCommand(commandParts)
    if (!command) {
      this.manager.throwError('Unknown OS command')
    } else {
      switch (command) {
        case this.availableCommands.eol:
          this.eolHandler()
          break;
        case this.availableCommands.cpus:
          this.cpusHandler()
          break
        case this.availableCommands.homedir:
          this.homedirHandler()
          break;
        case this.availableCommands.username:
          this.usernameHandler()
          break
        case this.availableCommands.architecture:
          this.architectureHandler();
          break
        default:
          break;
      }
    }
  }

  eolHandler = () => {
    this.manager.message(this.os.EOL)
  }

  cpusHandler = () => {
    const cpus = this.os.cpus();
    this.manager.message(`Total CPUs amount ${cpus.length}`)
    const cpusList = cpus.map((cpu, index) => {
      return {
        index,
        element: cpu.model,
        type: `${(cpu.speed / 1000).toFixed(2)} GHz`
      }
    })
    // this.tableMaker.showTable(cpusList)
    cpusList.forEach(cpu => {
      this.manager.message('')
      this.manager.message(cpu.element)
      this.manager.message(cpu.type)
    })
  }

  homedirHandler = () => {
    this.manager.message(this.os.homedir())
  }

  usernameHandler = () => {
    const {username} = this.os.userInfo();
    this.manager.message(username)
  }

  architectureHandler = () => {
    this.manager.message(process.arch)
  }
  

  
  validateCommand = (commandParts) => {
    const command = commandParts[1]
    return Object.values(this.availableCommands).includes(commandParts[1]) ? commandParts[1] : undefined
  }
}