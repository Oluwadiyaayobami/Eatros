import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { fetchApi } from "@/utils/api";
import toast from "react-hot-toast";

const RestaurantCard = ({ category = "food" }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await fetchApi(`/vendor/list?type=${category}`);
        setRestaurants(data.vendors || []);
      } catch (error) {
        toast.error("Failed to load vendors");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, [category]);

  if (isLoading) {
    return (
      <div className="px-4 pb-20 flex justify-center py-10">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#00A082] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="px-4 pb-20 text-center py-10 text-gray-500 font-medium">
        No vendors available for this category at the moment.
      </div>
    );
  }

  const checkIfClosed = (vendor) => {
    if (vendor.vendorDetails?.businessStatus === "CLOSED") return true;

    const schedule = vendor.vendorDetails?.weeklySchedule;
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

  return (
    <div className="px-4 pb-20">
      <div className="flex flex-col gap-8">
        {restaurants.map((r) => {
          const isClosed = checkIfClosed(r);
          return (
          <Link key={r._id} href={`/user/restaurants/${r._id}`} className="block group cursor-pointer">
            <div className="relative w-full h-[220px] rounded-[1.5rem] overflow-hidden mb-3 shadow-sm">
              {/* Image */}
              <img
                src={r.vendorDetails?.coverImage || "https://images.unsplash.com/photo-1562059390-a761a084768e?w=800&q=80"}
                alt={r.vendorDetails?.restaurantName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              
              {/* Top Left Badge */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-gray-200 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                Same prices as in store
              </div>

              {/* Status Overlay (if closed) */}
              {isClosed && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-[1px] p-4 text-center">
                  <span className="font-extrabold text-xl">Not available</span>
                  <span className="text-sm font-medium mt-1">Please check back later</span>
                </div>
              )}
            </div>

            {/* Restaurant Info Footer */}
            <div className="flex justify-between items-center px-1">
              <h2 className="text-[19px] font-bold text-black">{r.vendorDetails?.restaurantName}</h2>
              <Heart size={24} strokeWidth={1.5} className="text-black" />
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantCard;
