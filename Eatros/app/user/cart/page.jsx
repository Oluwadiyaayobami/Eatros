"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart, ArrowRight } from 'lucide-react';
import BottomNav from '../layout/BottomNav';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('eatroCart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
    setRestaurantId(localStorage.getItem('eatroCartRestaurantId') || '1');
    setRestaurantName(localStorage.getItem('eatroCartRestaurantName') || 'Restaurant');
  }, []);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col relative text-black lg:hidden pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-12 pb-4 px-5 bg-white sticky top-0 z-40 shadow-sm">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">My Cart</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 px-5 pt-6 flex flex-col">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-[250px]">Looks like you haven't added any delicious food yet.</p>
            <button 
              onClick={() => router.push('/user/home_dashboard')}
              className="bg-[#FFD175] text-black px-8 py-3.5 rounded-full font-bold shadow-lg shadow-[#FFD175]/20 hover:bg-[#ffb938] transition active:scale-95"
            >
              Start ordering
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Ordering from</h2>
              <p className="text-xl font-bold text-gray-900">{restaurantName}</p>
            </div>

            <div className="space-y-4 mb-10">
              {cart.map((item, index) => (
                <div key={item._id || index} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">🍔</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-[15px]">{item.name}</h3>
                    <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                    <p className="text-[#00A082] font-semibold text-sm mt-1">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">₦{total.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={() => router.push(`/user/restaurants/${restaurantId}?openCart=true`)}
                className="w-full bg-[#FFD175] text-black py-4 rounded-full font-bold shadow-lg shadow-[#FFD175]/20 hover:bg-[#ffb938] transition flex items-center justify-center gap-2 active:scale-95"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
