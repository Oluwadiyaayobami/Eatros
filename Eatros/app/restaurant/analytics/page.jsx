"use client"

import React, { useState, useEffect } from 'react'
import AppLayout from '../layout/AppLayout'
import { DollarSign, Share2, ThumbsUp, Star, Menu, Loader2 } from 'lucide-react'
import { fetchApi } from '@/utils/api'

// Removed mock data for charts
const barData = [];
const waveData = [];

const AnalyticsPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchApi('/vendor/analytics');
        setStats(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);
  return (
    <AppLayout>
      <div className="bg-[#EAEDF2] min-h-screen px-4 md:px-8 py-6 pb-20 font-sans">
        
        {/* Page Header matching the image's top bar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[20px] font-medium text-gray-700">Dashboard User</h1>
          <button className="text-gray-500 hover:text-gray-700">
            <Menu size={24} strokeWidth={2} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-[#ED4A60]" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Earnings (Dark Blue) */}
            <div className="bg-[#1C3A5A] text-white p-5 rounded-[4px] shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex justify-between items-start">
                <span className="text-[13px] font-light text-gray-200">Total Balance</span>
                <div className="bg-white rounded-full p-1 text-[#1C3A5A]">
                  <DollarSign size={12} strokeWidth={4} />
                </div>
              </div>
              <h3 className="text-[34px] font-light tracking-wide">₦ {stats.balance.toLocaleString()}</h3>
            </div>

            {/* Orders */}
            <div className="bg-white text-gray-800 p-5 rounded-[4px] shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex justify-between items-start">
                <span className="text-[13px] font-medium text-gray-500">Total Orders</span>
                <Share2 size={16} strokeWidth={2.5} className="text-[#FF9800]" />
              </div>
              <h3 className="text-[34px] font-light text-gray-700 tracking-wide">{stats.totalOrders}</h3>
            </div>

            {/* Completed */}
            <div className="bg-white text-gray-800 p-5 rounded-[4px] shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex justify-between items-start">
                <span className="text-[13px] font-medium text-gray-500">Completed</span>
                <ThumbsUp size={16} strokeWidth={2.5} className="text-[#FF9800]" />
              </div>
              <h3 className="text-[34px] font-light text-gray-700 tracking-wide">{stats.completedOrders}</h3>
            </div>

            {/* Cancelled */}
            <div className="bg-white text-gray-800 p-5 rounded-[4px] shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex justify-between items-start">
                <span className="text-[13px] font-medium text-gray-500">Cancelled</span>
                <Star size={16} className="text-[#FF9800] fill-[#FF9800]" />
              </div>
              <h3 className="text-[34px] font-light text-gray-700 tracking-wide">{stats.cancelledOrders}</h3>
            </div>
          </div>
        )}

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          
          {/* Main Bar Chart */}
          <div className="lg:col-span-3 bg-white rounded-[4px] shadow-sm p-6 pr-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium text-[13px]">Revenue vs Orders (Historical Data Unavailable)</span>
            </div>
            <div className="relative h-[200px] w-full flex items-center justify-center">
              <p className="text-gray-400 font-medium">No historical data to display</p>
            </div>
          </div>

          {/* Ring Chart */}
          <div className="bg-white rounded-[4px] shadow-sm py-8 px-6 flex flex-col items-center">
            {/* SVG Ring Chart */}
            <div className="relative w-28 h-28 mb-8">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="18" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#1C3A5A" 
                  strokeWidth="18" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="138.16" 
                />
              </svg>
              {/* Overlapping yellow */}
              <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#FF9800" 
                  strokeWidth="18" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="190" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-[18px]">
                <span className="text-xl font-light text-gray-800">0%</span>
              </div>
            </div>
            
            <div className="w-full space-y-4 px-2 mb-8">
              {['Delivery Success', 'Positive Reviews', 'On-Time Prep', 'Returning Cust.'].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-2 text-center">
                  <span className="text-[11px] text-gray-400 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <button className="bg-[#FF9800] text-white px-6 py-1.5 rounded-full text-[11px] font-semibold shadow-md w-full max-w-[120px] active:scale-95 transition-transform">
              Check Now
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Wave Chart */}
          <div className="lg:col-span-3 bg-white rounded-[4px] shadow-sm p-6 flex flex-col relative overflow-hidden min-h-[220px]">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 z-10 relative">
              <span className="text-gray-500 font-medium text-[13px]">Customer Growth (Historical Data Unavailable)</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 font-medium">No historical data to display</p>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="bg-white rounded-[4px] shadow-sm p-6 flex flex-col justify-center min-h-[220px]">
            <div className="grid grid-cols-7 gap-y-5 gap-x-1 text-center">
              {['S','M','T','W','T','F','S'].map((day, i) => (
                <div key={i} className="text-[10px] font-bold text-gray-400">{day}</div>
              ))}
              
              {/* Dummy Calendar Days */}
              {Array.from({length: 31}).map((_, i) => {
                let classes = "text-[10px] font-medium text-gray-500";
                let wrapperClasses = "flex justify-center items-center h-5";
                
                // Active states matching the image
                if (i === 8) { // M (9th)
                   return (
                     <div key={i} className={wrapperClasses}>
                       <div className="w-5 h-5 bg-[#1C3A5A] text-white flex items-center justify-center rounded-[2px] text-[10px] font-bold">
                         {i+1}
                       </div>
                     </div>
                   )
                }
                if (i === 16 || i === 17) { // 17, 18 (merged style)
                   return (
                     <div key={i} className={wrapperClasses}>
                       <div className="w-full h-5 bg-[#1C3A5A] text-white flex items-center justify-center text-[10px] font-bold">
                         {i+1}
                       </div>
                     </div>
                   )
                }
                if (i === 23) { // 24th (Yellow box)
                   return (
                     <div key={i} className={wrapperClasses}>
                       <div className="w-5 h-5 bg-[#FF9800] text-white flex items-center justify-center rounded-[2px] text-[10px] shadow-md font-bold">
                         {i+1}
                       </div>
                     </div>
                   )
                }

                return (
                  <div key={i} className={wrapperClasses}>
                    <span className={classes}>{i+1}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  )
}

export default AnalyticsPage
