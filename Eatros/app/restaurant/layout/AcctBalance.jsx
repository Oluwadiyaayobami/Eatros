'use client'

import React, { useState, useEffect } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import { fetchApi } from '@/utils/api'

const AcctBalance = () => {
    const [hidden, setHidden] = useState(false)
    const [balance, setBalance] = useState(0)
    const [tips, setTips] = useState(0)
    const [pending, setPending] = useState(0)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await fetchApi('/vendor/analytics');
                setBalance(data.balance || 0);
                // Mock tips/pending for now since we don't have this exact data modeled
                setTips(0);
                setPending(0); 
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnalytics();
    }, []);
  
    function formatWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    
  return (
    <div className='mb-12 px-4 relative'>
      <div className="flex items-center justify-between mb-1">
        <p className="text-gray-500 text-[12px] font-semibold tracking-wide">Eatro balance</p>
        <button onClick={() => setHidden(v=>!v)} aria-pressed={hidden} className="text-gray-600">
          {hidden ? <Eye size={18} strokeWidth={2.5} /> : <EyeClosed size={18} strokeWidth={2.5} />}
        </button>
      </div>
      <p className="text-[34px] font-bold mt-0.5 text-black tracking-tight">{hidden ? '•••••••' : `${formatWithCommas(Number(balance))}`}</p>
      
      {/* Tips and payout */}
      <div className="mt-6 grid grid-cols-2 gap-2 text-[12px] font-medium items-start text-gray-500">
        <div className="pr-1">
          <p>Tips + subscriptions</p>
          <p className="mt-1 font-semibold text-gray-800">{hidden ? '••••' : `₦${formatWithCommas(tips)}`} this week</p>
        </div>
        <div className="pl-1">
          <p>Pending payout</p>
          <p className="mt-1 font-semibold text-gray-800">{hidden ? '••••' : `₦${formatWithCommas(pending)}`} • in 3 days</p>
        </div>
      </div>
    </div>
  )
}

export default AcctBalance