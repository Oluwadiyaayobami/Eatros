"use client";

import React from "react";
import { Smartphone } from "lucide-react";
import { useRoleGuard } from "../../hooks/useRoleGuard";

export default function AgentLayout({ children }) {
  useRoleGuard("agent");

  return (
    <div className="w-full min-h-screen bg-gray-50">
      
      {/* Desktop / Tablet Fallback (Hidden on Mobile) */}
      <div className="hidden md:flex min-h-screen w-full flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg shadow-black/5 mb-8">
          <Smartphone size={48} className="text-gray-400" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Mobile Only Experience</h1>
        <p className="text-lg text-gray-500 max-w-md leading-relaxed">
          The Eatro Agent App is designed specifically for riders on the go. Please open this link on your mobile phone to access your dashboard, accept orders, and manage your wallet.
        </p>
      </div>

      {/* Mobile App View (Hidden on Desktop) */}
      <div className="block md:hidden min-h-screen w-full bg-white relative mx-auto shadow-2xl overflow-hidden sm:max-w-md">
        {children}
      </div>
      
    </div>
  );
}
