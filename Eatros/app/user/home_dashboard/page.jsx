"use client"
import React, { Suspense, useRef } from 'react';
import { Home, ChevronDown } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '../layout/BottomNav';
import { motion } from 'framer-motion';
import { fetchApi } from '@/utils/api';
import toast from 'react-hot-toast';

const DashboardContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addressQuery = searchParams.get("address");
  
  const [address, setAddress] = React.useState("Current Location");

  React.useEffect(() => {
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

    const checkRole = async () => {
      try {
        const data = await fetchApi('/auth/profile');
        if (data && data.user) {
          if (data.user.role === 'agent') {
            toast.error("Agents cannot access the user dashboard");
            router.push('/agent/orders');
          } else if (data.user.role === 'vendor') {
            toast.error("Vendors cannot access the user dashboard");
            router.push('/vendor/dashboard');
          }
        }
      } catch (err) {
        // If they are not logged in or token is invalid, maybe ignore or redirect to login.
        // Assuming they shouldn't be on dashboard without auth anyway.
      }
    };
    checkRole();
  }, [addressQuery, router]);

  const containerRef = useRef(null);

  const categories = [
    { id: 'food', name: 'Food', emoji: '🍔', link: '/user/food' },
    { id: 'groceries', name: 'Groceries', emoji: '🛒', link: '#' },
    { id: 'shops', name: 'Shops', emoji: '🛍️', link: '#' },
    { id: 'pharmacy', name: 'Pharmacy & Beauty', emoji: '💊', link: '#' },
    { id: 'package', name: 'Package Delivery', emoji: '📦', link: '#' },
  ];

  const CategoryBubble = ({ cat }) => (
    <motion.div
      drag
      dragConstraints={containerRef}
      whileDrag={{ scale: 1.15, zIndex: 50, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      dragElastic={0.2}
      onTap={(event, info) => {
        // This ensures the link only fires on a clean tap, not after dragging
        router.push(cat.link);
      }}
      className="flex flex-col items-center gap-3 group cursor-grab active:cursor-grabbing touch-none z-10"
    >
      <div className="bg-white rounded-full flex items-center justify-center shadow-xl shadow-orange-500/10 border-[6px] border-[#FFD175]/60 group-hover:border-white transition-colors duration-300 w-24 h-24">
        <span className="text-4xl drop-shadow-md pointer-events-none">
          {cat.emoji}
        </span>
      </div>
      <span className="bg-white px-4 py-1.5 rounded-full text-[11px] font-bold text-gray-800 shadow-md text-center max-w-[100px] leading-tight pointer-events-none">
        {cat.name}
      </span>
    </motion.div>
  );

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('/img/delivery_man_real_bg.png')" }}
    >
      {/* Cinematic Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>
      
      {/* Header Pill */}
      <div className="pt-14 pb-4 flex justify-center z-20">
        <Link href="/auth/map">
          <div className="bg-[#FFD175] text-black px-4 py-2 rounded-full flex items-center gap-2 shadow-xl cursor-pointer hover:bg-[#ffdb8f] transition active:scale-95">
            <Home size={18} strokeWidth={2.5} />
            <span className="font-bold text-sm max-w-[200px] truncate">{address}</span>
            <ChevronDown size={18} strokeWidth={2.5} />
          </div>
        </Link>
      </div>

      {/* Catchy Phrase */}
      <div className="text-center px-6 z-20 mt-4 mb-6">
        <h1 className="text-[32px] font-black text-white leading-tight tracking-tight mb-1 drop-shadow-lg">
          What do you want to order?
        </h1>
        <p className="text-[#FFD175] font-bold text-[17px] drop-shadow-md">
          Let Eatro roll it to you!
        </p>
      </div>

      {/* Structured Flexbox Bubbles Area */}
      <div ref={containerRef} className="flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-center gap-8 z-10 px-4 mt-2">
        {/* Top Row (2 Bubbles) */}
        <div className="flex justify-center gap-6">
          <CategoryBubble cat={categories[0]} />
          <CategoryBubble cat={categories[1]} />
        </div>
        {/* Bottom Row (3 Bubbles) */}
        <div className="flex justify-center gap-3">
          <CategoryBubble cat={categories[2]} />
          <CategoryBubble cat={categories[3]} />
          <CategoryBubble cat={categories[4]} />
        </div>
      </div>

      {/* Wavy White Bottom Section */}
      <div className="relative mt-auto w-full z-20 pointer-events-none">
        {/* SVG Wave */}
        <svg viewBox="0 0 1440 120" className="w-full absolute -top-10 left-0 fill-white" preserveAspectRatio="none">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>

        <div className="bg-white pt-6 pb-28 px-4 relative pointer-events-auto">
          
          {/* Warning Banner */}
          <div className="bg-[#FFF4E6] rounded-2xl p-4 flex items-center border border-[#FFE8CC] hover:shadow-md transition cursor-pointer active:scale-[0.98]">
            <div>
              <h3 className="font-bold text-black text-sm mb-1">We're experiencing high demand</h3>
              <p className="text-gray-600 text-[12px] leading-tight">
                Try again soon or schedule your order for tomorrow.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="pointer-events-auto">
        <BottomNav />
      </div>
    </div>
  )
}

const page = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFC244] flex items-center justify-center font-bold text-white">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

export default page
