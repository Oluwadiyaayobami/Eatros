'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeClosed } from 'lucide-react'
import GlassBG from './GlassBG'

const AcctBalance = () => {

    const [hidden, setHidden] = useState(false)

    const balance = 100000
  
    const router = useRouter()
  
    function formatWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    
  return (
    <div className='m-5'>
        <GlassBG className='rounded-md'>
        <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-gray-700/80 text-xs font-outfit">Eatro balance</p>
          <button onClick={() => setHidden(v=>!v)} aria-pressed={hidden} className="text-[#A31621]">
            {hidden ? <Eye size={18} /> : <EyeClosed size={18} />}
          </button>
        </div>
        <p className="text-3xl font-semibold font-outfit mt-1 text-[#A31621]">{hidden ? '•••••••' : `${formatWithCommas(Number(balance))}`}</p>
        <div className="my-3 h-px bg-white/10" />
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-white/70 font-outfit items-start">
          <div className="pr-2 border-r border-white/10">
            <p>Tips + subscriptions</p>
            <p className="text-white mt-1">{hidden ? '••••' : '₦45,200'} this week</p>
          </div>
          <div className="pl-2">
            <p>Pending payout</p>
            <p className="text-white mt-1">{hidden ? '••••' : '₦215,000'} • in 3 days</p>
          </div>
        </div>
    
      </div>
        </GlassBG>
    </div>
  )
}

export default AcctBalance