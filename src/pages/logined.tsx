import React from 'react'

import Header from '../components/Header'
import Container from '../components/Container'

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function LoginedPage () {
  return <>
    <Header />
    <Container>
      <FontAwesomeIcon size="8x" color="#aaa" icon={faCheckCircle}/>
      <h1 className="text-xl font-bold">로그인 완료</h1>
      <p>이 탭을 닫고, 이전 탭으로 돌아가십시오.</p>
    </Container>
  </>
}
