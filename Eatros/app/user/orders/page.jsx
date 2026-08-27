"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ShoppingBag, Clock, MapPin, Receipt, CheckCircle } from "lucide-react";
import { fetchApi } from "@/utils/api";
import toast from "react-hot-toast";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchApi('/orders/user');
        setOrders(data.orders || []);
      } catch (error) {
        toast.error("Failed to fetch order history");
      } finally {
        setIsLoading(false);
      }
    };
    getOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTED_BY_VENDOR': return 'bg-blue-100 text-blue-700';
      case 'READY_FOR_PICKUP': return 'bg-indigo-100 text-indigo-700';
      case 'AGENT_ASSIGNED': return 'bg-purple-100 text-purple-700';
      case 'IN_TRANSIT': return 'bg-orange-100 text-orange-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link href="/user/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} className="text-black" />
        </Link>
        <h1 className="text-xl font-bold text-black">Order history</h1>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center mt-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#00A082] rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Receipt size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 max-w-[250px]">Looks like you haven't made your first order with Eatro.</p>
            <Link href="/user/home_dashboard" className="mt-8 bg-[#00A082] text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-90">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link href={`/user/orders/${order._id}`} key={order._id} className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-[#00A082] transition group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#F6C641]/20 rounded-full flex items-center justify-center text-[#F6C641]">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-[#00A082] transition">
                        {order.vendorId?.vendorDetails?.restaurantName || "Restaurant"}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                
                <div className="border-t border-gray-50 pt-3 flex justify-between items-end">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-black">{order.items.length}</span> item(s)
                  </div>
                  <div className="font-black text-lg text-black">
                    ₦{order.totalAmount.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;