"use client"
import React, { useState, useRef } from "react";
import GlassBG from "../../layout/GlassBG";
import { Camera, Save, Clock, Store, MapPin, Phone, Mail, Globe, Banknote, Timer, Loader2 } from "lucide-react";
import { fetchApi } from "@/utils/api";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // References for hidden file inputs
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    location: "",
    category: "",
    minOrder: "",
    deliveryTime: "",
    isTemporarilyClosed: false,
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    profileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80"
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchApi('/auth/profile');
        if (data.user && data.user.vendorDetails) {
          const vd = data.user.vendorDetails;
          setStoreData(prev => ({
            ...prev,
            name: vd.restaurantName || "",
            description: vd.description || "",
            phone: data.user.phoneNumber || "",
            email: data.user.email || "",
            location: vd.storeAddress || "",
            category: vd.cuisineType || "",
            isTemporarilyClosed: vd.businessStatus === "CLOSED",
            coverImage: vd.coverImage || prev.coverImage,
            profileImage: vd.profileImage || prev.profileImage,
          }));

          if (vd.weeklySchedule) {
            setSchedule(vd.weeklySchedule);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const [schedule, setSchedule] = useState({
    Monday: { isOpen: true, open: "08:00", close: "20:00" },
    Tuesday: { isOpen: true, open: "08:00", close: "20:00" },
    Wednesday: { isOpen: false, open: "08:00", close: "20:00" },
    Thursday: { isOpen: true, open: "10:00", close: "18:00" },
    Friday: { isOpen: true, open: "08:00", close: "22:00" },
    Saturday: { isOpen: true, open: "09:00", close: "22:00" },
    Sunday: { isOpen: false, open: "09:00", close: "20:00" },
  });

  const handleStoreChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };



  const handleScheduleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi('/vendor/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          restaurantName: storeData.name,
          storeAddress: storeData.location,
          businessStatus: storeData.isTemporarilyClosed ? "CLOSED" : "OPEN",
          coverImage: storeData.coverImage,
          profileImage: storeData.profileImage,
          description: storeData.description,
          weeklySchedule: schedule
        })
      });
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'cover') setIsUploadingCover(true);
    if (type === 'profile') setIsUploadingProfile(true);

    try {
      const url = await uploadImageToCloudinary(file);
      setStoreData(prev => ({
        ...prev,
        [type === 'cover' ? 'coverImage' : 'profileImage']: url
      }));
      
      // Auto-save the image to the backend immediately
      await fetchApi('/vendor/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          [type === 'cover' ? 'coverImage' : 'profileImage']: url
        })
      });

      toast.success(`${type === 'cover' ? 'Cover' : 'Profile'} image updated and saved!`);
    } catch (error) {
      toast.error(`Failed to upload ${type} image`);
    } finally {
      if (type === 'cover') setIsUploadingCover(false);
      if (type === 'profile') setIsUploadingProfile(false);
      // Reset input so the same file can be uploaded again if needed
      e.target.value = null;
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto pb-24">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Store Settings</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "profile" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
        >
          Store Profile
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "schedule" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
        >
          Availability
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === "profile" && (
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Hidden File Inputs */}
            <input type="file" accept="image/*" ref={coverInputRef} onChange={(e) => handleImageUpload(e, 'cover')} className="hidden" />
            <input type="file" accept="image/*" ref={profileInputRef} onChange={(e) => handleImageUpload(e, 'profile')} className="hidden" />

            {/* Cover & Profile Image Section */}
            <div className="mb-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Branding</h3>
                <p className="text-sm text-gray-500">Customize how your store appears to customers.</p>
              </div>
              
              {/* Cover Photo Block */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Store Background (Cover Photo)</label>
                <div 
                  className="relative h-48 bg-gray-200 rounded-2xl overflow-hidden group cursor-pointer border border-gray-200"
                  onClick={() => coverInputRef.current.click()}
                >
                  <img src={storeData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploadingCover ? (
                      <>
                        <Loader2 className="text-white mb-2 animate-spin" size={32} />
                        <span className="text-white font-medium text-sm">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="text-white mb-2" size={32} />
                        <span className="text-white font-medium text-sm">Click to change cover photo</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Photo Block */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture (Logo)</label>
                <div className="flex items-center gap-5">
                  <div className="relative group/profile cursor-pointer" onClick={() => profileInputRef.current.click()}>
                    <div className="w-[100px] h-[100px] rounded-full border border-gray-200 overflow-hidden bg-white shadow-sm">
                      <img src={storeData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button 
                      type="button"
                      disabled={isUploadingProfile}
                      className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/profile:opacity-100 transition-opacity rounded-full"
                    >
                      {isUploadingProfile ? <Loader2 size={24} className="text-white animate-spin" /> : <Camera size={24} className="text-white" />}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600 max-w-xs">Upload your restaurant's logo. We recommend an image of at least 300x300px.</span>
                    <button 
                      type="button"
                      onClick={() => profileInputRef.current.click()}
                      className="text-sm font-bold text-[#ED4A60] hover:underline self-start mt-2"
                    >
                      Change Profile Picture
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <hr className="border-gray-100" />

            {/* Basic Info Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Name</label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="text" name="name" value={storeData.name} onChange={handleStoreChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 text-gray-800 font-medium outline-none focus:bg-white focus:border-[#ED4A60] focus:ring-1 focus:ring-[#ED4A60] transition-all" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea name="description" value={storeData.description} onChange={handleStoreChange} rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-800 font-medium outline-none focus:bg-white focus:border-[#ED4A60] focus:ring-1 focus:ring-[#ED4A60] transition-all"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="tel" name="phone" value={storeData.phone} onChange={handleStoreChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 text-gray-800 font-medium outline-none focus:bg-white focus:border-[#ED4A60] focus:ring-1 focus:ring-[#ED4A60] transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="email" name="email" value={storeData.email} onChange={handleStoreChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 text-gray-800 font-medium outline-none focus:bg-white focus:border-[#ED4A60] focus:ring-1 focus:ring-[#ED4A60] transition-all" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location / Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="text" name="location" value={storeData.location} onChange={handleStoreChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 text-gray-800 font-medium outline-none focus:bg-white focus:border-[#ED4A60] focus:ring-1 focus:ring-[#ED4A60] transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Operational Settings */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Operational Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Minimum Order Amount (₦)</label>
                  <div className="relative">
                    <Banknote className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="number" name="minOrder" value={storeData.minOrder} onChange={handleStoreChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 text-gray-800 font-medium outline-none focus:bg-white focus:border-[#ED4A60] focus:ring-1 focus:ring-[#ED4A60] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Est. Delivery/Prep Time</label>
                  <div className="relative">
                    <Timer className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="text" name="deliveryTime" value={storeData.deliveryTime} onChange={handleStoreChange} placeholder="e.g. 30-45 mins" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 text-gray-800 font-medium outline-none focus:bg-white focus:border-[#ED4A60] focus:ring-1 focus:ring-[#ED4A60] transition-all" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website or Social Link (Optional)</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="url" name="website" value={storeData.website} onChange={handleStoreChange} placeholder="https://" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 text-gray-800 font-medium outline-none focus:bg-white focus:border-[#ED4A60] focus:ring-1 focus:ring-[#ED4A60] transition-all" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "schedule" && (
          <div className="p-6 md:p-8 space-y-6 bg-gray-50">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="font-bold text-orange-900 text-lg">Temporary Closure</h3>
                <p className="text-sm text-orange-700 font-medium mt-1">Instantly pause all incoming orders. Your store will appear "Closed" to customers.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" name="isTemporarilyClosed" checked={storeData.isTemporarilyClosed} onChange={handleStoreChange} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Clock size={20} className="text-[#ED4A60]" /> Weekly Availability
              </h3>
              
              <div className="space-y-4">
                {Object.keys(schedule).map((day) => (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 w-40 shrink-0">
                      <input 
                        type="checkbox" 
                        checked={schedule[day].isOpen} 
                        onChange={(e) => handleScheduleChange(day, "isOpen", e.target.checked)} 
                        className="w-5 h-5 text-[#ED4A60] bg-gray-100 border-gray-300 rounded focus:ring-[#ED4A60] focus:ring-2 cursor-pointer" 
                      />
                      <span className={`font-bold ${schedule[day].isOpen ? 'text-gray-900' : 'text-gray-400'}`}>{day}</span>
                    </div>
                    
                    {schedule[day].isOpen ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input 
                          type="time" 
                          value={schedule[day].open} 
                          onChange={(e) => handleScheduleChange(day, "open", e.target.value)} 
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-medium text-gray-900 outline-none focus:border-[#ED4A60] transition-colors" 
                        />
                        <span className="text-gray-400 font-medium">to</span>
                        <input 
                          type="time" 
                          value={schedule[day].close} 
                          onChange={(e) => handleScheduleChange(day, "close", e.target.value)} 
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-medium text-gray-900 outline-none focus:border-[#ED4A60] transition-colors" 
                        />
                      </div>
                    ) : (
                      <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-center text-sm text-gray-400 font-bold">
                        Closed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50">
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full sm:w-auto sm:min-w-[200px] float-right bg-[#ED4A60] text-white rounded-xl py-3.5 px-6 font-bold shadow-md shadow-rose-200 flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors disabled:opacity-70"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <div className="clear-both"></div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
