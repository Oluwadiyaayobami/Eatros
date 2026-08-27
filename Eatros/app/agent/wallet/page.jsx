"use client";

import React, { useState } from "react";
import { Menu, Bell, Plus, ArrowDownToLine, ArrowUpRight, Grip, Utensils, Send, Banknote, Car } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { fetchApi } from "../../../utils/api";
import { useEffect } from "react";

const WalletPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentName, setAgentName] = useState("Agent");
  const [agentPic, setAgentPic] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/agent/finance');
      setBalance(data.balance || 0);
      setTransactions(data.transactions || []);
      
      const profile = await fetchApi('/agent/profile');
      if (profile.user?.name) {
        setAgentName(profile.user.name);
        setAgentPic(profile.user.profilePicture || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWithdraw = async () => {
    const amountStr = prompt(`Enter amount to withdraw (Max: ₦${balance}):`);
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }
    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }
    try {
      const res = await fetchApi('/agent/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
      alert(res.message);
      loadData();
    } catch(err) {
      alert(err.message || "Withdrawal failed");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-[#EAEFE9] min-h-screen w-full relative font-sans overflow-y-auto pb-24">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-[#EAEFE9]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition-all"
          >
            <Menu size={24} className="text-gray-900" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
              <img 
                src={agentPic || `https://ui-avatars.com/api/?name=${agentName}&background=242434&color=fff&size=128`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium mb-0.5 uppercase tracking-wide">Good Morning</p>
              <h1 className="text-base font-bold text-gray-900 leading-tight">{agentName}</h1>
            </div>
          </div>
        </div>
        
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm relative active:scale-95 transition-transform">
          <Bell size={20} className="text-gray-900" />
          <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
        </button>
      </div>

      <div className="px-6">
        
        {/* Card Section */}
        <div className="relative mt-2 mb-8">
          
          {/* Back Green Layer */}
          <div className="bg-[#BCE678] rounded-[32px] pt-4 pb-16 px-6 flex justify-between items-start shadow-sm absolute w-full top-0 left-0 -z-0">
            <span className="font-bold text-[#4A5D23] text-sm mt-1">Linked Bank</span>
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform">
              <Plus size={18} className="text-[#4A5D23]" />
            </button>
          </div>

          {/* Main Dark Card */}
          <div className="bg-[#242434] rounded-[32px] p-6 text-white shadow-2xl relative z-10 mt-12 w-full aspect-[1.6/1] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Car size={16} className="text-white" />
              </div>
              <span className="text-white/60 text-xs font-medium font-mono">.... 1234</span>
            </div>

            <div className="text-center w-full">
              <h2 className="text-[40px] font-bold tracking-tight">₦{balance.toLocaleString()}</h2>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-white/80">{agentName}</span>
              <span className="text-xs font-medium text-white/60">Active</span>
            </div>
          </div>
          
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-10">
          <button onClick={handleWithdraw} className="flex-1 bg-[#242434] text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-black/10 active:scale-95 transition-transform">
            <ArrowDownToLine size={18} />
            Withdraw
          </button>
          <button className="flex-1 bg-[#BCE678] text-[#242434] rounded-2xl py-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#BCE678]/20 active:scale-95 transition-transform">
            <ArrowUpRight size={18} />
            Earnings
          </button>
          <button className="w-14 h-14 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-transform">
            <Grip size={24} className="text-[#242434]" />
          </button>
        </div>

        {/* Transactions List */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-4">All Transactions</h3>
          
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center text-gray-400 py-6 text-sm font-medium">No transactions yet</div>
            ) : transactions.map((txn) => {
              const isEarning = txn.type === "EARNING";
              return (
              <div key={txn._id} className="bg-white rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-white/50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${isEarning ? 'bg-red-50' : 'bg-purple-50'}`}>
                    {isEarning ? <Utensils size={20} className="text-[#FF4D4D]" /> : <BuildingIcon />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-[15px]">{isEarning ? "Delivery Earnings" : "Withdrawal"}</h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{formatDate(txn.createdAt)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-black text-[15px] ${isEarning ? 'text-gray-900' : 'text-red-500'}`}>{isEarning ? '' : '-'}₦{txn.amount}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">#{txn.reference.slice(-6)}</p>
                </div>
              </div>
            )})}
          </div>
        </div>

      </div>
    </div>
  );
};

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

export default WalletPage;
