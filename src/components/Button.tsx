import clsx from 'clsx'
import React from 'react'

interface Props {
  children: React.ReactNode
  onClick: () => void
}

export default function Button ({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-3 pt-2 pb-1',
        'shadow hover:shadow-lg',
        'border-b-4 border-orange-400  hover:border-orange-500',
        'transition-all bg-orange-400 text-white')}>
      {children}
    </button>
  )
}
