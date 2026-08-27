"use client"

import Link from "next/link";
import { ChevronLeft, Bell, Gift, Pizza, MapPin } from "lucide-react";

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: "promo",
      icon: Gift,
      title: "50% off your next order! 🍔",
      description: "Use code EATRO50 at checkout. Valid until midnight.",
      time: "2 hours ago",
      read: false,
      color: "bg-[#00A082]"
    },
    {
      id: 2,
      type: "order",
      icon: Pizza,
      title: "Order Delivered!",
      description: "Your order from Chicken Republic has been delivered. Enjoy your meal!",
      time: "Yesterday",
      read: true,
      color: "bg-[#F6C641]"
    },
    {
      id: 3,
      type: "alert",
      icon: MapPin,
      title: "New restaurants near you",
      description: "3 new restaurants just opened in your area. Tap to explore.",
      time: "3 days ago",
      read: true,
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <Link href="/user/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} className="text-black" />
        </Link>
        <h1 className="text-xl font-bold text-black">Notifications</h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="space-y-1">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div 
                key={notif.id}
                className={`flex gap-4 p-6 bg-white border-b border-gray-100 ${!notif.read ? 'bg-blue-50/30' : ''}`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${notif.color}`}>
                    <Icon size={20} />
                  </div>
                  {!notif.read && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold text-[15px] mb-1 ${!notif.read ? 'text-black' : 'text-gray-800'}`}>
                    {notif.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">
                    {notif.description}
                  </p>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {notif.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-8 flex justify-center">
          <button className="text-[#00A082] font-bold hover:underline">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
