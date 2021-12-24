import React from 'react'

export default function Title () {
  return (
    <div className="max-w-md">
      <h1 className="px-3 text-lg border-b-2">
        <span className="px-1 font-mono bg-gray-100 rounded-sm">~.gbsw.hs.kr</span>
        <span className="font-bold">&nbsp;서브도메인 &amp; SSL 인증서 연결</span>
      </h1>
      <p className="text-xs text-right text-gray-400">
        by&nbsp;
        <a
          className="hover:text-gray-500 hover:underline"
          href="https://pmh.codes">@pmh-only</a>
      </p>
    </div>
  )
}
