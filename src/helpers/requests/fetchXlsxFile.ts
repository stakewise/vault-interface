type FileFormat = 'xlsx' | 'csv'

const contentTypes: Record<FileFormat, string> = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

const fetchXlsxFile = async (data: any, format: FileFormat = 'xlsx') => {
  const { Workbook } = await import('exceljs')

  const workbook = new Workbook()
  const workSheet = workbook.addWorksheet('Sheet')

  workSheet.addRows(data)

  const maxWidths: number[] = []

  data.forEach((row: any[]) => {
    row.forEach((cell, index) => {
      const cellLength = (cell) ? cell.toString().length : 0
      maxWidths[index] = Math.max(maxWidths[index] || 0, cellLength)
    })
  })

  maxWidths.forEach((width, index) => {
    workSheet.getColumn(index + 1).width = Math.max(width, 10)
  })

  const buffer = (format === 'csv')
    ? await workbook.csv.writeBuffer({ formatterOptions: { writeBOM: true } })
    : await workbook.xlsx.writeBuffer()

  const blob = new Blob([ buffer ], { type: contentTypes[format] })

  return URL.createObjectURL(blob)
}


export default fetchXlsxFile
