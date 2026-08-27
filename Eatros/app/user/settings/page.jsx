"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, User, Phone, Mail } from "lucide-react";
import { fetchApi } from "@/utils/api";
import toast from "react-hot-toast";

const AccountSettings = () => {
  const [formData, setFormData] = useState({ name: "", phoneNumber: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchApi('/auth/profile');
        setFormData({
          name: data.user.name || "",
          phoneNumber: data.user.phoneNumber || "",
          email: data.user.email || ""
        });
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    getProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetchApi('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: formData.name, phoneNumber: formData.phoneNumber })
      });
      toast.success("Profile updated successfully", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <Link href="/user/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} className="text-black" />
        </Link>
        <h1 className="text-xl font-bold text-black">Account Settings</h1>
        <div className="w-10"></div>
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#00A082] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-6 max-w-lg mx-auto">
          <div className="space-y-6">
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-4 text-gray-400" size={20} />
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#00A082] font-medium text-black transition placeholder-gray-400"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <div className="relative flex items-center">
                <Phone className="absolute left-4 text-gray-400" size={20} />
                <input 
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#00A082] font-medium text-black transition placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email Field (Read Only) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                Email Address
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Uneditable</span>
              </label>
              <div className="relative flex items-center opacity-70">
                <Mail className="absolute left-4 text-gray-400" size={20} />
                <input 
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3.5 outline-none font-medium text-gray-500 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

          </div>

          <div className="mt-10">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full ${isSaving ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} text-white rounded-full py-4 font-bold text-lg transition shadow-lg flex justify-center items-center`}
            >
              {isSaving ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;