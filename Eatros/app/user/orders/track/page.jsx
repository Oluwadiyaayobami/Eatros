"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ShoppingBag, Mail, Phone, Check, Truck, Utensils, FileText } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const TrackMap = dynamic(() => import('./components/Map'), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center text-gray-500 font-medium text-sm">Loading Map...</div> 
});

function TrackOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  
  const [order, setOrder] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    // Attempt to get user's real physical location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);

          // Simulate a driver location roughly ~3km away (approx 0.02 degrees offset)
          setDriverLocation([lat + 0.02, lng + 0.02]);
        },
        (error) => {
          console.error("Error getting location", error);
          // Fallback to a default location (e.g., Lagos) if permission denied
          setUserLocation([6.5244, 3.3792]);
          setDriverLocation([6.5444, 3.3992]);
        }
      );
    } else {
      // Fallback if geolocation isn't supported
      setUserLocation([6.5244, 3.3792]);
      setDriverLocation([6.5444, 3.3992]);
    }
    
    // Fetch specific order details
    if (orderId) {
      const savedOrders = JSON.parse(localStorage.getItem('eatroOrders') || '[]');
      const foundOrder = savedOrders.find(o => o.id === orderId);
      if (foundOrder) setOrder(foundOrder);
    }
  }, [orderId]);

  const currentStep = order ? order.trackingStep : 2; // Default to 2 for preview if no order

  const timelineEvents = [
    {
      id: 1,
      title: "Order Placed",
      subtitle: "Awaiting restaurant approval",
      icon: <FileText size={18} className="text-white" />,
      active: currentStep >= 1,
      isFirst: true,
    },
    {
      id: 2,
      title: "Preparing Order",
      subtitle: "Restaurant approved & is preparing your food",
      icon: <Utensils size={18} className="text-white" />,
      active: currentStep >= 2,
    },
    {
      id: 3,
      title: "Out for Delivery",
      subtitle: "Rider has collected your order",
      icon: <Truck size={18} className="text-white" />,
      active: currentStep >= 3,
    },
    {
      id: 4,
      title: "Delivered",
      subtitle: "Order has reached your location",
      icon: <Check size={18} className="text-white" />,
      active: currentStep >= 4,
      isLast: true,
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col relative text-black lg:hidden pb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-12 pb-4 px-5 bg-[#FDFCF9] sticky top-0 z-40">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-800 hover:bg-gray-50 transition"
        >
          <ChevronLeft size={24} />
        </button>
        
        <h1 className="text-xl font-bold text-gray-900">Order Tracking</h1>
        
        <button className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-800 hover:bg-gray-50 transition">
          <ShoppingBag size={22} />
        </button>
      </div>

      {/* Map Section */}
      <div className="px-5 mt-2 relative z-0">
        <div className="w-full h-[350px] bg-gray-200 rounded-3xl relative overflow-hidden shadow-sm">
          <TrackMap 
            userLocation={userLocation} 
            driverLocation={driverLocation} 
            onRouteCalculated={(info) => setRouteInfo(info)} 
          />
          
          {/* Live Tracking Badge with ETA */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md z-[1000] flex items-center gap-2 border border-gray-100">
            <span className="text-[13px] font-bold text-[#00A082]">
              {routeInfo ? `ETA: ${routeInfo.duration} mins` : "Live Tracking"}
            </span>
            {routeInfo && (
              <span className="text-[12px] font-semibold text-gray-500">
                ({routeInfo.distance} km)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Driver Info Card */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-3xl p-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full overflow-hidden border border-red-50 flex items-center justify-center relative">
               <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80" alt="Driver" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 leading-tight">Lezlie Alexander</h3>
              <p className="text-[13px] text-gray-400 font-medium mt-0.5">Expert Delivery Man</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <Mail size={18} className="text-gray-700" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#FF6145] flex items-center justify-center hover:opacity-90 transition shadow-md shadow-[#FF6145]/30">
              <Phone size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Card */}
      <div className="px-5 mt-4 flex-1 flex flex-col">
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex-1">
          
          <div className="flex flex-col gap-8 relative mt-2">
            {/* The vertical dashed line */}
            <div className="absolute left-[19px] top-[30px] bottom-[30px] w-0 border-l-2 border-dashed border-gray-200 z-0"></div>
            
            {/* Active red dashed line (from step 1 to step 2) */}
            <div className="absolute left-[19px] top-[30px] h-[75px] w-0 border-l-2 border-dashed border-[#FF6145] z-0"></div>

            {timelineEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-5 relative z-10">
                {/* Icon Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  event.active ? 'bg-[#FF6145] shadow-[#FF6145]/30' : 'bg-gray-50 border border-gray-100'
                }`}>
                  {event.icon}
                </div>
                
                {/* Text */}
                <div className="flex flex-col pt-0.5">
                  <h4 className="text-[16px] font-bold text-gray-900 leading-tight">{event.title}</h4>
                  <p className="text-[13px] text-gray-400 font-medium mt-1">{event.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-5 mt-6 mb-2">
        <button className="w-full bg-[#FF6145] text-white rounded-2xl py-4 font-bold text-[17px] shadow-lg shadow-[#FF6145]/20 hover:bg-[#e8553a] active:scale-[0.98] transition-all">
          Order Collected
        </button>
      </div>
      
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
