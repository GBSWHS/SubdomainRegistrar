import { navigate } from 'gatsby'
import React, { useState } from 'react'

import toast from 'react-hot-toast'

import {
  faTimes,
  faSignature,
  faFileContract
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from './Button'
import Modal from './Modal'

interface Props {
  ip: string
  open: boolean
  domain: string
  didClose: () => void
}

export default function SignModal ({ open, didClose, domain, ip }: Props) {
  const [isLoading, setIsLoading] = useState(false)

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

    navigate(`https://${domain}.gbsw.hs.kr`)
  }

  return (
    <Modal open={open}>
      <div className="flex justify-between">
        <h2 className="pr-10 text-lg border-b-2"><FontAwesomeIcon icon={faFileContract}/> Subdomain Registration</h2>
        {!isLoading && <div onClick={didClose} className="cursor-pointer"><FontAwesomeIcon icon={faTimes}/></div>}
      </div>
      <div className="text-xs">
        <p>본인은 경북소프트웨어고 프로젝트 활동의 일환으로</p>
        <p>
          학교 도메인 <span className="px-3 py-1 font-mono bg-gray-200 rounded">{domain}.gbsw.hs.kr</span>을
          IP, <span className="px-3 py-1 font-mono bg-gray-200 rounded">{ip}</span>로 연결하고자 합니다.
        </p>
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
        {isLoading && <div className="w-6 h-6 border-b-2 border-orange-500 rounded-full animate-spin"/>}
        {!isLoading &&
          <Button onClick={onSubmit}>
            <FontAwesomeIcon icon={faSignature}/> 서명
          </Button>}
      </div>
    </Modal>
  )
}
