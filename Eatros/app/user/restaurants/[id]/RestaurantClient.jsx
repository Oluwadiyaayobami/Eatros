"use client"
import React, { useState, useEffect } from 'react';
import AppLayout from '../../layout/AppLayout';
import { 
  ChevronLeft, Search, Heart, MoreVertical, 
  ChevronRight, Bike, PersonStanding, 
  ThumbsUp, Lock, Unlock, Star, X
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Meal from '../components/Meal';
import { fetchApi } from '@/utils/api';
import toast from 'react-hot-toast';

const RestaurantClient = () => {
  const router = useRouter();
  const params = useParams();
  
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fulfillment, setFulfillment] = useState('Delivery');

  // Interaction States
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchApi(`/vendor/${params.id}/profile`);
        const v = data.vendor;
        
        // Fetch collections for this vendor
        const colData = await fetchApi(`/vendor/${params.id}/collections`);
        if (!v.vendorDetails) v.vendorDetails = {};
        v.vendorDetails.collections = colData.collections || [];
        
        setVendor(v);

        // Initialize interaction stats
        const vd = v.vendorDetails || {};
        setLikeCount(vd.likes?.length || 0);
        setAverageRating(vd.rating || 0);
        setRatingCount(vd.ratingCount || 0);

        const token = localStorage.getItem('eatroAccessToken');
        if (token) {
          try {
            const interaction = await fetchApi(`/vendor/${params.id}/interaction`);
            setIsLiked(interaction.isLiked);
            setUserRating(interaction.userRating);
          } catch (e) {
            console.error("Failed to fetch interaction", e);
          }
        }
      } catch (err) {
        toast.error("Failed to load restaurant details");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) {
      fetchProfile();
    }
  }, [params.id]);

  const handleToggleLike = async () => {
    const token = localStorage.getItem('eatroAccessToken');
    if (!token) {
      toast.error("Please log in to like this restaurant");
      return;
    }
    
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
    
    try {
      await fetchApi(`/vendor/${params.id}/like`, { method: 'POST' });
    } catch (err) {
      setIsLiked(!newIsLiked);
      setLikeCount(prev => !newIsLiked ? prev + 1 : prev - 1);
      toast.error("Failed to update like status");
    }
  };

  const handleSubmitRating = async (ratingValue) => {
    const token = localStorage.getItem('eatroAccessToken');
    if (!token) {
      toast.error("Please log in to rate");
      return;
    }
    
    try {
      const data = await fetchApi(`/vendor/${params.id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating: ratingValue })
      });
      setUserRating(ratingValue);
      setAverageRating(data.averageRating);
      setRatingCount(data.ratingCount);
      toast.success("Rating submitted!");
      setShowRatingModal(false);
    } catch (err) {
      toast.error("Failed to submit rating");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#00A082] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="bg-white min-h-screen flex flex-col justify-center items-center px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Restaurant Not Found</h2>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-black font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  const checkIfClosed = (vendorObj) => {
    if (vendorObj.vendorDetails?.businessStatus === "CLOSED") return true;

    const schedule = vendorObj.vendorDetails?.weeklySchedule;
    if (!schedule) return false;

    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];
    const todaySchedule = schedule[currentDay];

    if (!todaySchedule) return false;
    if (!todaySchedule.isOpen) return true;

    const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    if (currentTimeStr < todaySchedule.open || currentTimeStr > todaySchedule.close) {
      return true;
    }

    return false;
  };

  const vd = vendor.vendorDetails || {};
  const isClosed = checkIfClosed(vendor);
  const restaurantName = vd.restaurantName || "Restaurant";
  const coverImage = vd.coverImage || "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80";
  const profileImage = vd.profileImage || "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80";

  return (
    <div className="bg-white min-h-screen pb-20">
      <AppLayout>
        
        {/* Top Banner Image with Buttons */}
        <div className="relative h-[220px] w-full">
          <img 
            src={coverImage} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-12 left-4">
            <button 
              onClick={() => router.back()}
              className="bg-white text-black p-2.5 rounded-full shadow-md hover:bg-gray-50 transition"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          </div>
          <div className="absolute top-12 right-4 flex gap-3">
            <button className="bg-white text-black p-2.5 rounded-full shadow-md hover:bg-gray-50 transition">
              <Search size={20} strokeWidth={2.5} />
            </button>
            <button onClick={handleToggleLike} className="bg-white text-black p-2.5 rounded-full shadow-md hover:bg-gray-50 transition relative">
              <Heart size={20} strokeWidth={2.5} className={isLiked ? "fill-red-500 text-red-500" : ""} />
              {likeCount > 0 && (
                <span className="absolute -bottom-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-100 shadow-sm left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {likeCount}
                </span>
              )}
            </button>
            <button className="bg-white text-black p-2.5 rounded-full shadow-md hover:bg-gray-50 transition">
              <MoreVertical size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative px-5 pt-14 pb-4 bg-white">
          
          {/* Floating Logo */}
          <div className="absolute -top-12 left-5 w-[90px] h-[90px] rounded-full border-4 border-white shadow-sm overflow-hidden bg-white z-20">
            <img 
              src={profileImage} 
              alt={`${restaurantName} logo`} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Vendor Name */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{restaurantName}</h1>
            <button className="bg-gray-100 p-1.5 rounded-full text-gray-500 hover:bg-gray-200 transition">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Fulfillment Toggle */}
          <div className="flex gap-3 mb-8">
            <button 
              onClick={() => setFulfillment('Delivery')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition ${
                fulfillment === 'Delivery' 
                  ? 'border-black text-black shadow-sm' 
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Bike size={18} strokeWidth={2.5} />
              Delivery
            </button>
            <button 
              onClick={() => setFulfillment('Pickup')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition ${
                fulfillment === 'Pickup' 
                  ? 'border-black text-black shadow-sm' 
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <PersonStanding size={18} strokeWidth={2.5} />
              Pickup
            </button>
          </div>

          {/* Ratings and Status */}
          <div className="flex justify-around mb-6 text-center">
            <div 
              onClick={() => setShowRatingModal(true)}
              className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition"
            >
              <Star size={24} className="text-yellow-400 fill-yellow-400" strokeWidth={2} />
              <span className="text-xs text-gray-800 font-bold">{averageRating} <span className="text-gray-500 font-medium">({ratingCount})</span></span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              {isClosed ? (
                <>
                  <Lock size={24} className="text-gray-800" strokeWidth={2} />
                  <span className="text-xs text-gray-800 font-semibold text-center">Not available</span>
                </>
              ) : (
                <>
                  <Unlock size={24} className="text-[#00A082]" strokeWidth={2} />
                  <span className="text-xs text-[#00A082] font-semibold">Open</span>
                </>
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="text-[13px] font-medium mb-2">
            {isClosed ? (
              <>
                <span className="bg-[#937537] text-white px-2 py-0.5 rounded mr-2">Not available</span>
                <span className="text-[#937537]">Please check back later</span>
              </>
            ) : (
              <>
                <span className="bg-[#00A082] text-white px-2 py-0.5 rounded mr-2">Open</span>
                <span className="text-[#00A082]">Accepting orders</span>
              </>
            )}
            </div>
          </div>

        {/* Menu Section */}
        <div className="px-0 relative -mt-2">
          <div className="bg-white rounded-t-3xl pt-2">
            <Meal 
              restaurantName={restaurantName} 
              restaurantImage={profileImage}
              isClosed={isClosed}
              collections={vd.collections || []}
            />
          </div>
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setShowRatingModal(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              >
                <X size={18} className="text-gray-700" />
              </button>

              <div className="text-center mt-2 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate {restaurantName}</h3>
                <p className="text-sm text-gray-500">Tap a star to give your feedback</p>
              </div>

              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleSubmitRating(star)}
                    className="transition-transform hover:scale-110 active:scale-90 p-1"
                  >
                    <Star 
                      size={40} 
                      className={`transition-colors duration-200 ${
                        star <= (hoverRating || userRating || 0) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "fill-gray-100 text-gray-200 hover:fill-yellow-100"
                      }`} 
                    />
                  </button>
                ))}
              </div>

              {userRating && (
                <div className="text-center py-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700">You rated {userRating} stars</p>
                </div>
              )}
            </div>
          </div>
        )}
      </AppLayout>
    </div>
  );
};

export default RestaurantClient;
