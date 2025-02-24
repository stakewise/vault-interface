import { utils, write } from 'xlsx'
import { NextResponse } from 'next/server'

import calculateMaxWidths from './calculateMaxWidths'


export async function POST(request: Request) {
  try {
    const { data, format } = await request.json()
    const contentType = request.headers.get('content-type') || 'application/json'

    const workbook = utils.book_new()
    const workSheet = utils.aoa_to_sheet(data)
    workSheet['!cols'] = calculateMaxWidths(data)
    utils.book_append_sheet(workbook, workSheet)

    const result = write(workbook, { type: 'base64', bookType: format })

    return NextResponse.json(result, { status: 200, headers: { 'content-type': contentType } })
  }
  catch (error: any) {
    const errorMessage = error?.message || error || 'Error'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
