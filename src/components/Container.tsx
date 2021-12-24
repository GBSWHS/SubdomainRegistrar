import React from 'react'

export default function Container ({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex justify-center min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <div className="container flex flex-col items-center justify-center gap-5">
        {children}
      </div>
    </div>
  )
}
