"use client"
import React from 'react'
import { ChevronLeft, Search, Heart, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Hero = ({ bgImage }) => {
  const router = useRouter();

  return (
    <div className="relative w-full h-[220px] bg-gray-200">
      {/* Background image */}
      <img
        src={bgImage}
        alt="Restaurant background"
        className="w-full h-full object-cover"
      />

      {/* Floating Action Buttons */}
      <div className='absolute top-4 left-4 right-4 flex justify-between items-center z-10'>
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-black hover:bg-gray-100 transition"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right Buttons */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-black hover:bg-gray-100 transition">
            <Search size={20} />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-black hover:bg-gray-100 transition">
            <Heart size={20} />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-black hover:bg-gray-100 transition">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero