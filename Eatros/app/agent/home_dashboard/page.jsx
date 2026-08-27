"use client";

import React, { useState, useEffect } from "react";
import { Menu, Power, MapPin, ChevronLeft, Clock, Wallet, CheckCircle2 } from "lucide-react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { fetchApi } from "../../../utils/api";
import Sidebar from "../components/Sidebar";

// Dynamically import Map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

const HomeDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(true);
  const [isRiderActive, setIsRiderActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isKycApproved, setIsKycApproved] = useState(true);
  const [topOrder, setTopOrder] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const router = useRouter();

  const handleAcceptOrder = async () => {
    if (!topOrder || !isKycApproved) return;
    setIsAccepting(true);
    try {
      await fetchApi(`/agent/delivery/${topOrder._id}/accept`, { method: 'PATCH' });
      setToastMessage("Delivery Accepted!");
      router.push('/agent/active_deliveries');
    } catch (err) {
      setToastMessage(err.message || "Failed to accept delivery");
      setIsAccepting(false);
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await fetchApi('/agent/profile');
        setIsKycApproved(profileData.user?.agentDetails?.kycStatus?.toLowerCase() === 'approved');
        setIsRiderActive(profileData.user?.agentDetails?.isOnline || false);
        
        const ordersData = await fetchApi('/agent/orders');
        if (ordersData.availableOrders && ordersData.availableOrders.length > 0) {
          setTopOrder(ordersData.availableOrders[0]);
          setShowOrderPopup(true);
        } else {
          setShowOrderPopup(false);
          setTopOrder(null);
        }
      } catch(err) {
        setToastMessage("Failed to load profile");
      }
    }
    loadData();
  }, []);

  const toggleStatus = async () => {
    if (!isKycApproved) {
      setToastMessage("KYC Pending Approval. You cannot go online.");
      return;
    }
    const newState = !isRiderActive;
    
    setIsRiderActive(newState);
    setToastMessage(newState ? "You are now online & active!" : "You are now offline.");
    
    try {
      await fetchApi('/agent/status', {
        method: 'PATCH',
        body: JSON.stringify({ isOnline: newState })
      });
    } catch (err) {
      setIsRiderActive(!newState);
      setToastMessage("Failed to update status.");
    }
  };

  return (
    <div className="bg-gray-100 h-screen w-full relative font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Top Header */}
      <div className="absolute top-12 left-6 right-6 z-20 flex justify-between items-center bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 active:scale-95 transition-transform"
        >
          <Menu size={24} className="text-gray-800" />
        </button>

        <h1 className="text-xl font-bold text-gray-900">Home</h1>

        <button
          onClick={toggleStatus}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-sm active:scale-95 transition-all ${isRiderActive
              ? "border-green-500 text-green-500 bg-green-50"
              : "border-gray-300 text-gray-400 bg-white"
            }`}
        >
          <Power size={16} strokeWidth={3} />
        </button>
      </div>

      {/* KYC Pending Banner */}
      {!isKycApproved && (
        <div className="absolute top-28 left-6 right-6 z-20 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl shadow-lg shadow-orange-500/10 text-center">
            <h3 className="font-bold text-orange-800 text-sm mb-1">⚠️ KYC Pending Approval</h3>
            <p className="text-xs text-orange-600 font-medium">Your documents are under review. You cannot accept orders until approved.</p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gray-900/95 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl shadow-black/10 flex items-center gap-2 border border-gray-700">
            {isRiderActive ? <CheckCircle2 size={16} className="text-green-400" /> : <Power size={16} className="text-gray-400" />}
            {toastMessage}
          </div>
        </div>
      )}

      {/* Fullscreen Map Area */}
      <div className="absolute inset-0 z-0">
        <MapComponent height="100vh" />
      </div>

      {/* Simple Bottom Popup for New Order - Only show if approved */}
      {showOrderPopup && isKycApproved && topOrder && (
        <div className="absolute bottom-8 left-6 right-6 z-30 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white rounded-[32px] p-5 shadow-2xl flex flex-col gap-5 border border-gray-100">
            <div className="flex justify-between items-center px-1">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">New Delivery!</h3>
                <p className="text-gray-500 text-sm mt-0.5">{topOrder.vendorId?.vendorDetails?.restaurantName || "Restaurant"}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Est. Earnings</p>
                <p className="font-black text-green-600 text-xl">₦{topOrder.deliveryFee}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#F8F9FA] rounded-[24px] p-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full border-[3px] border-yellow-400 bg-white shadow-sm"></div>
                <div className="w-0.5 h-5 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 rounded-full border-[3px] border-red-500 bg-white shadow-sm"></div>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Pickup</p>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{topOrder.vendorId?.vendorDetails?.storeAddress || "Restaurant Location"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Dropoff</p>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{typeof topOrder.deliveryAddress === 'string' ? topOrder.deliveryAddress : (topOrder.deliveryAddress?.address || "Delivery Location")}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderPopup(false)}
                className="w-14 h-14 shrink-0 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center font-bold active:scale-95 transition-transform"
              >
                X
              </button>
              <button
                onClick={handleAcceptOrder}
                disabled={!isKycApproved || isAccepting}
                className="flex-1 bg-[#111] text-white text-[15px] font-bold rounded-2xl shadow-xl shadow-black/10 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAccepting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Accepting...
                  </>
                ) : (
                  "Accept Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;