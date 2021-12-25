/* global PagesFunction */

export const OAUTH_AUTH_URL =
  'https://auth.gbsw.hs.kr/auth' +
  '?client_id=' + OAUTH_CLIENT_ID +
  '&redirect_uri=' + OAUTH_REDIRECT_URI +
  '&response_type=code'

export const onRequest: PagesFunction =
  () => Response.redirect(OAUTH_AUTH_URL)
