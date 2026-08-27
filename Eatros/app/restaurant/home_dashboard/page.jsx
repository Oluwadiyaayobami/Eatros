"use client"
import React, { useState, useEffect } from 'react'
import AppLayout from '../layout/AppLayout'
import AcctBalance from '../layout/AcctBalance'
import Analytics from '../layout/Analytics'
import TopOrders from '../layout/TopOrders'
import Link from 'next/link'
import { Plus, Clock, Store, Layers } from 'lucide-react'
import { fetchApi } from '@/utils/api'

const page = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchApi('/auth/profile');
        setProfile(data.user);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const vendorDetails = profile?.vendorDetails || {};
  const isClosed = vendorDetails.businessStatus === "CLOSED";

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#ED4A60] rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-[#F8F9FA] min-h-screen">
        
        {/* Top Banner Image */}
        <div className="relative h-[120px] md:h-[160px] lg:h-[180px] w-full bg-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80" 
            alt="Banner" 
            className="w-full h-full object-cover object-[center_35%]"
          />
        </div>

        {/* Profile Section */}
        <div className="relative px-5 md:px-8 pt-12 md:pt-16 pb-6 bg-[#F8F9FA]">
          {/* Floating Logo */}
          <div className="absolute -top-12 md:-top-16 left-5 md:left-8 w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full border-4 border-[#F8F9FA] shadow-sm overflow-hidden bg-white z-20">
            <img 
              src={vendorDetails.coverImage || "https://img.freepik.com/premium-vector/restaurant-logo-design-template_79169-56.jpg"}
              alt="Vendor logo" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Vendor Name */}
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
              {vendorDetails.restaurantName || profile?.name || "Your Restaurant"}
            </h1>
            <Link href="#" className="bg-gray-100 text-gray-500 p-2.5 rounded-full hover:bg-gray-200 transition">
              <Store size={18} strokeWidth={2.5} />
            </Link>
          </div>
          
          {/* Status */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isClosed ? 'bg-red-500' : 'bg-green-500'}`}></span>
            <p className={`text-[12px] font-bold tracking-wide ${isClosed ? 'text-red-600' : 'text-green-600'}`}>
              {isClosed ? 'Closed Currently' : 'Open Now'}
            </p>
          </div>
        </div>

        {/* Inner Content Wrapper */}
        <div className="px-5 md:px-8">
          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 mt-2">
            <Link href="/restaurant/products/create" className="bg-white py-7 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition cursor-pointer">
              <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center">
                <Plus size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-bold text-gray-800">Add Product</span>
            </Link>
            <Link href="/restaurant/products?new_collection=true" className="bg-white py-7 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition cursor-pointer">
              <div className="w-10 h-10 bg-rose-50 text-[#ED4A60] rounded-full flex items-center justify-center">
                <Layers size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-bold text-gray-800">New Collection</span>
            </Link>
            <Link href="/restaurant/settings" className="bg-white py-7 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition cursor-pointer">
              <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-bold text-gray-800">Schedule</span>
            </Link>
          </div>

          <AcctBalance />
          <Analytics />
          <TopOrders />
        </div>
      </div>
    </AppLayout>
  )
}

export default page