import React from 'react'

export default function Header () {
  return (
    <div>
      <h1 className="text-lg border-b-2 px-3">
        <span className="font-mono bg-gray-100 px-1 rounded-sm">~.gbsw.hs.kr</span>
        <span className="font-bold">&nbsp;서브도메인 &amp; SSL 인증서 연결</span>
      </h1>
      <p className="text-xs text-right text-gray-400">by <a className="hover:text-gray-500 hover:underline" href="https://pmh.codes">@pmh-only</a></p>
    </div>
  )
}
