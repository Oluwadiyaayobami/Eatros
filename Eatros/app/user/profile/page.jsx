"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, User, Ticket, Globe, Moon, HelpCircle, Bell, Trash2, LogOut, ChevronRight, Home, Search, FileText 
} from "lucide-react";
import { fetchApi } from "@/utils/api";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: "Loading...", email: "" });
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchApi('/auth/profile');
        setProfile(data.user);
        
        // Calculate initials
        const nameParts = data.user.name.split(' ');
        if (nameParts.length >= 2) {
          setInitials(nameParts[0][0] + nameParts[1][0]);
        } else if (nameParts.length === 1 && nameParts[0].length > 0) {
          setInitials(nameParts[0][0]);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile data");
      }
    };
    getProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eatroAccessToken");
    localStorage.removeItem("eatroUser");
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  const menuItems = [
    { icon: ShoppingBag, label: "Order history", href: "/user/orders" },
    { icon: User, label: "Account", href: "/user/settings" },
    { divider: true },
    { icon: Ticket, label: "Promo codes", href: "#" },
    { icon: Globe, label: "Language", href: "#" },
    { icon: Moon, label: "Appearance", href: "#" },
    { icon: HelpCircle, label: "FAQ", href: "#" },
    { icon: Bell, label: "Notifications", href: "#" },
    { divider: true },
    { icon: Trash2, label: "Delete my account and data", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#F6C641] flex flex-col font-sans pb-20">
      {/* Top Yellow Header */}
      <div className="pt-12 px-6 pb-6 relative">
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            {/* Small N circle (simulating the 'N' bubble in the design) */}
            <div className="absolute -top-2 -left-2 w-10 h-10 bg-[#3B3428] rounded-full flex items-center justify-center text-white text-sm z-10 border-2 border-[#F6C641]">
              N
            </div>
            {/* Main Initials Circle */}
            <div className="w-20 h-20 bg-[#9DE5DC] rounded-full flex items-center justify-center text-[#1E3A3A] text-xl font-bold border-2 border-[#F6C641] shadow-sm ml-4 mt-2 relative z-0">
              {initials || "U"}
            </div>
          </div>
          
          <button className="bg-[#00A082] text-white px-5 py-2 rounded-full font-bold text-sm shadow-sm hover:opacity-90">
            Help
          </button>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1D1D1D] leading-tight mb-1">
              {profile.name.split(' ').map((n, i) => <div key={i}>{n}</div>)}
            </h1>
            <p className="text-[#1D1D1D]/80 text-sm font-medium mt-2">Connect with friends</p>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="bg-white text-[#00A082] text-[10px] font-bold px-2 py-0.5 rounded uppercase">New</span>
            <ChevronRight size={20} className="text-[#1D1D1D]" />
          </div>
        </div>
      </div>

      {/* White Content Card */}
      <div className="flex-1 bg-white rounded-t-3xl pt-8 px-6 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] z-20">
        <h2 className="text-2xl font-extrabold text-[#112B3C] mb-6">Profile</h2>

        <div className="space-y-1">
          {menuItems.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="h-[1px] bg-gray-100 my-4 ml-12" />;
            }
            
            const Icon = item.icon;
            return (
              <Link key={index} href={item.href} className="flex items-center justify-between py-4 group hover:bg-gray-50 rounded-xl px-2 -mx-2 transition">
                <div className="flex items-center gap-4">
                  <Icon size={24} className="text-[#112B3C]/80" />
                  <span className="text-[17px] font-semibold text-[#112B3C]">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-400" />
              </Link>
            );
          })}

          <div className="h-[1px] bg-gray-100 my-4 ml-12" />

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 py-4 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition text-left"
          >
            <LogOut size={24} className="text-[#112B3C]/80" />
            <span className="text-[17px] font-semibold text-[#112B3C]">Log out</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        <Link href="/user/home_dashboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-black">
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/user/cart" className="flex flex-col items-center gap-1 text-gray-400 hover:text-black">
          <ShoppingBag size={24} />
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
        <Link href="/user/orders" className="flex flex-col items-center gap-1 text-gray-400 hover:text-black">
          <FileText size={24} />
          <span className="text-[10px] font-medium">Orders</span>
        </Link>
        <Link href="/user/profile" className="flex flex-col items-center gap-1 text-red-500 bg-red-50 px-4 py-2 rounded-xl">
          <User size={24} />
          <span className="text-[10px] font-semibold">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
