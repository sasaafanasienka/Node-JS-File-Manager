export class TableMaker {

  constructor() {
    this.maxLength = 32
    this.columns = [8, 32, 12]
  }

  showTable = (list) => {
    this.showHeader();
    list.forEach((element, index) => {
      this.showRow({element, index})
    })
    this.showDivider()
  }

  showHeader = () => {
    this.showDivider()
    this.showRow({element: 'Name', index: 'Index'})
    this.showDivider()
  }

  showDivider = () => {
    console.log(this.columns.map((width) => '-'.repeat(width - 2)).join(''))
  }

  showRow = ({element, index}) => {
    console.log(`|${this.getColumn(this.columns[0], index )}|${this.getColumn(this.columns[1], element )}|`)
  }

  getColumn = (width, content, spacingSymbol = ' ') => {
    return ` ${String(content).slice(0, width - 2)}`.padEnd(width, spacingSymbol) ;
  }
}