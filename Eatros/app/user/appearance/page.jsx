"use client"

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Moon, Sun, Smartphone } from "lucide-react";

const AppearancePage = () => {
  const [theme, setTheme] = useState("system");

  const themes = [
    { id: "light", name: "Light Mode", icon: Sun },
    { id: "dark", name: "Dark Mode", icon: Moon },
    { id: "system", name: "System Default", icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <Link href="/user/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} className="text-black" />
        </Link>
        <h1 className="text-xl font-bold text-black">Appearance</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        <div className="space-y-4">
          {themes.map((t) => {
            const Icon = t.icon;
            const isActive = theme === t.id;
            
            return (
              <div 
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition ${
                  isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-white text-gray-800 border border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-gray-50'}`}>
                  <Icon size={24} className={isActive ? 'text-white' : 'text-gray-500'} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{t.name}</h3>
                </div>
                {isActive && (
                  <div className="w-6 h-6 bg-[#00A082] rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <p className="text-gray-400 text-sm mt-6 text-center">
          Dark mode helps reduce eye strain and saves battery on OLED screens.
        </p>
      </div>
    </div>
  );
};

export default AppearancePage;
