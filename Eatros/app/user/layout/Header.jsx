"use client"
import React, { Suspense } from 'react'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

const HeaderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [address, setAddress] = React.useState("Current Location");

  React.useEffect(() => {
    const addressQuery = searchParams.get('address');
    if (addressQuery) {
      const decoded = addressQuery.replace(/\+/g, " ");
      setAddress(decoded);
      localStorage.setItem("eatroUserAddress", decoded);
    } else {
      const saved = localStorage.getItem("eatroUserAddress");
      if (saved) {
        setAddress(saved);
      }
    }
  }, [searchParams]);
  
  return (
    <div className='w-full z-50 bg-white sticky top-0 pb-2 pt-4 px-4'>
      <div className='flex items-center justify-between'>
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-black hover:bg-gray-200 transition"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Delivery Address Pill */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-sm font-bold text-black truncate max-w-[140px] sm:max-w-[200px]">{address}</span>
          <ChevronDown size={16} className="text-black" />
        </div>

        {/* Empty space to balance the header flexbox */}
        <div className="w-10 h-10"></div>
        
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <Suspense fallback={<div className="h-16 w-full bg-white"></div>}>
      <HeaderContent />
    </Suspense>
  )
}

export default Header