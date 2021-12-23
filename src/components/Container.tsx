import React from 'react'

export default function Container ({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex justify-center" style={{ backgroundColor: '#fafafa' }}>
      <div className="container">
        {children}
      </div>
    </div>
  )
}
