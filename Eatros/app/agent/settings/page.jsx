"use client";

import React, { useState } from "react";
import { Menu, Bell, Volume2, Navigation, HelpCircle, FileText, LogOut, ChevronRight, Wallet, Banknote } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { fetchApi } from "../../../utils/api";
import { useEffect } from "react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  
  const [payoutPref, setPayoutPref] = useState('manual');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadSettings = async () => {
    try {
      const data = await fetchApi('/agent/bank');
      if (data.bankDetails && data.bankDetails.payoutPreference) {
        setPayoutPref(data.bankDetails.payoutPreference);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleUpdatePayoutPref = async (pref) => {
    try {
      setIsUpdating(true);
      const res = await fetchApi('/agent/settings', {
        method: 'PATCH',
        body: JSON.stringify({ payoutPreference: pref })
      });
      setPayoutPref(pref);
      toast.success(res.message || "Payout preference updated");
    } catch (err) {
      toast.error("Failed to update payout preference");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen w-full relative font-sans overflow-y-auto pb-24">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-[#F8F9FA]/90 backdrop-blur-md z-10">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 active:scale-95 transition-transform"
        >
          <Menu size={24} className="text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      <div className="px-6 space-y-8 mt-2">
        
        {/* App Preferences */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 ml-1 text-sm uppercase tracking-wider">App Preferences</h3>
          
          <div className="bg-white rounded-3xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
            
            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[15px]">Push Notifications</p>
                  <p className="text-xs text-gray-400 font-medium">For new order alerts</p>
                </div>
              </div>
              <button 
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${pushEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${pushEnabled ? 'translate-x-6.5 left-0.5' : 'translate-x-0.5 left-0'}`}></div>
              </button>
            </div>

            {/* Sound Toggles */}
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500">
                  <Volume2 size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[15px]">Sound Alerts</p>
                  <p className="text-xs text-gray-400 font-medium">Ring on new order</p>
                </div>
              </div>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${soundEnabled ? 'translate-x-6.5 left-0.5' : 'translate-x-0.5 left-0'}`}></div>
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500">
                  <Navigation size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[15px]">Background Location</p>
                  <p className="text-xs text-gray-400 font-medium">Track while app is closed</p>
                </div>
              </div>
              <button 
                onClick={() => setLocationEnabled(!locationEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${locationEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${locationEnabled ? 'translate-x-6.5 left-0.5' : 'translate-x-0.5 left-0'}`}></div>
              </button>
            </div>

          </div>
        </div>

        {/* Payout Preferences */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 ml-1 text-sm uppercase tracking-wider">Payout Preferences</h3>
          
          <div className="bg-white rounded-3xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-2">
            
            <button 
              onClick={() => handleUpdatePayoutPref('automatic_24h')}
              disabled={isUpdating}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${payoutPref === 'automatic_24h' ? 'border-green-500 bg-green-50' : 'border-transparent active:bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${payoutPref === 'automatic_24h' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Banknote size={18} />
                </div>
                <div>
                  <p className={`font-bold text-[15px] ${payoutPref === 'automatic_24h' ? 'text-green-900' : 'text-gray-900'}`}>Automatic Deposit</p>
                  <p className={`text-xs font-medium mt-0.5 ${payoutPref === 'automatic_24h' ? 'text-green-700' : 'text-gray-400'}`}>Sends to bank every 24 hours</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutPref === 'automatic_24h' ? 'border-green-500' : 'border-gray-300'}`}>
                {payoutPref === 'automatic_24h' && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
              </div>
            </button>

            <button 
              onClick={() => handleUpdatePayoutPref('manual')}
              disabled={isUpdating}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${payoutPref === 'manual' ? 'border-[#242434] bg-gray-50' : 'border-transparent active:bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${payoutPref === 'manual' ? 'bg-[#242434] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Wallet size={18} />
                </div>
                <div>
                  <p className={`font-bold text-[15px] ${payoutPref === 'manual' ? 'text-gray-900' : 'text-gray-900'}`}>Manual Withdrawal</p>
                  <p className={`text-xs font-medium mt-0.5 ${payoutPref === 'manual' ? 'text-gray-600' : 'text-gray-400'}`}>Funds stay in wallet until you withdraw</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutPref === 'manual' ? 'border-[#242434]' : 'border-gray-300'}`}>
                {payoutPref === 'manual' && <div className="w-2.5 h-2.5 rounded-full bg-[#242434]"></div>}
              </div>
            </button>

          </div>
        </div>

        {/* Support & Legal */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 ml-1 text-sm uppercase tracking-wider">Support & Legal</h3>
          
          <div className="bg-white rounded-3xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
            
            <button className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500">
                  <HelpCircle size={18} />
                </div>
                <p className="font-bold text-gray-900 text-[15px]">Help & Support</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button className="flex items-center justify-between p-4 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500">
                  <FileText size={18} />
                </div>
                <p className="font-bold text-gray-900 text-[15px]">Terms & Conditions</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>

          </div>
        </div>

        {/* Log Out */}
        <button className="w-full bg-white border border-red-100 text-red-500 active:bg-red-50 transition-colors font-bold py-4 rounded-2xl shadow-sm mt-8 flex items-center justify-center gap-2">
          <LogOut size={18} />
          Log Out
        </button>

      </div>
    </div>
  );
};

export default SettingsPage;