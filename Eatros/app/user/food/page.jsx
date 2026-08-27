"use client";

import React, { useState, useEffect } from 'react'
import AppLayout from '../layout/AppLayout'
import Categories from '../layout/Categories'
import FilterChips from '../layout/FilterChips'
import PromoBanner from '../layout/PromoBanner'
import RestaurantCard from '../layout/RestaurantCard'
import { Search, ChevronLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const page = () => {
  const [address, setAddress] = useState("Current Location");

  useEffect(() => {
    const saved = localStorage.getItem("eatroUserAddress");
    if (saved) setAddress(saved);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <AppLayout>
        {/* Title & Back Button */}
        <div className="px-4 pt-2 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/user/home_dashboard" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition shrink-0">
              <ChevronLeft size={24} className="text-black" />
            </Link>
            <h1 className="text-[34px] font-extrabold text-black tracking-tight">Food</h1>
          </div>
          
          {/* Location Display */}
          <Link href="/auth/map">
            <div className="flex flex-col items-end cursor-pointer group active:scale-95 transition-transform">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-gray-500 transition">Delivering to</span>
              <div className="flex items-center gap-1 text-green-700 font-semibold group-hover:text-green-800 transition">
                <span className="text-sm max-w-[120px] truncate">{address}</span>
                <ChevronDown size={14} strokeWidth={2.5} />
              </div>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search in Food" 
              className="w-full bg-[#f2f2f2] rounded-full py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-gray-300 text-black font-semibold placeholder-gray-500 transition"
            />
          </div>
        </div>

        {/* Categories */}
        <Categories />

        {/* Filters */}
        <FilterChips />

        {/* Promo Banner */}
        <PromoBanner />

        {/* Restaurants List */}
        <RestaurantCard />
        
      </AppLayout>
    </div>
  )
}

export default page