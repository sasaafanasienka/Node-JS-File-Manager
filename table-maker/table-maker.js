export class TableMaker {

  showTable = (list) => {
    const columnsAmount = list.reduce((acc, curr) => {
      return curr.length > acc ? curr.length : acc
    }, 0)
    
    const columnsTemplate = Array(columnsAmount).fill(undefined).map((_, index) => {
      return list.map(el => el[index]).reduce((acc, curr) => {
        return curr.length > acc ? curr.length : acc
      }, 0)
    }).map(el => el + 2)

    this.showDivider(columnsTemplate)
    
    this.showRow({
      columnsTemplate,
      content: list[0]
    })

    this.showDivider(columnsTemplate)

    list.slice(1).forEach((element) => {
      this.showRow({
        columnsTemplate,
        content: element,
      })
    })

    this.showDivider(columnsTemplate)
  }

  showDivider = (columnsTemplate) => {
    const rowLength = columnsTemplate.reduce((acc, curr) => acc + curr) + columnsTemplate.length + 1
    console.log(Array(rowLength).fill('-').join(''));
  }

  showRow = ({ columnsTemplate, content }) => {
    const row = columnsTemplate.map((width, index) => {
      return this.getColumn(width, content[index])
    })
    console.log(`|${row.join('|')}|`)
  }

  getColumn = (width, content, spacingSymbol = ' ') => {
    return ` ${String(content).slice(0, width - 2)}`.padEnd(width, spacingSymbol) ;
  }
}