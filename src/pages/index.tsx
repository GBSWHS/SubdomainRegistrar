import React, { FormEvent, useEffect, useRef, useState } from 'react'

import Draggable from 'react-draggable'
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

  const domainInput = useRef<HTMLSpanElement>()

  const [ip, setIp] = useState('104.26.4.215')
  const [domain, setDomain] = useState('www')

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => domainInput.current.focus(), [])

  function domainOnInput (e: FormEvent<HTMLSpanElement>) {
    const value = (e.target as HTMLSpanElement).textContent

    setDomain(value)
    updateXarrow()
  }

  function ipOnInput (e: FormEvent<HTMLSpanElement>) {
    const value = (e.target as HTMLSpanElement).textContent

    setIp(value)
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
          <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div id="user" className="hidden px-5 py-3 text-center text-gray-600 bg-white rounded shadow cursor-move sm:block">
              <p><FontAwesomeIcon size="3x" icon={faUser}/></p>
              <p className="mt-3">User</p>
            </div>
          </Draggable>
          <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div id="domain" className="px-5 py-3 text-center text-gray-600 bg-white rounded shadow cursor-move">
              <p><FontAwesomeIcon size="3x" icon={faGlobe}/></p>
              <p>Domain</p>
              <div onClick={() => domainInput.current.focus()} className="flex justify-center mt-1 bg-gray-200 border-b-2 border-white cursor-text focus-within:border-blue-400">
                <span ref={domainInput} onInput={domainOnInput} spellCheck="false" role="textbox" contentEditable className="py-1 pl-3 font-mono text-right focus:outline-none">www</span>
                <span className="py-1 pr-3 font-mono text-gray-400">.gbsw.hs.kr</span>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                .gbsw.hs.kr로 끝나는 서브도메인을 입력하세요.
              </div>
            </div>
          </Draggable>
          <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div id="cf" className="hidden px-5 py-3 text-center text-gray-600 bg-white rounded shadow cursor-move lg:block">
              <p><FontAwesomeIcon size="3x" icon={faCloudflare}/></p>
              <p>CF DNS</p>
            </div>
          </Draggable>
          <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div id="ip" className="px-5 py-3 text-center text-gray-600 bg-white rounded shadow cursor-move">
              <p><FontAwesomeIcon size="3x" icon={faServer}/></p>
              <p>Server</p>
              <div className="flex justify-center mt-1 bg-gray-200 border-b-2 border-white focus-within:border-blue-400">
                <span className="py-1 pl-3 pr-1 font-mono text-gray-400">IP:</span>
                <span onInput={ipOnInput} role="textbox" contentEditable className="py-1 pr-3 font-mono focus:outline-none cursor-text">104.26.4.215</span>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                서브도메인이 가르킬 서버의 IP를 입력하세요.
              </div>
            </div>
          </Draggable>
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
