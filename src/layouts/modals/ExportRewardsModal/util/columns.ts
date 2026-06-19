type ExportColumn = {
  key: ColumnKey
  boostOnly?: boolean
}


export type ColumnKey = 'stake' | 'boost' | 'total' | 'totalFiat' | 'date'

export const exportColumns: ExportColumn[] = [
  { key: 'stake', boostOnly: true },
  { key: 'boost', boostOnly: true },
  { key: 'total' },
  { key: 'totalFiat' },
  { key: 'date' },
]
