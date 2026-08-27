"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Search, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const LocationPage = () => {
  const router = useRouter();
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [address, setAddress] = useState("");

  const handleShareLocation = () => {
    toast.loading("Finding your location...", { id: "loc" });
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser", { id: "loc" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using BigDataCloud's free client-side reverse geocoding API (more reliable, no strict User-Agent blocks)
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();

          // Build a readable address: e.g., "City, Country" or "Locality, City"
          const addressParts = [data.locality || data.city, data.countryName].filter(Boolean);
          const address = addressParts.length > 0 ? addressParts.join(", ") : "Current Location";

          toast.dismiss(); // dismiss loading toast
          toast.success("Location found!", { id: "loc" });
          router.push(`/auth/map?address=${encodeURIComponent(address.trim())}`);
        } catch (err) {
          console.error("Geocoding error:", err);
          toast.dismiss();
          toast.error("Could not determine address name. Using coordinates.", { id: "loc" });
          router.push(`/auth/map?address=${latitude.toFixed(4)},${longitude.toFixed(4)}`);
        }
      },
      (error) => {
        toast.dismiss();
        toast.error("Failed to get location. Please check browser permissions.", { id: "loc" });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSearchAddress = (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    router.push(`/auth/map?address=${encodeURIComponent(address)}`);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#FFC244]">

      {/* Background Image Area */}
      <div className="absolute inset-0 z-0 bg-[#FFC244]">
        <img
          src="/img/location-bg.png"
          alt="Delivery map background"
          className="w-full h-[65vh] md:h-[70vh] object-cover object-top"
        />
      </div>

      {/* Spacer to push the card to the bottom */}
      <div className="flex-1 z-10"></div>

      {/* Bottom White Card Form */}
      <div className="bg-white rounded-t-[2.5rem] px-6 pt-10 pb-8 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] z-20 w-full flex flex-col items-center relative mt-auto transition-all duration-300 ease-in-out">

        {/* Floating icon to break the card edge */}
        <div className="absolute -top-8 bg-[#00A082] p-4 rounded-full shadow-lg border-4 border-white">
          <MapPin size={32} className="text-white" />
        </div>

        {isManualEntry ? (
          <div className="w-full max-w-[360px] animate-in fade-in slide-in-from-right-4 duration-300">
            <button
              onClick={() => setIsManualEntry(false)}
              className="flex items-center text-gray-500 hover:text-black mb-6 transition"
            >
              <ArrowLeft size={20} className="mr-2" /> Back
            </button>
            <h2 className="text-2xl font-extrabold text-black mb-6">Enter your address</h2>

            <form onSubmit={handleSearchAddress} className="w-full flex flex-col gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Street name, building, or area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoFocus
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-[#00A082] focus:ring-2 focus:ring-[#00A082]/20 font-medium text-black transition placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={!address.trim()}
                className="w-full bg-black text-white rounded-full py-4 font-bold text-[15px] hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md"
              >
                Search Address
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-left-4 duration-300">
            <h2 className="text-2xl font-extrabold text-black mt-4 mb-2 text-center">What's your exact location?</h2>
            <p className="text-gray-500 text-sm mb-8 text-center max-w-[320px] leading-relaxed">
              We need your location to show you the best restaurants, stores, and delivery options near you.
            </p>

            {/* Action Buttons */}
            <div className="w-full max-w-[360px] flex flex-col gap-4 mb-6">
              <button
                onClick={handleShareLocation}
                className="w-full flex items-center justify-center gap-2 bg-[#00A082] text-white rounded-full py-4 font-bold text-[15px] hover:bg-[#008d73] active:bg-[#007a63] transition shadow-md shadow-[#00a082]/20 focus:ring-2 focus:ring-[#00A082]/50"
              >
                <Navigation size={18} fill="currentColor" /> Share my current location
              </button>

              <button
                onClick={() => setIsManualEntry(true)}
                className="w-full bg-gray-100 text-black rounded-full py-4 font-bold text-[15px] hover:bg-gray-200 active:bg-gray-300 transition"
              >
                Enter address manually
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LocationPage;
