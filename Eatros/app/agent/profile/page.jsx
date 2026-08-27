"use client";

import React, { useState } from "react";
import { Menu, User, Phone, Mail, MapPin, Navigation, Camera } from "lucide-react";
import Sidebar from "../components/Sidebar";

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await import('../../../utils/api').then(m => m.fetchApi('/agent/profile'));
        if (data.user) {
          setUserProfile(data.user);
          setEditName(data.user.name || "");
          setEditPhone(data.user.phoneNumber || "");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { uploadImageToCloudinary } = await import('../../../utils/cloudinary');
      const { fetchApi } = await import('../../../utils/api');
      
      let profilePictureUrl = userProfile.profilePicture;

      if (newProfileImage) {
        // We use the public uploader here, no signature needed for public avatar
        profilePictureUrl = await uploadImageToCloudinary(newProfileImage);
      }

      const res = await fetchApi('/agent/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: editName,
          phoneNumber: editPhone,
          profilePicture: profilePictureUrl
        })
      });

      setUserProfile(res.user);
      setIsEditing(false);
      setNewProfileImage(null);
      setPreviewImage(null);
      // Optional: add a toast here
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen w-full relative font-sans overflow-y-auto pb-24">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-[#F8F9FA]/90 backdrop-blur-md z-10">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 active:scale-95 transition-transform"
        >
          <Menu size={24} className="text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Profile" : "Profile"}</h1>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      <div className="px-6 space-y-6">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center mt-4 mb-8 relative">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
              <img 
                src={previewImage || userProfile?.profilePicture || `https://ui-avatars.com/api/?name=${userProfile?.name || 'Agent'}&background=random&size=128`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-4 right-0 w-8 h-8 bg-[#FFCC00] rounded-full border-2 border-white flex items-center justify-center text-black shadow-sm active:scale-95 transition-transform cursor-pointer hover:bg-yellow-400">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <Camera size={14} />
              </label>
            )}
          </div>
          <h2 className="text-2xl font-black text-gray-900">{isEditing ? editName : (userProfile?.name || "...")}</h2>
          <p className="text-sm font-medium text-gray-500">Agent ID: {userProfile?._id ? userProfile._id.slice(-6).toUpperCase() : "..."}</p>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Personal Details</h3>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1 border-b border-gray-100 pb-3">
                <p className="text-xs text-gray-400 font-medium mb-1">Full Name</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-sm font-bold text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-200 focus:border-[#FFCC00] focus:outline-none" 
                  />
                ) : (
                  <p className="text-sm font-bold text-gray-900">{userProfile?.name || "N/A"}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <Phone size={18} />
              </div>
              <div className="flex-1 border-b border-gray-100 pb-3">
                <p className="text-xs text-gray-400 font-medium mb-1">Phone Number</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full text-sm font-bold text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-200 focus:border-[#FFCC00] focus:outline-none" 
                  />
                ) : (
                  <p className="text-sm font-bold text-gray-900">{userProfile?.phoneNumber || "N/A"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <Mail size={18} />
              </div>
              <div className="flex-1 border-b border-gray-100 pb-3">
                <p className="text-xs text-gray-400 font-medium mb-1">Email Address</p>
                <p className={`text-sm font-bold text-gray-900 ${isEditing ? "opacity-60" : ""}`}>
                  {userProfile?.email || "N/A"} {isEditing && "(Cannot edit)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium mb-1">Operating Zone</p>
                <p className="text-sm font-bold text-gray-900 opacity-60">{userProfile?.agentDetails?.operatingZone || "N/A"} (Cannot edit)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Vehicle Information</h3>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <Navigation size={18} />
              </div>
              <div className="flex-1 border-b border-gray-100 pb-3">
                <p className="text-xs text-gray-400 font-medium mb-1">Vehicle Type</p>
                <p className="text-sm font-bold text-gray-900">{userProfile?.agentDetails?.vehicleType || "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <div className="font-bold text-[10px] bg-gray-300 text-gray-800 px-1.5 py-0.5 rounded border border-gray-400">
                  {userProfile?.agentDetails?.licensePlate ? userProfile.agentDetails.licensePlate.substring(0,2) : "Plate"}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium mb-1">License Plate</p>
                <p className="text-sm font-bold text-gray-900">{userProfile?.agentDetails?.licensePlate || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={isSaving}
          className={`w-full hover:bg-black active:scale-95 transition-all text-white font-bold py-4 rounded-2xl shadow-lg mt-4 disabled:opacity-50 disabled:active:scale-100 ${isEditing ? 'bg-green-600 shadow-green-600/20 hover:bg-green-700' : 'bg-[#111]'}`}
        >
          {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;
