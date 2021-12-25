import React from 'react'
import { Helmet } from 'react-helmet'

export default function Header () {
  return (
    <Helmet>
      <title>Subdomain Registrar - .gbsw.hs.kr 서브도메인 &amp; SSL 인증서 연결</title>
      <link rel="shortcut icon" href="favicon.png" type="image/png" />

      <meta property="og:title" content="Subdomain Registrar" />
      <meta property="og:site_name" content="Subdomain Registrar" />
      <meta property="og:url" content="https://dns.gbsw.hs.kr" />
      <meta property="og:description" content=".gbsw.hs.kr 서브도메인 &amp; SSL 인증서 연결" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://dns.gbsw.hs.kr/favicon.png" />
    </Helmet>
  )
}
