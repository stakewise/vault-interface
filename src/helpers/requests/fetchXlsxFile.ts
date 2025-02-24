import methods from 'sw-methods'


type FileFormat = 'xlsx' | 'csv'

const fetchXlsxFile = async (data: any, format: FileFormat = 'xlsx') => {
  const contentType = {
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }[format]

  const response = await methods.fetch('/api/xlsx-export', {
    method: 'POST',
    headers: {
      'content-type': contentType,
    },
    body: JSON.stringify({ data, format }),
  })

  const blob = new Blob([ Buffer.from(response, 'base64') ], {
    type: contentType,
  })

  return response ? URL.createObjectURL(blob) : ''
}


export default fetchXlsxFile
