const calculateMaxWidths = (data: (string | number)[][]) => {
  const maxWidths: number[] = []

  data.forEach((row) => {
    row.forEach((cell, index) => {
      const cellLength = (cell) ? cell.toString().length : 0
      maxWidths[index] = Math.max(maxWidths[index] || 0, cellLength)
    })
  })

  return maxWidths.map((width) => ({ wch: Math.max(width, 10) }))
}


export default calculateMaxWidths
