"use client"
import React, { useState } from 'react'
import AppLayout from '../layout/AppLayout'
import { QrCode, CheckCircle2, Clock, Phone, X, AlertCircle, Hand, Truck, Search } from 'lucide-react'

import { fetchApi } from '@/utils/api'
import toast from 'react-hot-toast'
import QRCode from 'react-qr-code'

export default function LiveOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For "View Details"
  const [qrModalOrder, setQrModalOrder] = useState(null); // For "Show QR Code" (Agent)
  const [verifyQrModalOrder, setVerifyQrModalOrder] = useState(null); // For "Verify QR Code" (Self Pickup)
  const [scannedQrCode, setScannedQrCode] = useState(''); // Holds the code typed/scanned by vendor
  const [declineModalOrder, setDeclineModalOrder] = useState(null); // For custom Decline pop-up
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING', 'ACCEPTED_BY_VENDOR', 'READY_FOR_PICKUP'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccepting, setIsAccepting] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await fetchApi('/orders/vendor');
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const markAsReady = async (id) => {
    try {
      await fetchApi(`/orders/${id}/ready`, { method: 'PATCH' });
      toast.success('Order marked as ready');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const submitQrVerification = async () => {
    if (!scannedQrCode.trim()) {
      toast.error("Please enter a valid code.");
      return;
    }
    
    try {
      await fetchApi(`/orders/${verifyQrModalOrder._id}/verify-pickup`, { 
        method: 'POST',
        body: JSON.stringify({ qrCode: scannedQrCode })
      });
      toast.success('Order successfully verified and completed!');
      setVerifyQrModalOrder(null);
      setScannedQrCode('');
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Invalid QR code. Please try again.');
    }
  };

  const acceptOrder = async (id) => {
    setIsAccepting(true);
    try {
      await fetchApi(`/orders/${id}/vendor-accept`, { method: 'PATCH' });
      toast.success('Order accepted');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to accept order');
    } finally {
      setIsAccepting(false);
    }
  };

  const confirmDecline = () => {
    if (declineModalOrder) {
      setOrders(orders.filter(o => o.id !== declineModalOrder));
      setSelectedOrder(null);
      setDeclineModalOrder(null);
    }
  };

  const renderOrderCard = (order) => (
    <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col mb-4">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">#{order._id.slice(-6).toUpperCase()}</h3>
          <p className="text-sm text-gray-500 font-medium mt-1">Customer: <span className="text-gray-800">{order.customerId?.name || 'Customer'}</span></p>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          order.status === 'PENDING' ? 'bg-blue-100 text-blue-600 animate-pulse' :
          order.status === 'ACCEPTED_BY_VENDOR' ? 'bg-orange-100 text-orange-600' : 
          'bg-green-100 text-green-600'
        }`}>
          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Delivery Method Badge */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
        {order.deliveryMethod === 'self' ? (
          <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-md">
            <Hand size={14} /> Self Pick-up
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-md">
            <Truck size={14} /> Agent Delivery
          </span>
        )}
      </div>

      {/* Items List (Preview) */}
      <div className="p-4 flex-1">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</h4>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="font-bold text-gray-700">{item.quantity}x</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.productId?.name || 'Unknown Product'}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">₦{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        {order.status === 'PENDING' && (
          <button 
            onClick={() => setSelectedOrder(order)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <AlertCircle size={16} /> View Details
          </button>
        )}
        {order.status === 'ACCEPTED_BY_VENDOR' && (
          <button 
            onClick={() => markAsReady(order._id)}
            className="w-full py-2.5 bg-[#ED4A60] hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} /> Mark as Ready
          </button>
        )}
        {order.status === 'READY_FOR_PICKUP' && (
          order.deliveryMethod === 'self' ? (
            <button 
              onClick={() => setVerifyQrModalOrder(order)}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <AlertCircle size={16} /> Enter Customer Code
            </button>
          ) : (
            <button 
              onClick={() => setQrModalOrder(order)}
              className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <QrCode size={16} /> Show QR to Agent
            </button>
          )
        )}
      </div>
    </div>
  );

  const newOrders = orders.filter(o => o.status === 'PENDING');
  const preparingOrders = orders.filter(o => o.status === 'ACCEPTED_BY_VENDOR');
  const readyOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP');

  // Filter orders by search and active tab
  const displayedOrders = orders.filter(order => {
    if (order.status !== activeTab) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const customerName = (order.customerId?.name || '').toLowerCase();
      const orderId = order._id.toLowerCase();
      return customerName.includes(query) || orderId.includes(query);
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="h-[calc(100vh-80px)] md:h-screen flex flex-col p-4 md:p-8 pb-24 max-w-7xl mx-auto w-full">
        <div className="shrink-0 mb-6">
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2">Live Orders</h1>
          <p className="text-gray-500 mb-6">Manage active orders through your kitchen workflow.</p>
          
          {/* Toolbar & Tabs */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('PENDING')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'PENDING' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <span className={`w-2 h-2 rounded-full ${activeTab === 'PENDING' ? 'bg-blue-600 animate-pulse' : 'bg-gray-400'}`}></span>
                New Orders
                <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full ml-1">{newOrders.length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('ACCEPTED_BY_VENDOR')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'ACCEPTED_BY_VENDOR' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <span className={`w-2 h-2 rounded-full ${activeTab === 'ACCEPTED_BY_VENDOR' ? 'bg-orange-600' : 'bg-gray-400'}`}></span>
                Preparing
                <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full ml-1">{preparingOrders.length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('READY_FOR_PICKUP')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'READY_FOR_PICKUP' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <span className={`w-2 h-2 rounded-full ${activeTab === 'READY_FOR_PICKUP' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                Ready
                <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full ml-1">{readyOrders.length}</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-96 shrink-0">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Customer Name or Order ID..." 
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#ED4A60] text-sm font-medium transition-colors"
              />
            </div>
          </div>
        </div>
        
        {/* Grid Container */}
        <div className="flex-1 overflow-y-auto pr-2">
          {displayedOrders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Search className="text-gray-300" size={24} />
              </div>
              <p className="text-gray-500 font-bold text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or check another tab.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedOrders.map(renderOrderCard)}
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal (For New Orders) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">{new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-700 shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Delivery Method & Customer Info */}
              <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-center items-center text-center">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Type</h4>
                  {selectedOrder.deliveryMethod === 'self' ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg">
                      <Hand size={16} /> Self Pick-up
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg">
                      <Truck size={16} /> Agent Delivery
                    </span>
                  )}
                </div>
                <div className="flex-1 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col justify-center">
                  <h4 className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-2">Customer Info</h4>
                  <p className="font-semibold text-gray-900">{selectedOrder.customerId?.name || 'Customer'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {item.productId?.imageUrl ? (
                          <img src={item.productId.imageUrl} alt={item.productId?.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">🍔</div>
                        )}
                      </div>
                      <span className="font-bold text-gray-700 text-lg">{item.quantity}x</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{item.productId?.name || 'Unknown Product'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button 
                onClick={() => setDeclineModalOrder(selectedOrder._id)}
                className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Decline Order
              </button>
              <button 
                onClick={() => acceptOrder(selectedOrder._id)}
                disabled={isAccepting}
                className="flex-[2] py-3 bg-[#ED4A60] text-white font-bold rounded-xl hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {isAccepting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Accepting...
                  </>
                ) : (
                  "Accept & Start Preparing"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal (For Ready Orders) */}
      {qrModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center p-8">
            <button onClick={() => setQrModalOrder(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors">
              <X size={18} />
            </button>
            
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Order #{qrModalOrder._id.slice(-6).toUpperCase()}</h2>
            <p className="text-gray-500 font-medium mb-6">is ready for pickup!</p>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-6">
              {qrModalOrder.pickupQrCode ? (
                <QRCode value={qrModalOrder.pickupQrCode} size={180} />
              ) : (
                <QrCode size={180} strokeWidth={1} className="text-gray-800" />
              )}
            </div>
            
            <p className="text-sm font-medium text-gray-500 max-w-[250px]">
              Have the delivery rider scan this QR code to officially confirm pickup.
            </p>
          </div>
        </div>
      )}

      {/* Verify Customer QR Modal (For Self Pickup) */}
      {verifyQrModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center p-8 relative">
            <button 
              onClick={() => { setVerifyQrModalOrder(null); setScannedQrCode(''); }} 
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <QrCode size={32} strokeWidth={2.5} />
            </div>
            
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">Verify Customer Code</h2>
            <p className="text-gray-500 font-medium text-sm mb-6 max-w-[250px]">
              Ask the customer for their unique 6-character code to hand over the order.
            </p>
            
            <div className="w-full mb-6">
              <input 
                type="text" 
                placeholder="Enter customer code here..."
                value={scannedQrCode}
                onChange={(e) => setScannedQrCode(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-center font-mono font-bold tracking-widest text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
              />
            </div>
            
            <button 
              onClick={submitQrVerification}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 active:scale-95"
            >
              Verify & Complete Order
            </button>
          </div>
        </div>
      )}
      {/* Decline Confirmation Modal */}
      {declineModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertCircle size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Decline Order?</h2>
              <p className="text-sm text-gray-500 font-medium mb-8">
                Are you sure you want to reject this order? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeclineModalOrder(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDecline}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                >
                  Yes, Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
