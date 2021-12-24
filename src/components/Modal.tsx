import clsx from 'clsx'
import React from 'react'

interface Props {
  open: boolean
  children: React.ReactNode
}

export default function Modal ({ open, children }: Props) {
  return (
    <div className={clsx(
      open ? 'z-10 bg-black bg-opacity-40' : '-z-50 bg-transparent',
      'duration-500 transition-colors',
      'flex flex-col items-center justify-center',
      'absolute top-0 left-0 w-screen h-screen')}>

      <div className={clsx(
        'flex flex-col h-auto max-w-sm gap-3 px-4 py-3',
        'bg-white border-2 border-orange-400 shadow select-none')}>

        {children}

      </div>
    </div>
  )
}
