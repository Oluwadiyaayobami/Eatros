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
  Search, 
  Filter, 
  Package, 
  Clock, 
  RefreshCw
} from "lucide-react";
import io from 'socket.io-client';
import toast from "react-hot-toast";
import { fetchApi } from "../../../utils/api";
import Sidebar from "../components/Sidebar";

const OrdersPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderState, setOrderState] = useState('VIEWING'); // 'VIEWING', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED'
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showDropoffQRModal, setShowDropoffQRModal] = useState(false);
  const [isKycApproved, setIsKycApproved] = useState(true);

  const [performanceStats, setPerformanceStats] = useState([
    { label: "Total Deliveries", value: "0" },
    { label: "Completed", value: "0" },
    { label: "Pending", value: "0" },
    { label: "Failed", value: "0" }
  ]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [agentName, setAgentName] = useState("Agent");

  const loadDashboard = async (page = 1) => {
    try {
      // Load user profile for name and KYC
      const profileData = await fetchApi('/agent/profile');
      setAgentName(profileData.user?.name || "Agent");
      setIsKycApproved(profileData.user?.agentDetails?.kycStatus?.toLowerCase() === "approved");

      // Load orders
      const data = await fetchApi(`/agent/orders?page=${page}&limit=20`);
      
      if (data.stats) {
        setPerformanceStats([
          { label: "Total Deliveries", value: data.stats.totalDeliveries.toString() },
          { label: "Completed", value: data.stats.completed.toString() },
          { label: "Pending", value: data.stats.pending.toString() },
          { label: "Failed", value: data.stats.failed.toString() }
        ]);
      }

      if (data.availableOrders) {
        const formattedOrders = data.availableOrders.map(order => ({
          _id: order._id,
          id: `#${order._id.toString().slice(-6).toUpperCase()}`,
          time: new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          status: "New",
          statusColor: "bg-blue-100 text-blue-600",
          customer: order.customerId?.name || "Customer",
          pickup: order.vendorId?.vendorDetails?.storeAddress || order.vendorId?.vendorDetails?.restaurantName || "Restaurant",
          dropoff: typeof order.deliveryAddress === 'string' ? order.deliveryAddress : (order.deliveryAddress?.address || "Delivery Location"),
          phone: order.customerId?.phoneNumber || "N/A",
          items: `${order.items?.length || 0} items`,
          price: `₦${order.totalAmount || 0}`,
          deliveryFee: `₦${order.deliveryFee || 0}`,
          iconType: "warning"
        }));
        setAvailableOrders(formattedOrders);

        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setCurrentPage(data.pagination.page);
        }

        // Check if we came from map to view an order
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          if (params.get('action') === 'view' && formattedOrders.length > 0) {
            setSelectedOrder(formattedOrders[0]);
            setOrderState('VIEWING');
          }
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to load dashboard data", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
    }
  };

  useEffect(() => {
    loadDashboard();
    
    // Setup WebSocket
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');
    
    socket.on('newAvailableOrder', (newOrder) => {
      const formattedOrder = {
        _id: newOrder._id,
        id: `#${newOrder._id.toString().slice(-6).toUpperCase()}`,
        time: new Date(newOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: "New",
        statusColor: "bg-blue-100 text-blue-600",
        customer: newOrder.customerId?.name || "Customer",
        pickup: newOrder.vendorId?.vendorDetails?.storeAddress || newOrder.vendorId?.vendorDetails?.restaurantName || "Restaurant",
        dropoff: typeof newOrder.deliveryAddress === 'string' ? newOrder.deliveryAddress : (newOrder.deliveryAddress?.address || "Delivery Location"),
        phone: newOrder.customerId?.phoneNumber || "N/A",
        items: `${newOrder.items?.length || 0} items`,
        price: `₦${newOrder.totalAmount || 0}`,
        deliveryFee: `₦${newOrder.deliveryFee || 0}`,
        iconType: "warning"
      };
      
      setAvailableOrders(prev => [formattedOrder, ...prev]);
      
      // Optional: Flash a toast
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed', e));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOrderState('VIEWING');
  };

  const handleRejectDelivery = async () => {
    try {
      await fetchApi(`/agent/orders/${selectedOrder._id}/reject`, {
        method: 'PATCH'
      });
      toast.success("Delivery Rejected");
      setSelectedOrder(null);
      loadDashboard();
    } catch (err) {
      toast.error(err.message || "Failed to reject delivery");
    }
  };

  const handleAcceptDelivery = async () => {
    try {
      await fetchApi(`/agent/delivery/${selectedOrder._id}/accept`, {
        method: 'PATCH'
      });
      toast.success("Delivery Accepted!", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
      setOrderState('ACCEPTED');
      loadDashboard(); // Refresh available orders list in background
    } catch (err) {
      toast.error(err.message || "Failed to accept delivery", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
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
              <p className="text-xs text-orange-600 font-medium">You cannot accept orders until your documents are approved.</p>
            </div>
          )}

          {/* Delivery Performance */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Delivery Performance</h2>
              <p className="text-xs text-gray-400 mt-0.5">Overview of today's performance</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {performanceStats.map((stat, i) => (
                <div key={i} className="border border-yellow-200/60 rounded-xl p-4 bg-white shadow-sm">
                  <p className="text-xs text-gray-600 font-medium mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Available Orders */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Available Orders</h2>
              <button className="text-sm font-semibold text-yellow-500">View All</button>
            </div>

            <div className="space-y-4">
              {availableOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-400 font-medium">
                  No new orders available right now
                </div>
              ) : availableOrders.map((delivery, i) => (
                <div key={i} className="border border-gray-100 rounded-[20px] p-2 bg-white shadow-sm">
                  
                  {/* Card Top Row */}
                  <div className="flex justify-between items-center p-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
                          <Box size={22} />
                        </div>
                        {/* Status Icon Indicator */}
                        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full">
                          {delivery.iconType === 'success' ? (
                            <CheckCircle2 size={16} className="text-green-500 fill-green-500" strokeWidth={1.5} color="white" />
                          ) : (
                            <AlertCircle size={16} className="text-orange-500 fill-orange-500" strokeWidth={1.5} color="white" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-[15px]">Order : {delivery.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{delivery.time}</p>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${delivery.statusColor}`}>
                      {delivery.status}
                    </div>
                  </div>

                  {/* Card Bottom / Details Row */}
                  <div className="bg-[#FFFDF4] rounded-2xl p-4 border border-yellow-50/50">
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
                        onClick={() => handleViewDetails(delivery)}
                        className="bg-[#FFCC00] hover:bg-yellow-400 active:scale-95 transition-all text-black font-bold py-2.5 px-6 rounded-xl shadow-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 border-t border-gray-100 pt-4">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => loadDashboard(currentPage - 1)}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-50 rounded-lg disabled:opacity-50 active:scale-95 transition-all"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => loadDashboard(currentPage + 1)}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-50 rounded-lg disabled:opacity-50 active:scale-95 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </section>

        </div>
      ) : (
        /* Order Details / Action View */
        <div className="px-6 animate-in slide-in-from-right duration-300">
          <button 
            onClick={() => setSelectedOrder(null)} 
            className="flex items-center gap-2 text-gray-600 mb-6 font-medium active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} /> Back to Orders
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
            <div className="flex flex-col gap-3 mt-6">
              <button 
                onClick={handleAcceptDelivery}
                disabled={!isKycApproved}
                className={`w-full active:scale-95 transition-all font-bold text-lg py-5 rounded-2xl shadow-lg ${isKycApproved ? 'bg-[#FFCC00] hover:bg-yellow-400 text-black shadow-yellow-500/20' : 'bg-gray-200 text-gray-500 shadow-none'}`}
              >
                {isKycApproved ? "Accept Delivery" : "KYC Pending Approval"}
              </button>
              <button 
                onClick={handleRejectDelivery}
                disabled={!isKycApproved}
                className={`w-full active:scale-95 transition-all font-bold text-lg py-4 rounded-2xl border-2 ${isKycApproved ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-gray-200 text-gray-400 bg-gray-50'}`}
              >
                Reject Delivery
              </button>
            </div>
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

          <div className="p-8 bg-black">
            <button 
              onClick={() => {
                setShowScannerModal(false);
                setOrderState('IN_TRANSIT');
              }}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold text-lg py-5 rounded-2xl shadow-lg shadow-green-500/20 transition-all"
            >
              Simulate Successful Scan
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
            
            {/* Fake QR Code */}
            <div className="w-56 h-56 bg-gray-50 border-2 border-gray-100 rounded-3xl p-4 mb-8">
              <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain bg-center bg-no-repeat opacity-90"></div>
            </div>

            <button 
              onClick={() => {
                setShowDropoffQRModal(false);
                setOrderState('COMPLETED');
              }}
              className="w-full bg-[#111] hover:bg-black active:scale-95 text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-black/10 transition-all"
            >
              Simulate Buyer Scan
            </button>
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

export default OrdersPage;