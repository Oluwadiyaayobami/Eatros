"use client"
import React, { useState, useEffect } from 'react'
import AppLayout from '../layout/AppLayout'
import { Search, Bell, Settings, Plus, Landmark, MoreHorizontal, ArrowUpRight, CheckCircle2, AlertCircle, X, CreditCard, RefreshCcw, ArrowDownLeft } from 'lucide-react'
import { fetchApi } from '@/utils/api'

export default function FinanceDashboard() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showControlModal, setShowControlModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [financeData, setFinanceData] = useState({
    totalIncome: 0,
    totalWithdrawn: 0,
    pendingClearance: 0,
    totalTransactions: 0,
    recentTransactions: []
  });

  const fetchFinanceData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi('/vendor/finance');
      setFinanceData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 min-h-screen bg-[#F8F9FA] font-sans">
        
        {/* Main Dashboard Container */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 max-w-[1400px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in fade-in slide-in-from-top-8 duration-700">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Welcome, Eatro Vendor <span className="text-xl">👋</span>
            </h1>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search anything" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <button onClick={fetchFinanceData} className="w-9 h-9 rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="w-9 h-9 rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                >
                  <Settings size={16} />
                </button>
                {showSettingsMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button 
                      onClick={() => { setShowAccountModal(true); setShowSettingsMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 border-b border-gray-50 transition-colors"
                    >
                      Payout Options
                    </button>
                    <button 
                      onClick={() => { setShowControlModal(true); setShowSettingsMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 border-b border-gray-50 transition-colors"
                    >
                      Control Account
                    </button>
                    <button 
                      onClick={() => { setShowPreferencesModal(true); setShowSettingsMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Preferences
                    </button>
                  </div>
                )}
              </div>
              <div className="w-9 h-9 rounded-full bg-orange-100 overflow-hidden ml-2">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Income */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-gray-500">Total Income</p>
                <MoreHorizontal size={16} className="text-gray-300" />
              </div>
              <div className="flex items-end gap-3 mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900">₦{financeData.totalIncome.toLocaleString('en-NG')}</h2>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 mb-1">
                  <ArrowUpRight size={10} /> 35%
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Increased from last month</p>
            </div>

            {/* Total Withdrawn */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-gray-500">Total Withdrawn</p>
                <MoreHorizontal size={16} className="text-gray-300" />
              </div>
              <div className="flex items-end gap-3 mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900">₦{financeData.totalWithdrawn.toLocaleString('en-NG')}</h2>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 mb-1">
                  <ArrowUpRight size={10} /> 12%
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Increased from last month</p>
            </div>

            {/* Pending Clearance */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400"></div>
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-gray-500">Pending Clearance</p>
                <MoreHorizontal size={16} className="text-gray-300" />
              </div>
              <div className="flex items-end gap-3 mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900">₦{financeData.pendingClearance.toLocaleString('en-NG')}</h2>
                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded flex items-center gap-1 mb-1">
                  <ArrowDownLeft size={10} /> 5%
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Decreased from last month</p>
            </div>

            {/* Total Transactions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-400"></div>
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-gray-500">Total Transactions</p>
                <MoreHorizontal size={16} className="text-gray-300" />
              </div>
              <div className="flex items-end gap-3 mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900">{financeData.totalTransactions}</h2>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 mb-1">
                  <ArrowUpRight size={10} /> 85%
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Increased from last month</p>
            </div>
          </div>

          {/* Grid Row 2 (Chart & Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            
            {/* Revenue Chart */}
            <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[300px] animate-in fade-in slide-in-from-left-8 duration-700 delay-300 fill-mode-both">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Your Revenue Assets</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span> Income
                    <span className="w-2 h-2 rounded-full bg-orange-400 ml-2"></span> Deductions
                  </div>
                  <select className="bg-gray-50 border border-gray-100 rounded text-xs font-bold px-2 py-1 outline-none">
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>
              </div>
              
              {/* Mock Line Chart */}
              <div className="relative flex-1 w-full flex items-end pt-4">
                {/* Y Axis */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-bold text-gray-300 pb-6">
                  <span>$700 -</span>
                  <span>$500 -</span>
                  <span>$300 -</span>
                  <span>$100 -</span>
                </div>
                
                <div className="ml-10 w-full h-full relative">
                  <svg viewBox="0 0 500 150" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                    {/* Income Line (Green) */}
                    <path d="M0,120 Q80,140 150,90 T300,130 T450,50 T500,40" fill="none" stroke="#34D399" strokeWidth="2.5"/>
                    <path d="M0,150 L0,120 Q80,140 150,90 T300,130 T450,50 T500,40 L500,150 Z" fill="url(#gradGreen)" opacity="0.1"/>
                    
                    {/* Expense Line (Orange) */}
                    <path d="M0,50 Q80,20 180,80 T350,70 T450,110 T500,100" fill="none" stroke="#FBBF24" strokeWidth="2.5"/>
                    <path d="M0,150 L0,50 Q80,20 180,80 T350,70 T450,110 T500,100 L500,150 Z" fill="url(#gradOrange)" opacity="0.1"/>
                    
                    {/* Intersection Point */}
                    <circle cx="420" cy="58" r="4" fill="white" stroke="#34D399" strokeWidth="2"/>
                    <circle cx="420" cy="98" r="4" fill="white" stroke="#FBBF24" strokeWidth="2"/>
                    <line x1="420" y1="58" x2="420" y2="150" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4"/>
                    
                    <defs>
                      <linearGradient id="gradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#34D399" stopOpacity="1" />
                        <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="gradOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FBBF24" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Tooltip */}
                  <div className="absolute top-[20%] left-[84%] -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-100 p-2 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      <span className="text-gray-500 font-medium">Income</span>
                      <span className="font-bold text-gray-900 ml-2">$540</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      <span className="text-gray-500 font-medium">Expense</span>
                      <span className="font-bold text-gray-900 ml-2">$380</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Cards / Payouts */}
            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Payout Accounts</h3>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  Withdraw Funds
                </button>
              </div>
              
              <div className="flex-1 relative min-h-[160px]">
                {/* Back Card (Stacked) */}
                <div className="absolute top-0 left-4 right-4 h-32 bg-indigo-500 rounded-2xl opacity-50 transform rotate-[-3deg] origin-bottom-left"></div>
                
                {/* Front Card */}
                <div className="absolute top-2 left-0 right-0 h-40 bg-white border border-gray-100 rounded-2xl p-5 shadow-lg flex flex-col justify-between overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-50 rounded-full blur-xl"></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="w-8 h-6 bg-gray-100 rounded border border-gray-200"></div>
                    <Landmark size={18} className="text-gray-400" />
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-gray-400 mb-1">GTBANK ACCOUNT</p>
                    <p className="font-mono text-lg font-bold text-gray-800 tracking-widest mb-2">**** **** 6452</p>
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                      <span>Eatro Vendor</span>
                      <span>12/24</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowAccountModal(true)}
                className="w-full mt-4 py-3 bg-gray-50 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} /> Add new account
              </button>
            </div>
          </div>

          {/* Grid Row 3 (Transactions & Donut) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Latest Transactions Table */}
            <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Latest Transactions</h3>
                <a href="#" className="text-xs font-bold text-indigo-600 hover:underline">See All</a>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Medium</th>
                      <th className="pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {financeData.recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-sm font-bold text-gray-400">
                          No transactions yet.
                        </td>
                      </tr>
                    ) : (
                      financeData.recentTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              tx.status === 'COMPLETED' ? 'bg-green-400' : 
                              tx.status === 'FAILED' ? 'bg-red-400' : 'bg-orange-400'
                            }`}>
                              {tx.type.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-800 text-sm">{tx.type}</span>
                          </td>
                          <td className="py-3 text-xs font-medium text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                          <td className="py-3">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                              tx.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                              tx.status === 'FAILED' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <span className="text-xs text-gray-400 font-bold mr-2">₦</span>
                            <span className={`font-bold text-sm ${tx.type === 'EARNING' ? 'text-gray-900' : 'text-gray-600'}`}>
                              {tx.type === 'EARNING' ? '+' : '-'}{tx.amount.toLocaleString('en-NG')}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transaction View Donut Chart */}
            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 delay-500 fill-mode-both">
              <div className="w-full flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Transaction View</h3>
                <h3 className="font-extrabold text-gray-900">$55,501</h3>
              </div>
              
              {/* Semi-circle Donut Mockup */}
              <div className="relative w-full max-w-[220px] aspect-[2/1] mb-6 overflow-hidden mt-4">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                  {/* Purple Arc */}
                  <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#6366F1" strokeWidth="12" strokeLinecap="round"/>
                  {/* Green Arc */}
                  <path d="M 50 10 A 40 40 0 0 1 80 23.5" fill="none" stroke="#10B981" strokeWidth="12" strokeLinecap="round"/>
                  {/* Yellow Arc */}
                  <path d="M 80 23.5 A 40 40 0 0 1 90 50" fill="none" stroke="#EAB308" strokeWidth="12" strokeLinecap="round"/>
                </svg>
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center w-full">
                  <h2 className="text-2xl font-extrabold text-gray-900">$55,501</h2>
                  <p className="text-[10px] font-bold text-green-500 flex items-center justify-center gap-1 mt-0.5">
                    <ArrowUpRight size={10} /> 20% Growth
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 text-[10px] font-bold text-gray-500 w-full justify-center">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Transaction</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Sales</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Payment</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modals */}
      
      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-extrabold text-lg text-gray-900">Withdraw Funds</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 p-2 rounded-full"><X size={16}/></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                  <input type="number" placeholder="0.00" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 font-bold text-gray-900 outline-none focus:border-indigo-500" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-2 text-right">Available: ₦{financeData.totalIncome.toLocaleString('en-NG')}</p>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Destination Account</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-700 outline-none focus:border-indigo-500 appearance-none">
                  <option>GTBank (**** 6452)</option>
                  <option>Zenith Bank (**** 8821)</option>
                </select>
              </div>

              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-95"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings / Add Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-extrabold text-lg text-gray-900">Add Bank Account</h2>
              <button onClick={() => setShowAccountModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 p-2 rounded-full"><X size={16}/></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-xs font-bold border border-amber-100 flex gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                Admin Privileges Required: Only account owners can update payout details.
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bank Name</label>
                <input type="text" placeholder="e.g. Access Bank" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-900 outline-none focus:border-indigo-500" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Account Number</label>
                <input type="text" placeholder="0000000000" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-900 outline-none focus:border-indigo-500" />
              </div>

              <button 
                onClick={() => setShowAccountModal(false)}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all active:scale-95 mt-4"
              >
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control Account Modal */}
      {showControlModal && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-extrabold text-lg text-gray-900">Control Account</h2>
              <button onClick={() => setShowControlModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 p-2 rounded-full"><X size={16}/></button>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">Suspend Withdrawals</p>
                  <p className="text-[11px] text-gray-500 font-medium">Temporarily freeze all outgoing payouts.</p>
                </div>
                <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">Require PIN</p>
                  <p className="text-[11px] text-gray-500 font-medium">Ask for 4-digit PIN on every withdrawal.</p>
                </div>
                <div className="w-10 h-5 bg-indigo-500 rounded-full relative cursor-pointer transition-colors">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button className="w-full py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm rounded-xl transition-colors">
                  Deactivate Finance Account
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-2">This action is irreversible and requires Admin approval.</p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-extrabold text-lg text-gray-900">Preferences</h2>
              <button onClick={() => setShowPreferencesModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 p-2 rounded-full"><X size={16}/></button>
            </div>
            <div className="p-6 space-y-5">
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Base Currency</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-700 outline-none focus:border-indigo-500 appearance-none">
                  <option>USD ($)</option>
                  <option>NGN (₦)</option>
                  <option>EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Auto-Withdrawal Threshold</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                  <input type="number" defaultValue="5000" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 font-bold text-gray-900 outline-none focus:border-indigo-500" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-1">Automatically withdraw when balance hits this amount.</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-gray-900 text-sm">Email Notifications</p>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-sm">SMS Alerts (Payouts)</p>
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                </div>
              </div>

              <button 
                onClick={() => setShowPreferencesModal(false)}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all active:scale-95 mt-2"
              >
                Save Preferences
              </button>

            </div>
          </div>
        </div>
      )}

    </AppLayout>
  )
}
