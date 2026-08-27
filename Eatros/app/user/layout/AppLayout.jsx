"use client";
import React from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useRoleGuard } from "../../../hooks/useRoleGuard";

const AppLayout = ({ children }) => {
  useRoleGuard("customer");

  return (
    <>
      {/* 📱 Mobile / Tablet App */}
      <div className="min-h-screen bg-white overflow-hidden relative text-black lg:hidden">
        <div className="relative pb-[calc(6rem+env(safe-area-inset-bottom))]">
          <Header />
          {children}
        </div>
        <BottomNav />
      </div>

      {/* 🖥️ Desktop Warning */}
      <div className="hidden lg:flex min-h-screen items-center justify-center bg-neutral-100 text-center px-6">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Desktop Mode Not Supported
          </h1>
          <p className="text-gray-600 mb-6">
            This application is optimized for mobile devices only.
            Please open it on your phone or tablet.
          </p>
          <span className="inline-block rounded-full bg-[#A31621] px-6 py-2 text-white text-sm">
            View on a Mobile Device
          </span>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
