import { NextRequest, NextResponse } from 'next/server'


type Cookies = Array<{
  name: string
  value: string
  maxAge?: number
}>

// ATTN https://github.com/vercel/next.js/issues/49442#issuecomment-2041387328
const setCookieBatch = (request: NextRequest, cookies: Cookies = []) => {
  const options: Parameters<typeof response.cookies.set>[2] = {}

  cookies.forEach(({ name, value }) => {
    request.cookies.set({ name, value })
  })

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const isDev = request.url.startsWith('http://local')
  const isFrame = request.headers.get('Sec-Fetch-Dest') === 'iframe'

  if (isFrame) {
    options.sameSite = 'none'
    options.secure = true
  }

  if (isDev) {
    options.secure = false
  }

  cookies.forEach(({ name, value, maxAge }) => {
    response.cookies.set(name, value, {
      ...options,
      maxAge,
    })
  })

  return response
}


export default setCookieBatch
