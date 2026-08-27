"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Box, User, Wallet, Building2, Settings, ShieldAlert, Truck } from 'lucide-react';

import { fetchApi } from '../../../utils/api';

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [kycStatus, setKycStatus] = React.useState('none');
  const [userProfile, setUserProfile] = React.useState(null);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const cachedStr = sessionStorage.getItem('eatroAgentProfileCache');
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          if (Date.now() - cached.timestamp < 60000) { // 1 minute cache
            setUserProfile(cached.user);
            setKycStatus(cached.user.agentDetails?.kycStatus?.toLowerCase() || 'none');
            return;
          }
        }
        
        const data = await fetchApi('/agent/profile');
        if (data.user) {
          setUserProfile(data.user);
          setKycStatus(data.user.agentDetails?.kycStatus?.toLowerCase() || 'none');
          sessionStorage.setItem('eatroAgentProfileCache', JSON.stringify({
            user: data.user,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        console.error("Sidebar failed to load profile", err);
      }
    };
    if (isOpen && !userProfile) {
      loadProfile();
    }
  }, [isOpen, userProfile]);

  const menuItems = [
    { name: 'Home', icon: Home, path: '/agent/home_dashboard' },
    { name: 'Available Orders', icon: Box, path: '/agent/orders' },
    { name: 'Active Deliveries', icon: Truck, path: '/agent/active_deliveries' },
    { name: 'Profile', icon: User, path: '/agent/profile' },
    { name: 'Wallet', icon: Wallet, path: '/agent/wallet' },
    { name: 'Bank Details', icon: Building2, path: '/agent/bank_details' },
    { 
      name: 'KYC Verification', 
      icon: ShieldAlert, 
      path: '/agent/kyc', 
      tag: kycStatus === 'approved' ? 'Verified' : kycStatus === 'pending' ? 'Pending Review' : 'Incomplete',
      tagColor: kycStatus === 'approved' ? 'bg-green-50 text-green-600 border-green-200' : kycStatus === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-red-50 text-red-600 border-red-200'
    },
    { name: 'Settings', icon: Settings, path: '/agent/settings' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[100] shadow-2xl flex flex-col rounded-r-3xl"
          >
            {/* Profile Section */}
            <div className="p-8 pb-6 border-b border-gray-100 mt-12">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-4 shadow-sm border-2 border-white">
                <img 
                  src={userProfile?.profilePicture || `https://ui-avatars.com/api/?name=${userProfile?.name || 'Agent'}&background=random`}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{userProfile?.name || "Loading..."}</h2>
              <p className="text-sm text-gray-500">{userProfile?.email || ""}</p>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    href={item.path}
                    onClick={onClose}
                    className="flex items-center gap-4 px-8 py-4 transition-colors"
                  >
                    <item.icon 
                      size={20} 
                      className={isActive ? "text-[#FF4D4D]" : "text-gray-400"} 
                    />
                    <span className={`font-medium text-lg flex-1 ${isActive ? "text-[#FF4D4D]" : "text-gray-700"}`}>
                      {item.name}
                    </span>
                    {item.tag && (
                      <span className={`${item.tagColor} border text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                        {item.tag}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            
            <div className="p-8 border-t border-gray-100">
               <button className="flex items-center gap-4 text-gray-500 font-medium">
                  Log out
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
