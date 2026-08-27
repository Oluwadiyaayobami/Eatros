"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Download, ShoppingBag, Truck, Hand, QrCode, ScanLine, X } from "lucide-react";
import { fetchApi } from "@/utils/api";
import toast from "react-hot-toast";
import { toPng } from 'html-to-image';

const OrderDetails = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [scanInput, setScanInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const data = await fetchApi(`/orders/${orderId}`);
        setOrder(data.order);
      } catch (error) {
        toast.error("Failed to fetch order details");
        router.push('/user/orders');
      } finally {
        setIsLoading(false);
      }
    };
    if (orderId) getOrder();
  }, [orderId, router]);

  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById('receipt-content');
    if (!receiptElement) return;

    try {
      const dataUrl = await toPng(receiptElement, { quality: 0.95, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `Receipt_${order._id.slice(-6).toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Receipt downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download receipt.");
    }
  };

  const handleVerifyDelivery = async () => {
    if (!scanInput) {
      toast.error("Please enter the Agent's Dropoff QR Code.");
      return;
    }
    setIsVerifying(true);
    try {
      await fetchApi(`/orders/${orderId}/verify-delivery`, {
        method: 'POST',
        body: JSON.stringify({ dropoffQrCode: scanInput })
      });
      toast.success("Delivery verified successfully! Payouts released.");
      setShowScanner(false);
      
      // Reload order data
      const data = await fetchApi(`/orders/${orderId}`);
      setOrder(data.order);
    } catch (err) {
      toast.error(err.message || "Invalid Agent QR Code");
    } finally {
      setIsVerifying(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#00A082] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link href="/user/orders" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} className="text-black" />
        </Link>
        <h1 className="text-xl font-bold text-black">Order #{order._id.slice(-6).toUpperCase()}</h1>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      <div className="p-6 max-w-lg mx-auto space-y-6">
        
        {/* Status Alert for READY_FOR_PICKUP */}
        {order.status === 'READY_FOR_PICKUP' && order.deliveryMethod === 'self' && (
          <div className="bg-purple-600 rounded-2xl p-6 text-white text-center shadow-lg animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-extrabold mb-1">Your Order is Ready!</h2>
            <p className="text-purple-100 text-sm font-medium mb-4">
              Provide this code to the restaurant staff to collect your food.
            </p>
            <div className="bg-white/20 rounded-xl p-4 inline-block mb-2 border border-white/30">
              <span className="font-mono text-2xl font-black tracking-[0.2em] uppercase">
                {order.pickupQrCode?.substring(0, 8) || 'CODE'}
              </span>
            </div>
          </div>
        )}

        {/* Status Alert for IN_TRANSIT with Agent */}
        {order.status === 'IN_TRANSIT' && order.deliveryMethod === 'agent' && (
          <div className="bg-blue-600 rounded-2xl p-6 text-white text-center shadow-lg animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-extrabold mb-1">Your Food is Here!</h2>
            <p className="text-blue-100 text-sm font-medium mb-4">
              The agent has arrived. Scan their code to confirm delivery.
            </p>
            <button 
              onClick={() => setShowScanner(true)}
              className="w-full bg-white hover:bg-blue-50 active:scale-95 text-blue-600 font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
            >
              <ScanLine size={20} />
              Scan Agent QR
            </button>
          </div>
        )}

        {/* Receipt Container */}
        <div id="receipt-content" className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden shrink-0">
                {order.vendorId?.vendorDetails?.restaurantImage ? (
                  <img src={order.vendorId.vendorDetails.restaurantImage} alt="Restaurant" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#00A082]"><ShoppingBag size={20} /></div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Ordered From</p>
                <h3 className="font-bold text-gray-900 leading-tight">
                  {order.vendorId?.vendorDetails?.restaurantName || "Restaurant"}
                </h3>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Delivery Method Badge */}
          <div className="flex items-center gap-2 mb-6">
            {order.deliveryMethod === 'self' ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg w-full justify-center">
                <Hand size={16} /> Self Pick-up
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg w-full justify-center">
                <Truck size={16} /> Agent Delivery
              </span>
            )}
          </div>

          <div className="border-t-2 border-dashed border-gray-100 my-6"></div>

          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Items Ordered</h4>
          <div className="space-y-4 mb-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  {item.productId?.imageUrl ? (
                    <img src={item.productId.imageUrl} alt={item.productId?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">🍔</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-900 text-sm">
                      <span className="text-[#00A082] mr-1.5">{item.quantity}x</span>
                      {item.productId?.name || 'Unknown Product'}
                    </p>
                    <span className="font-bold text-gray-900 text-sm">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-gray-100 my-6"></div>

          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-gray-900 font-medium">₦{(order.totalAmount - order.deliveryFee).toLocaleString()}</span>
            </div>
            {order.deliveryMethod === 'agent' && (
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-gray-900 font-medium">₦{order.deliveryFee.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
            <span className="font-bold text-gray-900">Total Paid</span>
            <span className="text-xl font-black text-[#00A082]">₦{order.totalAmount.toLocaleString()}</span>
          </div>

        </div>

        {/* Download Action */}
        <button 
          onClick={handleDownloadReceipt}
          className="w-full py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-2xl text-sm font-bold transition-colors shadow-sm border border-gray-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <Download size={18} /> Regenerate Receipt
        </button>

      </div>
      {/* Agent Dropoff Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 relative flex flex-col items-center text-center shadow-2xl">
            <button 
              onClick={() => setShowScanner(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 text-gray-500 rounded-full active:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-black text-gray-900 mb-2">Confirm Delivery</h2>
            <p className="text-gray-500 text-sm mb-8">Ask the agent to show their Completion QR Code, and enter it below.</p>
            
            <input 
              type="text" 
              placeholder="Enter 6-char Code" 
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full bg-gray-50 text-gray-900 font-black text-center text-2xl py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 uppercase tracking-[0.2em] mb-6 shadow-inner"
            />
            
            <button 
              onClick={handleVerifyDelivery}
              disabled={isVerifying}
              className={`w-full ${isVerifying ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} active:scale-95 text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex justify-center items-center gap-2`}
            >
              {isVerifying ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : "Confirm & Pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
