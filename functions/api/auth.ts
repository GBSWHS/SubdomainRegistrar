/* global PagesFunction */

import { JWT } from '../utils/jwt'

function sendJSON (data: any) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url)
  const code = url.searchParams.get('code')

  if (context.request.method !== 'GET') {
    return sendJSON({
      error: 'METHOD_NOT_ALLOWED'
    })
  }

  const res = await fetch('https://auth.gbsw.hs.kr/api/ident', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: code,
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      redirect_uri: OAUTH_REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  }).then((res) => res.json()) as { success: boolean, id: string }

  if (!res.success) return Response.redirect('/')

  const jwt = new JWT()
  const token = jwt.sign({ id: res.id }, JWT_SECRET!)

  return new Response(JSON.stringify({}), {
    status: 302,
    headers: {
      'Set-Cookie': `token=${token}; path=/; max-age=${60 * 60}; secure; httponly`,
      Location: '/'
    }
  })
}
