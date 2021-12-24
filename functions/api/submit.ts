import cookie from 'cookie'
import jwt from 'jsonwebtoken'

function jwtVerify (token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
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

// eslint-disable-next-line no-undef
export const onRequest: PagesFunction = (context) => {
  const cookies = context.request.headers.get('Cookies')
  const token = cookie.parse(cookies!).token

  if (!token) {
    return sendJSON({ error: 'TOKEN_INVALID' })
  }

  const decoded = jwtVerify(token) as jwt.JwtPayload

  if (!decoded) {
    return sendJSON({ error: 'TOKEN_INVALID' })
  }

  const { id } = decoded
  return sendJSON({ id })
}
