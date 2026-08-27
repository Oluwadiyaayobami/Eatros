"use client"

import { Home, ShoppingCart, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { id: "home", icon: Home, label: "Home", to: "/user/home_dashboard" },
        { id: "cart", icon: ShoppingCart, label: "Cart", to: "/user/cart" },
        { id: "orders", icon: ShoppingBag, label: "Orders", to: "/user/orders" },
        { id: "profile", icon: User, label: "Profile", to: "/user/profile" },
      ];
    
      return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Check if the current pathname starts with the item's 'to' route (for subpages)
              const isActive = pathname.startsWith(item.to) || (item.to === "/user/home_dashboard" && pathname === "/user/home_dashboard"); 
  
              return (
                <Link key={item.id} href={item.to} className="flex-1 flex justify-center">
                  <div
                    className={`flex flex-col items-center justify-center transition-all duration-300 w-16 h-12 rounded-2xl ${
                      isActive
                        ? "text-[#A31621] bg-[#A31621]/10"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                      className="mb-1"
                    />
                    <span
                      className={`text-[10px] font-semibold transition-all duration-300 ${
                        isActive ? "text-[#A31621]" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      );
}
