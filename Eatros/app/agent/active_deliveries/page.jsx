"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Menu, 
  Box, 
  ClipboardList, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  ScanLine,
  ChevronLeft,
  Camera,
  QrCode,
  X,
  Phone,
  MessageCircle
} from "lucide-react";
import io from 'socket.io-client';
import toast from "react-hot-toast";
import { fetchApi } from "../../../utils/api";
import Sidebar from "../components/Sidebar";
import QRCode from "react-qr-code";

const ActiveDeliveriesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderState, setOrderState] = useState('VIEWING'); // 'VIEWING', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED'
  
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showDropoffQRModal, setShowDropoffQRModal] = useState(false);
  const [pickupInput, setPickupInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isKycApproved, setIsKycApproved] = useState(true);

  const [activeOrders, setActiveOrders] = useState([]);
  const [agentName, setAgentName] = useState("Agent");

  const loadDashboard = async () => {
    try {
      const profileData = await fetchApi('/agent/profile');
      setAgentName(profileData.user?.name || "Agent");
      const kycApproved = profileData.user?.agentDetails?.kycStatus?.toLowerCase() === "approved";
      setIsKycApproved(kycApproved);
      
      const ordersData = await fetchApi('/agent/orders');
      if (ordersData.activeOrders) {
        const formattedOrders = ordersData.activeOrders.map(order => ({
          _id: order._id,
          id: `#${order._id.toString().slice(-6).toUpperCase()}`,
          time: new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          status: order.status.replace(/_/g, ' '),
          backendStatus: order.status,
          statusColor: order.status === 'IN_TRANSIT' ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600",
          customer: order.customerId?.name || "Customer",
          phone: order.customerId?.phoneNumber || "No phone",
          pickup: order.vendorId?.vendorDetails?.storeAddress || "Vendor Address",
          dropoff: typeof order.deliveryAddress === 'string' ? order.deliveryAddress : (order.deliveryAddress?.address || "Delivery Location"),
          price: `₦${order.totalAmount || 0}`,
          deliveryFee: `₦${order.deliveryFee || 0}`,
          items: `${order.items?.length || 0} items`,
          dropoffQrCode: order.dropoffQrCode
        }));
        setActiveOrders(formattedOrders);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load dashboard data", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
    }
  };

  useEffect(() => {
    loadDashboard();

    // Setup WebSocket for ready pings
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');
    
    socket.on('orderReadyForPickup', (data) => {
      // Refresh the dashboard to get latest statuses
      loadDashboard();
      
      // Notify agent
      toast.success(data.message || "An order is ready for pickup!", {
        duration: 5000,
        icon: '🔔'
      });
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed', e));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleViewActiveDetails = (order) => {
    setSelectedOrder(order);
    if (order.backendStatus === 'AGENT_ASSIGNED') {
      setOrderState('ACCEPTED');
    } else if (order.backendStatus === 'IN_TRANSIT') {
      setOrderState('IN_TRANSIT');
    } else {
      setOrderState('VIEWING');
    }
  };

  const handleAcceptDelivery = async () => {
    try {
      await fetchApi(`/agent/delivery/${selectedOrder._id}/accept`, {
        method: 'PATCH'
      });
      toast.success("Delivery accepted successfully!");
      setOrderState('ACCEPTED');
      loadDashboard();
    } catch (error) {
      toast.error(error.message || "Failed to accept delivery");
    }
  };

  const handleVerifyPickup = async () => {
    if (!pickupInput) {
      toast.error("Please enter the pickup code");
      return;
    }
    
    setIsVerifying(true);
    try {
      await fetchApi(`/agent/delivery/${selectedOrder._id}/verify-pickup`, {
        method: 'POST',
        body: JSON.stringify({ pickupQrCode: pickupInput })
      });
      
      toast.success("Pickup verified successfully!");
      setOrderState('IN_TRANSIT');
      setShowScannerModal(false);
      setPickupInput("");
      loadDashboard();
    } catch (error) {
      toast.error(error.message || "Invalid pickup code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white min-h-screen w-full relative font-sans overflow-y-auto pb-24">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
            <img 
              src="https://ui-avatars.com/api/?name=Raju&background=random" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hi, {agentName.split(' ')[0]}</h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Ready to deliver ?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2">
            <Bell size={24} className="text-gray-600" />
            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border border-white">
              5
            </div>
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 active:scale-95 transition-transform"
          >
            <Menu size={28} className="text-gray-900" />
          </button>
        </div>
      </div>

      {!selectedOrder ? (
        <div className="px-6 space-y-8 animate-in fade-in duration-300">
          
          {/* KYC Pending Banner */}
          {!isKycApproved && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl shadow-sm text-center">
              <h3 className="font-bold text-orange-800 text-sm mb-1">⚠️ KYC Pending Approval</h3>
              <p className="text-xs text-orange-600 font-medium">You cannot process orders until your documents are approved.</p>
            </div>
          )}

          {/* Active Deliveries */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Active Deliveries</h2>
            </div>

            <div className="space-y-4">
              {activeOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-400 font-medium">
                  You have no active deliveries
                </div>
              ) : activeOrders.map((delivery, i) => (
                <div key={i} className="border-2 border-green-400 bg-green-50 rounded-[20px] p-2 shadow-sm">
                  {/* Card Top Row */}
                  <div className="flex justify-between items-center p-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
                          <Box size={22} />
                        </div>
                        {/* Status Icon Indicator */}
                        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full">
                          <CheckCircle2 size={16} className="text-green-500 fill-green-500" strokeWidth={1.5} color="white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-[15px]">Order : {delivery.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Assigned to you</p>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${delivery.statusColor}`}>
                      {delivery.status}
                    </div>
                  </div>

                  {/* Card Bottom / Details Row */}
                  <div className="bg-white rounded-2xl p-4 border border-green-100">
                    <h3 className="font-bold text-gray-900 mb-2">{delivery.customer}</h3>
                    <p className="text-sm text-gray-600 mb-1 leading-snug">{delivery.dropoff}</p>
                    <p className="text-xs text-gray-500 mb-4">{delivery.phone}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-4 text-gray-800 font-medium">
                        <div className="flex items-center gap-1.5 text-sm">
                          <ClipboardList size={18} className="text-gray-500" />
                          {delivery.items}
                        </div>
                        <span className="font-bold text-lg">{delivery.price}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleViewActiveDetails(delivery)}
                        className="bg-green-500 hover:bg-green-600 active:scale-95 transition-all text-white font-bold py-2.5 px-6 rounded-xl shadow-sm"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      ) : (
        /* Order Details / Action View */
        <div className="px-6 animate-in slide-in-from-right duration-300">
          <button 
            onClick={() => setSelectedOrder(null)} 
            className="flex items-center gap-2 text-gray-600 mb-6 font-medium active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} /> Back to Active Deliveries
          </button>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Order {selectedOrder.id}</h2>
            <p className="text-gray-500 text-sm mb-6">Assigned to {selectedOrder.customer}</p>

            <div className="relative pl-8 space-y-8 mb-8">
              {/* Dotted Line */}
              <div className="absolute left-3 top-2 bottom-2 w-px border-l-2 border-dashed border-gray-300"></div>
              
              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Pickup Location</p>
                <p className="font-semibold text-gray-900 leading-snug">
                  {selectedOrder.pickup}
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <MapPin size={12} className="text-green-600" />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Delivery Location</p>
                <p className="font-semibold text-gray-900 leading-snug">
                  {selectedOrder.dropoff}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Delivery Fee</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{selectedOrder.deliveryFee}</p>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                <p className="text-gray-400 text-xs">Total Items</p>
                <p className="font-bold text-gray-900">{selectedOrder.items}</p>
              </div>
            </div>
          </div>

          {orderState === 'VIEWING' && (
            <button 
              onClick={handleAcceptDelivery}
              disabled={!isKycApproved}
              className={`w-full active:scale-95 transition-all font-bold text-lg py-5 rounded-2xl shadow-lg ${isKycApproved ? 'bg-[#FFCC00] hover:bg-yellow-400 text-black shadow-yellow-500/20' : 'bg-gray-200 text-gray-500 shadow-none'}`}
            >
              {isKycApproved ? "Accept Delivery" : "KYC Pending Approval"}
            </button>
          )}

          {orderState === 'ACCEPTED' && (
            <div className="animate-in zoom-in duration-300">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center justify-center gap-2">
                <CheckCircle2 className="text-green-500" size={20} />
                <span className="font-bold text-green-700">Delivery Accepted!</span>
              </div>
              
              <button 
                onClick={() => setShowScannerModal(true)}
                className="w-full flex items-center justify-center gap-3 bg-[#111] hover:bg-black active:scale-95 transition-all text-white font-bold text-lg py-5 rounded-2xl shadow-lg"
              >
                <ScanLine size={24} />
                Scan to Pick Up
              </button>
            </div>
          )}

          {orderState === 'IN_TRANSIT' && (
            <div className="animate-in zoom-in duration-300">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-center gap-2">
                <Box className="text-blue-500" size={20} />
                <span className="font-bold text-blue-700">Order Picked Up!</span>
              </div>
              
              <button 
                onClick={() => setShowDropoffQRModal(true)}
                className="w-full flex items-center justify-center gap-3 bg-[#111] hover:bg-black active:scale-95 transition-all text-white font-bold text-lg py-5 rounded-2xl shadow-lg"
              >
                <QrCode size={24} />
                Generate Dropoff QR
              </button>
            </div>
          )}

          {orderState === 'COMPLETED' && (
            <div className="animate-in zoom-in duration-300">
              <div className="bg-green-500 rounded-3xl p-8 mb-6 flex flex-col items-center justify-center text-center shadow-xl shadow-green-500/20">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Delivery Complete!</h3>
                <p className="text-green-100 font-medium">You earned <span className="font-bold text-white">{selectedOrder.deliveryFee}</span></p>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedOrder(null);
                  setOrderState('VIEWING');
                }}
                className="w-full bg-white border-2 border-gray-100 hover:bg-gray-50 active:scale-95 transition-all text-gray-900 font-bold text-lg py-5 rounded-2xl shadow-sm"
              >
                Find More Orders
              </button>
            </div>
          )}

        </div>
      )}

      {/* Pickup Scanner Modal */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
          <div className="p-6 flex justify-between items-center text-white bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
            <h2 className="text-lg font-bold">Scan Restaurant QR</h2>
            <button onClick={() => setShowScannerModal(false)} className="p-2 bg-white/10 rounded-full active:bg-white/20">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {/* Fake Camera Feed Background */}
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <Camera size={64} className="text-gray-600 absolute opacity-30" />
            
            {/* Scanner Frame */}
            <div className="relative w-64 h-64 border-2 border-white/50 rounded-2xl">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-2xl"></div>
              {/* Scan Line Animation */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          <div className="p-8 bg-black flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Enter 6-character Pickup Code" 
              value={pickupInput}
              onChange={(e) => setPickupInput(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full bg-gray-800 text-white font-bold text-center text-xl py-4 rounded-xl border border-gray-700 focus:outline-none focus:border-green-500 uppercase tracking-[0.2em]"
            />
            <button 
              onClick={handleVerifyPickup}
              disabled={isVerifying}
              className={`w-full ${isVerifying ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'} active:scale-95 text-white font-bold text-lg py-5 rounded-2xl shadow-lg shadow-green-500/20 transition-all flex justify-center items-center gap-2`}
            >
              {isVerifying ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : "Verify Pickup"}
            </button>
          </div>
        </div>
      )}

      {/* Dropoff QR Modal */}
      {showDropoffQRModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 relative flex flex-col items-center text-center shadow-2xl">
            <button 
              onClick={() => setShowDropoffQRModal(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 text-gray-500 rounded-full active:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-black text-gray-900 mb-2">Completion QR Code</h2>
            <p className="text-gray-500 text-sm mb-8">Ask the buyer to scan this code with their Eatro app to complete the delivery.</p>
            
            {/* Real QR Code */}
            <div className="w-56 h-56 bg-gray-50 border-2 border-gray-100 rounded-3xl p-4 mb-8 flex items-center justify-center">
              <QRCode value={selectedOrder?.dropoffQrCode || "ERROR"} size={200} />
            </div>

            <p className="w-full bg-gray-100 text-gray-500 font-bold text-sm py-4 rounded-2xl">Waiting for customer scan...</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ActiveDeliveriesPage;