import { faCloudflare } from '@fortawesome/free-brands-svg-icons'
import { faGlobe, faServer, faUser, faTimes, faFileContract, faSignature } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { navigate } from 'gatsby'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { Helmet } from 'react-helmet'
import toast, { Toaster } from 'react-hot-toast'
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows'
import Container from '../components/Container'
import Header from '../components/Header'

export default function IndexPage () {
  const updateXarrow = useXarrow()

  const domainInput = useRef<HTMLSpanElement>()

  const [ip, setIp] = useState('104.26.4.215')
  const [domain, setDomain] = useState('www')
  const [isLoading, setIsLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    domainInput.current.focus()
  }, [])

  async function onSubmit () {
    setIsLoading(true)

    if (domain.length > 7) {
      toast.error('서브도메인 이름이 너무 깁니다. (최대 7자)')
      setIsLoading(false)
      return
    }

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, ip })
    }).then((res) => res.json())

    if (res.error === 'TOKEN_INVALID') {
      toast.error('서명 실패: 서명 토큰이 올바르지 않습니다.')
      toast.loading('로그인 화면으로 이동합니다')
      await navigate('/api/login')
      return
    }

    if (res.error === 'ALREADY_TAKEN') {
      toast.error('서명 실패: 서명이 중복되었습니다. (이미 사용중인 서브도메인입니다.)')
      setIsLoading(false)
      return
    }

    if (res.error === 'MAX_SIGN_REACHED') {
      toast.error('서명 실패: 최대 서명 가능 수 (일반적으로 5번)를 초과하였습니다.')
      toast('서명 가능 수를 늘리려면 관리자에게 문의하세요.')
      setIsLoading(false)
      return
    }

    toast.success('서명 완료!')
    toast.loading('해당 웹사이트로 이동합니다')

    navigate(`https://${domain}`)
  }

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

  return (
    <Container>
      <Helmet>
        <title>Subdomain Registrar - .gbsw.hs.kr 서브도메인 &amp; SSL 인증서 연결</title>
      </Helmet>

      <Toaster />
      <div className="min-h-screen flex justify-center items-center flex-col gap-10">
        <Header />

        <div className="flex flex-wrap justify-center items-center gap-16">
          <Xwrapper>
            <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
              <div id="user" className="hidden sm:block bg-white rounded shadow px-5 py-3 cursor-move text-center text-gray-600">
                <p><FontAwesomeIcon size="3x" icon={faUser}/></p>
                <p className="mt-3">User</p>
              </div>
            </Draggable>
            <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
              <div id="domain" className="bg-white rounded shadow px-5 py-3 cursor-move text-center text-gray-600">
                <p><FontAwesomeIcon size="3x" icon={faGlobe}/></p>
                <p>Domain</p>
                <div onClick={() => domainInput.current.focus()} className="flex mt-1 cursor-text bg-gray-200 border-white border-b-2 justify-center focus-within:border-blue-400">
                  <span ref={domainInput} onInput={domainOnInput} spellCheck="false" role="textbox" contentEditable className="focus:outline-none pl-3 py-1 font-mono text-right">www</span>
                  <span className="font-mono pr-3 py-1 text-gray-400">.gbsw.hs.kr</span>
                </div>
                <div className="text-xs mt-3 text-gray-400">
                  .gbsw.hs.kr로 끝나는 서브도메인을 입력하세요.
                </div>
              </div>
            </Draggable>
            <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
              <div id="cf" className="hidden lg:block bg-white rounded shadow px-5 py-3 cursor-move text-center text-gray-600">
                <p><FontAwesomeIcon size="3x" icon={faCloudflare}/></p>
                <p>CF DNS</p>
              </div>
            </Draggable>
            <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
              <div id="ip" className="bg-white rounded shadow px-5 py-3 cursor-move text-center text-gray-600">
                <p><FontAwesomeIcon size="3x" icon={faServer}/></p>
                <p>Server</p>
                <div className="flex mt-1 bg-gray-200 border-white border-b-2 focus-within:border-blue-400 justify-center">
                  <span className="font-mono pl-3 pr-1 py-1 text-gray-400">IP:</span>
                  <span onInput={ipOnInput} role="textbox" contentEditable className="focus:outline-none pr-3 py-1 font-mono cursor-text">104.26.4.215</span>
                </div>
                <div className="text-xs mt-3 text-gray-400">
                  서브도메인이 가르킬 서버의 IP를 입력하세요.
                </div>
              </div>
            </Draggable>
          </Xwrapper>
        </div>
        <button onClick={() => setModalOpen(true)} className="px-3 pt-2 pb-1 bg-orange-400 text-white shadow border-b-4 border-orange-400 hover:shadow-lg hover:border-orange-500 transition-all">연결하기!</button>
      </div>

      <div className="hidden sm:block"><Xarrow start="user" end="domain" color="gray" headSize={5} /></div>
      <div className="hidden lg:block"><Xarrow start="domain" end="cf" color="gray" headSize={5} /></div>
      <div className="hidden lg:block"><Xarrow start="cf" end="ip" color="gray" headSize={5} /></div>
      <div className="block  lg:hidden"><Xarrow start="domain" end="ip" color="gray" headSize={5} /></div>

      <div className={`${modalOpen ? 'z-10 bg-black' : '-z-50 bg-transparent'} flex flex-col items-center justify-center bg-opacity-40 duration-500 transition-colors absolute top-0 left-0 w-screen h-screen`}>
        <div className="bg-white  px-4 py-3 h-auto shadow border-2 flex flex-col gap-3 select-none max-w-sm border-orange-400">
          <div className="flex justify-between">
            <h2 className="text-lg border-b-2 pr-10"><FontAwesomeIcon icon={faFileContract}/> Subdomain Registration</h2>
            {!isLoading && <div onClick={() => setModalOpen(false)} className="cursor-pointer"><FontAwesomeIcon icon={faTimes}/></div>}
          </div>
          <div className="text-xs">
            <p>본인은 경북소프트웨어고 프로젝트 활동의 일환으로</p>
            <p>학교 도메인 <span className="bg-gray-200 rounded font-mono px-3 py-1">{domain}.gbsw.hs.kr</span>을 IP, <span className="bg-gray-200 rounded font-mono px-3 py-1">{ip}</span>로 연결하고자 합니다.</p>
            <br />
            <p>본인은 연결된 서브도메인이 다음중 하나 이상 해당될 경우 <b>예고없이 삭제될 수 있음을 숙지</b>하였습니다.</p>
            <ul className="list-disc list-inside">
              <li>서브도메인이 학교 목적과 맞지 않은 용도(불건전, 정치적 등)로 사용될 경우.</li>
              <li>불특정 다수에게 수치심을 느낄 수 있는(비속어, 은어 등) 서브도메인명인 경우.</li>
              <li>서브도메인에 연결된 서버가 장시간(최대 2주) 셧다운 상태인 경우.</li>
              <li>서브도메인에 연결된 서버에서 제공하는 컨텐츠가 학교 명예에 부정적인 영향을 줄 수 있는 경우.</li>
              <li>기존 서브도메인과 유사하여 피싱 사이트로서의 가능성이 높다고 판단될 경우.</li>
            </ul>
            <hr className="my-3" />
            <p>* 일반적으로 1인당 최대 5개의 서브도메인 연결을 신청할 수 있으며 추가 연결이 필요한 경우 관리자에게 연락하여 더 신청할 수 있다.</p>
          </div>
          <div className="flex justify-end">
            {isLoading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"/>}
            {!isLoading &&
              <button onClick={onSubmit} className="px-3 py-2 bg-orange-400 inline-block text-white hover:bg-orange-500 shadow hover:shadow-lg transition-all">
                <FontAwesomeIcon icon={faSignature}/> 서명
              </button>}
          </div>
        </div>
      </div>
    </Container>
  )
}
