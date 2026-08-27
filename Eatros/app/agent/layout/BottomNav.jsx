"use client"

import { Home, ShoppingBag, Package, Wallet, Settings } from 'lucide-react';
import { useState } from 'react';
import GlassBG from './GlassBG';
import Link from 'next/link';
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const [activeTab, setActiveTab] = useState('home');
    const pathname = usePathname();

    const navItems = [
        { id: "home", icon: Home, label: "Home", to: "/agent/home_dashboard" },
        { id: "orders", icon: ShoppingBag, label: "Orders", to: "/agent/orders" },
        { id: "earnings", icon: Wallet, label: "Earnings", to: "/agent/earnings" },
        { id: "settings", icon: Settings, label: "Settings", to: "/agent/settings" },
      ];
    
      return (
        <nav className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-40">
          <div className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center px-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.to; // ✅ Active by route
    
                return (
                  <Link key={item.id} href={item.to}>
                    <button
                      className={`flex flex-col items-center transition-all duration-300 px-6.5 cursor-pointer py-2 ${
                        isActive
                          ? "text-white/90 bg-[#A31621]/40 rounded-4xl my-1"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className="transition-all duration-300"
                      />
                      <span
                        className={`text-xs font-medium transition-all duration-300 ${
                          isActive ? "opacity-100 text-white/80" : "opacity-70"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      );
}
