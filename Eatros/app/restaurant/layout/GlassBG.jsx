import React from 'react'

const GlassBG = ({children, className = ""}) => {
  return (
    <div className={`backdrop-blur-xl bg-white/10 border border-white/10 ${className} `}>
        {children}
    </div>
  )
}

export default GlassBG