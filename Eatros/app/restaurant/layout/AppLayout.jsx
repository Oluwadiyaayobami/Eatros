"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRoleGuard } from "../../../hooks/useRoleGuard";
import toast from "react-hot-toast";
import { fetchApi } from "@/utils/api";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Rocket, 
  LayoutDashboard, 
  TrendingUp,
  Wallet,
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  Truck, 
  Store, 
  CircleDollarSign,
  FileBox,
  AlertCircle,
  Menu as MenuIconLucide,
  X,
  LogOut
} from "lucide-react";

// Simple custom hamburger-like menu icon used in the sidebar for "Menu items"
function CustomMenuIcon({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
  );
}

const AppLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const fullText = "Eatro Vendor";

  useRoleGuard("vendor");

  useEffect(() => {
    const verifyRole = async () => {
      try {
        const data = await fetchApi('/auth/profile');
        if (data.user?.role !== 'vendor') {
          toast.error("Unauthorized access. Please log in as a vendor.");
          router.push('/auth/login');
        } else {
          setIsVerifying(false);
        }
      } catch (err) {
        toast.error("Session expired. Please log in again.");
        router.push('/auth/login');
      }
    };
    verifyRole();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("eatroAccessToken");
    localStorage.removeItem("eatroUser");
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length + 6) { // Extra counts to pause at the end before restarting
        i = 0;
      }
    }, 200); // Speed of typing
    return () => clearInterval(interval);
  }, []);

  const typedEatro = typedText.slice(0, 6);
  const typedVendor = typedText.slice(6);

  // Helper to determine if a link is active
  const isActive = (path) => pathname === path || pathname?.startsWith(path + "/");

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-[#ED4A60] p-1.5 rounded-md shadow-sm">
            <Rocket size={18} className="text-white animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div className="text-xl font-bold min-w-[140px] flex items-center">
            <span className="text-yellow-400">{typedEatro}</span>
            <span className="text-[#ED4A60]">{typedVendor}</span>
            <span className="animate-[pulse_0.7s_infinite] text-gray-400 ml-[2px] font-light">|</span>
          </div>
        </div>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto pb-6">
        <Link 
          href="/restaurant/home_dashboard" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/restaurant/home_dashboard') ? 'bg-[#FFF0F2] text-[#ED4A60] border-l-2 border-[#ED4A60]' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={18} className={isActive('/restaurant/home_dashboard') ? 'text-[#ED4A60]' : 'text-gray-400'} /> Dashboard
        </Link>
        <Link 
          href="/restaurant/live-orders" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/restaurant/live-orders') ? 'bg-[#FFF0F2] text-[#ED4A60] border-l-2 border-[#ED4A60]' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <ShoppingBag size={18} className={isActive('/restaurant/live-orders') ? 'text-[#ED4A60]' : 'text-gray-400'} /> Live Order
        </Link>
        <Link 
          href="/restaurant/orders" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/restaurant/orders') ? 'bg-[#FFF0F2] text-[#ED4A60] border-l-2 border-[#ED4A60]' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <ShoppingCart size={18} className={isActive('/restaurant/orders') ? 'text-[#ED4A60]' : 'text-gray-400'} /> Order
        </Link>

        <div className="mt-6 mb-2 px-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Users</p>
        </div>
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors">
          <Users size={18} className="text-gray-400" /> Employees
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors">
          <Truck size={18} className="text-gray-400" /> Drivers
        </a>

        <div className="mt-6 mb-2 px-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</p>
        </div>
        <Link 
          href="/restaurant/settings" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/restaurant/settings') ? 'bg-[#FFF0F2] text-[#ED4A60] border-l-2 border-[#ED4A60]' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <Store size={18} className={isActive('/restaurant/settings') ? 'text-[#ED4A60]' : 'text-gray-400'} /> Store Settings
        </Link>
        <Link 
          href="/restaurant/analytics" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/restaurant/analytics') ? 'bg-[#FFF0F2] text-[#ED4A60] border-l-2 border-[#ED4A60]' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <TrendingUp size={18} className={isActive('/restaurant/analytics') ? 'text-[#ED4A60]' : 'text-gray-400'} /> Analytics
        </Link>
        <Link 
          href="/restaurant/finance" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/restaurant/finance') ? 'bg-[#FFF0F2] text-[#ED4A60] border-l-2 border-[#ED4A60]' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <Wallet size={18} className={isActive('/restaurant/finance') ? 'text-[#ED4A60]' : 'text-gray-400'} /> Finance
        </Link>
        
        {/* Active Dropdown: Food Menu */}
        <div>
          <a href="#" className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/restaurant/products') ? 'text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <FileBox size={18} className={isActive('/restaurant/products') ? 'text-gray-500' : 'text-gray-400'} /> Food Menu
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </a>
          <div className="ml-9 mt-1 space-y-1">
            <Link 
              href="/restaurant/products" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/restaurant/products') ? 'bg-[#FFF0F2] text-[#ED4A60] border-l-2 border-[#ED4A60] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CustomMenuIcon className={isActive('/restaurant/products') ? 'text-[#ED4A60]' : 'text-gray-400'} /> Menu items
            </Link>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
              <AlertCircle size={16} className="text-gray-400" /> Additives
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} className="text-gray-400" /> Extras
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
              <Store size={16} className="text-gray-400" /> Variant
            </a>
          </div>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-semibold transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );

  if (isVerifying) {
    return (
      <div className="flex h-screen bg-[#F8F9FA] items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#ED4A60]/30 border-t-[#ED4A60] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-gray-100 flex-col h-full bg-white shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Top Header (only visible on small screens) */}
        <div className="md:hidden bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)}>
              <MenuIconLucide size={24} className="text-gray-900" />
            </button>
            <span className="text-lg font-bold text-[#001738]">Eatro Vendor</span>
          </div>
          <div className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center text-white text-sm font-semibold">
            N
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

    </div>
  );
};

export default AppLayout;