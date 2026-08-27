"use client"

import Link from "next/link";
import { ChevronLeft, Ticket, Tag } from "lucide-react";

const PromoCodes = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <Link href="/user/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} className="text-black" />
        </Link>
        <h1 className="text-xl font-bold text-black">Promo codes</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mb-8">
          <div className="w-16 h-16 bg-[#F6C641]/20 rounded-full flex items-center justify-center text-[#F6C641] mx-auto mb-4">
            <Ticket size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Have a promo code?</h2>
          <p className="text-gray-500 text-sm mb-6">Enter it here to get discounts on your next delicious meal.</p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. EATRO10"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#00A082] uppercase font-bold text-black"
            />
            <button className="bg-black text-white px-6 rounded-xl font-bold hover:bg-gray-800 transition">
              Apply
            </button>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Tag size={20} className="text-[#00A082]" />
          Available Offers
        </h3>
        
        <div className="flex flex-col items-center justify-center py-10 opacity-60">
            <Ticket size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">No active promotions right now.</p>
        </div>
      </div>
    </div>
  );
};

export default PromoCodes;
