"use client"
import React, { useState, useEffect } from 'react'
import AppLayout from '../layout/AppLayout'
import { Search, Filter, Bike, CheckCircle2, Phone, Clock, Hand, Truck, AlertCircle, X, QrCode } from 'lucide-react'
import { fetchApi } from '@/utils/api'
import toast from 'react-hot-toast'
import QRCode from 'react-qr-code'

export default function OrdersHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'transit', 'past'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrModalOrder, setQrModalOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchApi('/orders/vendor');
        setOrders(data.orders || []);
      } catch (err) {
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">New</span>;
      case 'ACCEPTED_BY_VENDOR': return <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold">Preparing</span>;
      case 'READY_FOR_PICKUP': return <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold">Ready</span>;
      case 'AGENT_ASSIGNED': return <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-bold">Agent Assigned</span>;
      case 'IN_TRANSIT': return <span className="bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full text-xs font-bold">In Transit</span>;
      case 'COMPLETED': return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Completed</span>;
      case 'CANCELLED': return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">Cancelled</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  // Filter & Group Orders
  const filteredOrders = orders.filter(order => {
    const searchMatch = order._id.toLowerCase().includes(searchQuery) || (order.customerId?.name || '').toLowerCase().includes(searchQuery);
    if (!searchMatch) return false;

    if (activeTab === 'active') {
      return ['PENDING', 'ACCEPTED_BY_VENDOR', 'READY_FOR_PICKUP'].includes(order.status);
    } else if (activeTab === 'transit') {
      return ['AGENT_ASSIGNED', 'IN_TRANSIT'].includes(order.status);
    } else if (activeTab === 'past') {
      return ['COMPLETED', 'CANCELLED'].includes(order.status);
    }
    return true;
  });

  // Chronological sort (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <AppLayout>
      <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto h-[calc(100vh-80px)] md:h-screen flex flex-col">
        <div className="shrink-0">
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2">Order Management</h1>
          <p className="text-gray-500 mb-6">A comprehensive list of all your restaurant's orders.</p>
          
          {/* Toolbar & Tabs */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('active')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Active
              </button>
              <button 
                onClick={() => setActiveTab('transit')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'transit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                In Transit
              </button>
              <button 
                onClick={() => setActiveTab('past')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Past
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-96 shrink-0">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search Order ID or Customer..." 
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#ED4A60] text-sm font-medium transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="sticky top-0 bg-gray-50/90 backdrop-blur z-10 shadow-sm">
                <tr>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Delivery</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#ED4A60] rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : sortedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-gray-500 font-medium">
                      No orders found in this category.
                    </td>
                  </tr>
                ) : (
                  sortedOrders.map((order) => (
                    <tr 
                      key={order._id} 
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6 font-bold text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
                          <Clock size={14} className="text-gray-400"/> 
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-800">{order.customerId?.name || 'Customer'}</p>
                      </td>
                      
                      <td className="py-4 px-6">
                        {order.deliveryMethod === 'self' ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                            <Hand size={14} /> Self Pick-up
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                            <Truck size={14} /> Agent
                          </span>
                        )}
                      </td>
                      
                      <td className="py-4 px-6">
                        {getStatusBadge(order.status)}
                      </td>
                      
                      <td className="py-4 px-6 font-extrabold text-gray-900 text-right">
                        ₦{(order.totalAmount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Details Modal (Shared with Live Orders) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-700 shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
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
                  {selectedOrder.deliveryMethod === 'agent' && (
                    <p className="text-xs font-medium text-gray-500 mt-1">{selectedOrder.deliveryAddress || 'No Address'}</p>
                  )}
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
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-lg">{item.productId?.name || 'Unknown Product'}</p>
                      </div>
                      <div className="font-bold text-gray-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer / Summary & Actions */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-600">Total Paid</span>
                <span className="text-xl font-black text-[#ED4A60]">₦{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
              
              {/* Show QR Code button for agent deliveries that are assigned or ready */}
              {selectedOrder.deliveryMethod === 'agent' && (selectedOrder.status === 'READY_FOR_PICKUP' || selectedOrder.status === 'AGENT_ASSIGNED') && (
                <button
                  onClick={() => setQrModalOrder(selectedOrder)}
                  className="w-full flex items-center justify-center gap-2 bg-[#111] text-white py-3 rounded-xl font-bold hover:bg-black active:scale-95 transition-all shadow-md"
                >
                  <QrCode size={20} /> Show QR Code for Agent
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center p-8 relative">
            <button 
              onClick={() => setQrModalOrder(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <QrCode size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Scan to Pick up</h3>
            <p className="text-gray-500 font-medium mb-8">Show this QR code to the assigned agent.</p>
            
            <div className="bg-white p-4 rounded-2xl border-4 border-gray-100 shadow-sm inline-block">
              <QRCode value={qrModalOrder.pickupQrCode || qrModalOrder._id} size={200} />
            </div>
            
            <p className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Order #{qrModalOrder._id.slice(-6).toUpperCase()}</p>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
