export class TableMaker {

  constructor({
    maxNameLength,
    columnsTemplate
  } = {}) {
    this.maxLength = maxNameLength ?? 30
    this.columns = columnsTemplate ?? [8, this.maxLength + 2, 6]
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
    this.showRow({element: 'Name', index: 'Index', type: 'Type'})
    this.showDivider()
  }

  showDivider = () => {
    const rowLength = this.columns.reduce((acc, curr) => acc + curr) + this.columns.length + 1
    console.log(Array(rowLength).fill('-').join(''));
  }

  showRow = ({ element = "", index = "", type="" }) => {
    if (element.length > this.maxLength) {
      Array(Math.ceil(element.length / this.maxLength)).fill('').map((_, index) => {
        return element.slice(index * this.maxLength, this.maxLength * (index + 1))
      }).forEach((elementPart, partIndex) => {
        this.showRow({ element: elementPart, index: partIndex > 0 ? '' : index })
      })
    } else {
      console.log(`|${this.getColumn(this.columns[0], index )}|${this.getColumn(this.columns[1], element )}|${this.getColumn(this.columns[2], type )}|`)
    }
  }

  getColumn = (width, content, spacingSymbol = ' ') => {
    return ` ${String(content).slice(0, width - 2)}`.padEnd(width, spacingSymbol) ;
  }
}