import React from "react";
import GlassBG from "./GlassBG";
import {
  ShoppingCart,
  User,
  Star,
  Ticket,
  Globe,
  HelpCircle,
  Bell,
  Trash2,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const settingsData = [
  { id: 1, title: "Order History", icon: <ShoppingCart size={20} /> },
  { id: 2, title: "Account", icon: <User size={20} /> },
  { id: 3, title: "Eatro Plus", icon: <Star size={20} /> },
  { id: 4, title: "Promo Codes", icon: <Ticket size={20} /> },
  { id: 5, title: "Language", icon: <Globe size={20} /> },
  { id: 6, title: "FAQ", icon: <HelpCircle size={20} /> },
  { id: 7, title: "Notifications", icon: <Bell size={20} /> },
  { id: 8, title: "Delete my account and data", icon: <Trash2 size={20} /> },
  { id: 9, title: "Log Out", icon: <LogOut size={20} /> },
];

const Settings = () => {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-medium mb-5 text-gray-800">Profile</h2>

      <GlassBG className="rounded-r-full">
        <div className="flex items-center gap-4 p-5">
          {/* Profile Image */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80"
              alt="Profile photo"
              fill
              className="object-cover"
            />
          </div>

          {/* User Info */}
          <div>
            <p className="text-lg font-semibold text-gray-800">John Doe</p>
            <p className="text-sm text-gray-600">john.doe@example.com</p>
          </div>
        </div>
      </GlassBG>

      {/* Settings Options */}
      <div className="mt-10 mb-20 flex flex-col gap-2">
        {settingsData.map((item) => (
          <GlassBG key={item.id} className="p-4 flex items-center justify-between rounded-md">
            <div className="flex items-center gap-3 text-[#A31621]">
              {item.icon}
              <span className="text-gray-800 font-medium">{item.title}</span>
            </div>
            <ChevronRight size={18}  className="text-gray-600 " />
          </GlassBG>
        ))}
      </div>
    </div>
  );
};

export default Settings;
