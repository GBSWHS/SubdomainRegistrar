/* global PagesFunction */

import { JWT } from '../utils/jwt'

async function jwtVerify (token: string) {
  const jwt = new JWT()

  try {
    await jwt.verify(token, JWT_SECRET!)
    return jwt.decode(token)
  } catch (_) {
    return null
  }
}

function sendJSON (data: any) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const onRequest: PagesFunction = async (context) => {
  if (context.request.method !== 'POST') {
    return sendJSON({
      error: 'METHOD_NOT_ALLOWED'
    })
  }

  const cookies = context.request.headers.get('Cookies')
  const token = cookies ? cookies.split('; ').find(c => c.startsWith('token=')) : null

  if (!token) {
    return sendJSON({ error: 'TOKEN_INVALID' })
  }

  const decoded = await jwtVerify(token)

  if (!decoded) {
    return sendJSON({ error: 'TOKEN_INVALID' })
  }

  const { id } = decoded
  return sendJSON({ id })
}
