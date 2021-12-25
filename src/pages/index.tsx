import React, { FormEvent, useEffect, useRef, useState } from 'react'

import toast, { Toaster } from 'react-hot-toast'
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudflare } from '@fortawesome/free-brands-svg-icons'
import { faGlobe, faServer, faUser } from '@fortawesome/free-solid-svg-icons'

import Title from '../components/Title'
import Header from '../components/Header'
import Button from '../components/Button'
import SignModal from '../components/SignModal'
import Container from '../components/Container'

import { VAILD_DOMAIN, VAILD_IPV4 } from '../utils/regex'

export default function IndexPage () {
  const updateXarrow = useXarrow()

  const domainInput = useRef<any>()

  const [ip, setIp] = useState('')
  const [domain, setDomain] = useState('')

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => domainInput.current.focus(), [])

  function domainOnInput (e: FormEvent<HTMLInputElement>) {
    setDomain((e.target as any).value)
    updateXarrow()
  }

  function ipOnInput (e: FormEvent<HTMLInputElement>) {
    setIp((e.target as any).value)
    updateXarrow()
  }

  function onConnect () {
    if (!VAILD_DOMAIN.test(`${domain}.gbsw.hs.kr`)) {
      toast.error('올바른 도메인이 아닙니다.')
      return
    }

    if (!VAILD_IPV4.test(ip)) {
      toast.error('올바른 IP 주소가 아닙니다.')
      return
    }

    setModalOpen(true)
  }

  return <>
    <Header />
    <Toaster />
    <Container>
      <Title />
      <div className="flex flex-wrap items-center justify-center gap-16">
        <Xwrapper>
          <div id="user" className="hidden px-5 py-3 text-center text-gray-600 bg-white rounded shadow sm:block">
            <p><FontAwesomeIcon size="3x" icon={faUser}/></p>
            <p className="mt-3">User</p>
          </div>
          <div id="domain" className="px-5 py-3 text-center text-gray-600 bg-white rounded shadow">
            <p><FontAwesomeIcon size="3x" icon={faGlobe}/></p>
            <p>Domain</p>
            <div onClick={() => domainInput.current.focus()} className="flex justify-center mt-1 bg-gray-200 border-b-2 border-white cursor-text focus-within:border-blue-400">
              <input ref={domainInput} onInput={domainOnInput} spellCheck="false" className="w-1/5 py-1 pl-3 font-mono text-right bg-transparent focus:outline-none" placeholder="www" />
              <span className="py-1 pr-3 font-mono text-gray-400">.gbsw.hs.kr</span>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              .gbsw.hs.kr로 끝나는 서브도메인을 입력하세요.
            </div>
          </div>
          <div id="cf" className="hidden px-5 py-3 text-center text-gray-600 bg-white rounded shadow lg:block">
            <p><FontAwesomeIcon size="3x" icon={faCloudflare}/></p>
            <p>CF DNS</p>
          </div>
          <div id="ip" className="px-5 py-3 text-center text-gray-600 bg-white rounded shadow">
            <p><FontAwesomeIcon size="3x" icon={faServer}/></p>
            <p>Server</p>
            <div className="flex justify-center mt-1 bg-gray-200 border-b-2 border-white focus-within:border-blue-400">
              <span className="py-1 pl-3 pr-1 font-mono text-gray-400">IP:</span>
              <input onInput={ipOnInput} className="py-1 pr-3 font-mono bg-transparent focus:outline-none cursor-text" placeholder="104.26.4.215"/>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              서브도메인이 가르킬 서버의 IP를 입력하세요.
            </div>
          </div>
        </Xwrapper>
      </div>
      <Button onClick={onConnect}>연결하기!</Button>

      {/* Connect Arrows */}
      <div className="hidden sm:block"><Xarrow start="user" end="domain" color="gray" headSize={5} /></div>
      <div className="hidden lg:block"><Xarrow start="domain" end="cf" color="gray" headSize={5} /></div>
      <div className="hidden lg:block"><Xarrow start="cf" end="ip" color="gray" headSize={5} /></div>
      <div className="block lg:hidden"><Xarrow start="domain" end="ip" color="gray" headSize={5} /></div>

      {/* Registration Modal */}
      <SignModal
        open={modalOpen}
        didClose={() => setModalOpen(false)}
        domain={domain} ip={ip}/>

    </Container></>
}
