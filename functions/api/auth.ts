/* global PagesFunction */

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

class JWT {
  algorithms: { ES256: { name: string; namedCurve: string; hash: { name: string } }; ES384: { name: string; namedCurve: string; hash: { name: string } }; ES512: { name: string; namedCurve: string; hash: { name: string } }; HS256: { name: string; hash: { name: string } }; HS384: { name: string; hash: { name: string } }; HS512: { name: string; hash: { name: string } } }
  constructor () {
    if (!crypto || !crypto.subtle) { throw new Error('Crypto not supported!') }
    this.algorithms = {
      ES256: { name: 'ECDSA', namedCurve: 'P-256', hash: { name: 'SHA-256' } },
      ES384: { name: 'ECDSA', namedCurve: 'P-384', hash: { name: 'SHA-384' } },
      ES512: { name: 'ECDSA', namedCurve: 'P-512', hash: { name: 'SHA-512' } },
      HS256: { name: 'HMAC', hash: { name: 'SHA-256' } },
      HS384: { name: 'HMAC', hash: { name: 'SHA-384' } },
      HS512: { name: 'HMAC', hash: { name: 'SHA-512' } }
    }
  }

  _utf8ToUint8Array (str) {
    return Base64URL.parse(btoa(unescape(encodeURIComponent(str))))
  }

  _str2ab (str) {
    const buf = new ArrayBuffer(str.length)
    const bufView = new Uint8Array(buf)
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i)
    }
    return buf
  }

  _decodePayload (raw) {
    switch (raw.length % 4) {
      case 0:
        break
      case 2:
        raw += '=='
        break
      case 3:
        raw += '='
        break
      default:
        throw new Error('Illegal base64url string!')
    }
    try {
      return JSON.parse(decodeURIComponent(escape(atob(raw))))
    } catch {
      return null
    }
  }

  async sign (payload, secret, options = { algorithm: 'HS256' }) {
    if (typeof options === 'string') { options = { algorithm: options } }
    if (payload === null || typeof payload !== 'object') { throw new Error('payload must be an object') }
    if (typeof secret !== 'string') { throw new Error('secret must be a string') }
    if (typeof options.algorithm !== 'string') { throw new Error('options.algorithm must be a string') }
    const importAlgorithm = this.algorithms[options.algorithm]
    if (!importAlgorithm) { throw new Error('algorithm not found') }
    payload.iat = Math.floor(Date.now() / 1000)
    const payloadAsJSON = JSON.stringify(payload)
    const partialToken = `${Base64URL.stringify(this._utf8ToUint8Array(JSON.stringify({ alg: options.algorithm, kid: options.keyid })))}.${Base64URL.stringify(this._utf8ToUint8Array(payloadAsJSON))}`
    let keyFormat = 'raw'
    let keyData
    if (secret.startsWith('-----BEGIN')) {
      keyFormat = 'pkcs8'
      keyData = this._str2ab(atob(secret.replace(/-----BEGIN.*?-----/g, '').replace(/-----END.*?-----/g, '').replace(/\s/g, '')))
    } else { keyData = this._utf8ToUint8Array(secret) }
    const key = await crypto.subtle.importKey(keyFormat, keyData, importAlgorithm, false, ['sign'])
    const signature = await crypto.subtle.sign(importAlgorithm, key, this._utf8ToUint8Array(partialToken))
    return `${partialToken}.${Base64URL.stringify(new Uint8Array(signature))}`
  }

  async verify (token, secret, options = { algorithm: 'HS256' }) {
    if (typeof options === 'string') { options = { algorithm: options } }
    if (typeof token !== 'string') { throw new Error('token must be a string') }
    if (typeof secret !== 'string') { throw new Error('secret must be a string') }
    if (typeof options.algorithm !== 'string') { throw new Error('options.algorithm must be a string') }
    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) { throw new Error('token must consist of 3 parts') }
    const importAlgorithm = this.algorithms[options.algorithm]
    if (!importAlgorithm) { throw new Error('algorithm not found') }
    const payload = this.decode(token)
    if (payload.nbf && payload.nbf >= Math.floor(Date.now() / 1000)) { return false }
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) { return false }
    let keyFormat = 'raw'
    let keyData
    if (secret.startsWith('-----BEGIN')) {
      keyFormat = 'pkcs8'
      keyData = this._str2ab(atob(secret.replace(/-----BEGIN.*?-----/g, '').replace(/-----END.*?-----/g, '').replace(/\s/g, '')))
    } else { keyData = this._utf8ToUint8Array(secret) }
    const key = await crypto.subtle.importKey(keyFormat, keyData, importAlgorithm, false, ['sign'])
    const res = await crypto.subtle.sign(importAlgorithm, key, this._utf8ToUint8Array(tokenParts.slice(0, 2).join('.')))
    return Base64URL.stringify(new Uint8Array(res)) === tokenParts[2]
  }

  decode (token) {
    return this._decodePayload(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
  }
}
