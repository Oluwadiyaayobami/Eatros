"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchApi } from '@/utils/api'

const defaultData = [
  { day: 'Mon', sales: 0 },
  { day: 'Tue', sales: 0 },
  { day: 'Wed', sales: 0 },
  { day: 'Thu', sales: 0 },
  { day: 'Fri', sales: 0 },
  { day: 'Sat', sales: 0 },
  { day: 'Sun', sales: 0 },
];

const Analytics = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [chartData, setChartData] = useState(defaultData);
  const maxSales = Math.max(...chartData.map(d => d.sales), 1); // Avoid div by 0

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetchApi('/vendor/analytics');
        setTotalSales(res.totalSales || 0);
        if (res.weeklySales) {
          setChartData(res.weeklySales);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="mb-10 px-1">
      <h2 className="text-[22px] font-bold text-black mb-5 px-3 tracking-tight">Analytics</h2>
      
      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-500 text-xs font-semibold mb-1">Total Sales</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ₦{totalSales.toLocaleString('en-NG')}
            </h3>
          </div>
          <select className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg py-2 px-3 outline-none cursor-pointer">
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
          </select>
        </div>

        {/* Line Chart */}
        <div className="relative w-full h-[140px] mt-2 px-1">
          <svg className="w-full h-[110px] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="line-gradient-sm" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ED4A60" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ED4A60" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon 
              points={`0,100 ${chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((d.sales / maxSales) * 90)}`).join(' ')} 100,100`}
              fill="url(#line-gradient-sm)"
            />
            <polyline 
              points={chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((d.sales / maxSales) * 90)}`).join(' ')}
              fill="none" 
              stroke="#ED4A60" 
              strokeWidth="2.5" 
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          
          {/* Hover Targets & Tooltips */}
          <div className="absolute top-0 left-1 right-1 h-[110px]">
            {chartData.map((item, index) => {
              const x = (index / (chartData.length - 1)) * 100;
              const y = 100 - ((item.sales / maxSales) * 90);
              return (
                <div key={index} className="absolute h-full w-[14%] -ml-[7%] group cursor-pointer z-10" style={{ left: `${x}%` }}>
                  {/* Interactive Dot */}
                  <div 
                    className="absolute w-3 h-3 bg-white border-2 border-[#ED4A60] rounded-full z-10 transition-transform duration-200 group-hover:scale-[1.3]"
                    style={{ 
                      top: `${y}%`,
                      left: '50%',
                      transform: 'translate(-50%, -50%)' 
                    }}
                  ></div>
                  
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bg-gray-900 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap transition-opacity duration-200 pointer-events-none z-20 shadow-lg"
                       style={{ 
                         top: `calc(${y}% - 32px)`,
                         left: '50%',
                         transform: 'translateX(-50%)'
                       }}
                  >
                    ₦{item.sales.toLocaleString('en-NG')}
                  </div>
                </div>
              )
            })}
          </div>

          {/* X Axis Labels */}
          <div className="relative w-full h-5 mt-3">
            {chartData.map((item, index) => {
              const x = (index / (chartData.length - 1)) * 100;
              return (
                <span key={index} className="absolute text-[10px] font-bold text-gray-400 transform -translate-x-1/2" style={{ left: `${x}%` }}>
                  {item.day}
                </span>
              )
            })}
          </div>
        </div>

        {/* View More Link */}
        <div className="flex justify-center mt-6">
          <Link href="/restaurant/analytics" className="text-center text-black text-[13px] font-bold underline cursor-pointer hover:text-gray-700 transition">
            View More Analytics
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Analytics
