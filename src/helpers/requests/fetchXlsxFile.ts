type FileFormat = 'xlsx' | 'csv'

const fetchXlsxFile = async (data: any, format: FileFormat = 'xlsx') => {
  const contentType = {
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }[format]

  const { utils, write } = await import('xlsx')

  const workbook = utils.book_new()
  const workSheet = utils.aoa_to_sheet(data)

  const maxWidths: number[] = []

  data.forEach((row: any) => {
    row.forEach((cell: any, index: number) => {
      const cellLength = (cell) ? cell.toString().length : 0
      maxWidths[index] = Math.max(maxWidths[index] || 0, cellLength)
    })
  })

  workSheet['!cols'] = maxWidths.map((width) => ({ wch: Math.max(width, 10) }))

  utils.book_append_sheet(workbook, workSheet)

  const result = write(workbook, { type: 'base64', bookType: format })

  const blob = new Blob([ Buffer.from(result, 'base64') ], {
    type: contentType,
  })

  return result ? URL.createObjectURL(blob) : ''
}


export default fetchXlsxFile
