"use client";

import React, { useState } from "react";
import { Menu, Building2, CreditCard, UserCircle2, CheckCircle2, ShieldCheck } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { fetchApi } from "../../../utils/api";
import { useEffect } from "react";
import toast from "react-hot-toast";

const BankDetailsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [linkedBank, setLinkedBank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBankDetails = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi('/agent/bank');
      if (data.bankDetails && data.bankDetails.accountNumber) {
        setLinkedBank(data.bankDetails);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBankDetails();
  }, []);

  const handleSaveBank = async () => {
    if (!accountNumber || !bankName || !accountName) {
      toast.error("Please fill all bank details");
      return;
    }
    try {
      setIsFetching(true);
      const res = await fetchApi('/agent/bank', {
        method: 'PUT',
        body: JSON.stringify({ accountNumber, bankName, accountName })
      });
      toast.success(res.message || "Bank details updated");
      setLinkedBank(res.bankDetails);
      setAccountNumber("");
      setBankName("");
      setAccountName("");
    } catch (err) {
      toast.error(err.message || "Failed to update bank details");
    } finally {
      setIsFetching(false);
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
        <h1 className="text-xl font-bold text-gray-900">Bank Details</h1>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      <div className="px-6 space-y-6">
        
        {/* Security Banner */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex gap-3 items-start">
          <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
          <p className="text-xs text-green-800 leading-relaxed font-medium">
            Your bank details are securely encrypted. We only use this information to process your weekly payouts.
          </p>
        </div>

        {/* Current Linked Bank Card */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 ml-1 text-sm uppercase tracking-wider">Currently Linked</h3>
          
          {isLoading ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-center">
              <p className="text-gray-400 font-medium">Loading...</p>
            </div>
          ) : linkedBank ? (
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-10"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Building2 size={24} className="text-gray-800" />
                </div>
                <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-green-100">
                  <CheckCircle2 size={12} />
                  Verified
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Account Number</p>
                <p className="text-2xl font-black text-gray-900 tracking-[0.2em] font-mono">{linkedBank.accountNumber}</p>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Account Name</p>
                  <p className="text-sm font-bold text-gray-900">{linkedBank.accountName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Bank</p>
                  <p className="text-sm font-bold text-gray-900">{linkedBank.bankName}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-center">
              <p className="text-gray-400 font-medium">No bank linked yet.</p>
            </div>
          )}
        </div>

        {/* Update Form (Visual Only Placeholder) */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-6 ml-1 text-sm uppercase tracking-wider">Update Details</h3>
          
          <div className="space-y-4">
            {/* Account Number First */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Account Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <CreditCard size={18} />
                </div>
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit number"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 shadow-sm focus:outline-none focus:border-gray-900 placeholder:text-gray-300 transition-colors"
                />
              </div>
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Bank Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Building2 size={18} />
                </div>
                <select 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 appearance-none shadow-sm focus:outline-none focus:border-gray-900 transition-colors"
                >
                  <option value="">Select Bank</option>
                  <option value="GTBank">GTBank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="UBA">UBA</option>
                </select>
              </div>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Account Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserCircle2 size={18} />
                </div>
                <input 
                  type="text" 
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Enter Account Name"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 shadow-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveBank}
              disabled={isFetching}
              className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg mt-6 ${isFetching ? 'bg-gray-400' : 'bg-[#111] hover:bg-black active:scale-95 transition-all'}`}
            >
              {isFetching ? 'Saving...' : 'Save New Details'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BankDetailsPage;
