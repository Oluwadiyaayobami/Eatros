"use client"

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, ArrowLeft, Crosshair, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

const DraggableMap = dynamic(() => import("./components/DraggableMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse" />
});

// We wrap the content that uses useSearchParams in a Suspense boundary per Next.js requirements
const MapContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressQuery = searchParams.get("address") || "Current Location";
  
  // Clean up the address if it was a URL parameter
  const initialAddress = addressQuery.replace(/\+/g, " ");
  
  const [address, setAddress] = useState(initialAddress);
  const [isDragging, setIsDragging] = useState(false);
  const [isOutOfArea, setIsOutOfArea] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  
  // Track if address was changed by dragging the map (to prevent infinite loop)
  const isAddressFromMapRef = useRef(false);

  // Forward geocode when typing an address manually
  useEffect(() => {
    if (!address || address === "Current Location") return;
    
    // Skip if this change was triggered by dragging the map itself
    if (isAddressFromMapRef.current) {
      isAddressFromMapRef.current = false; // Reset it for the next user typing
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setMapCenter([lat, lon]);
          
          // Geofencing Check for searched text
          const displayName = data[0].display_name.toLowerCase();
          const isAkure = displayName.includes("akure");
          const isOndo = displayName.includes("ondo");
          setIsOutOfArea(!(isAkure && isOndo));
        }
      } catch (err) {
        console.error("Forward geocoding failed", err);
      }
    }, 1000); // Wait 1 second after they stop typing

    return () => clearTimeout(timer);
  }, [address]);
  
  const handleConfirmLocation = () => {
    // Save address to global state/context via localStorage
    localStorage.setItem("eatroUserAddress", address);
    router.push(`/user/home_dashboard?address=${encodeURIComponent(address)}`);
  };
  
  const handleMapMove = async (center) => {
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${center.lat}&longitude=${center.lng}&localityLanguage=en`);
      const data = await res.json();
      
      const city = data.locality || data.city || "";
      const state = data.principalSubdivision || "";
      
      const addressParts = [city, state, data.countryName].filter(Boolean);
      if (addressParts.length > 0) {
        isAddressFromMapRef.current = true; // Signal the useEffect to ignore this change
        setAddress(addressParts.join(", "));
      }

      // Geofencing: Restrict delivery to Akure, Ondo State
      const isAkure = city.toLowerCase().includes("akure");
      const isOndo = state.toLowerCase().includes("ondo");
      
      if (!isAkure || !isOndo) {
        setIsOutOfArea(true);
      } else {
        setIsOutOfArea(false);
      }
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-100">
      
      {/* Map Background Layer */}
      <div className="absolute inset-0 z-0">
        <DraggableMap 
          onMapMove={handleMapMove} 
          setIsDragging={setIsDragging} 
          forceCenter={mapCenter}
        />
        
        {/* The interactive overlay effect while "dragging" the map */}
        {isDragging && <div className="absolute inset-0 bg-black/5 transition-opacity pointer-events-none" />}
      </div>

      {/* Top Header Layer */}
      <div className="z-10 p-4 pt-10 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition text-[#00A082]">
          <Crosshair size={24} />
        </button>
      </div>

      {/* Center Fixed Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] z-20 pointer-events-none drop-shadow-xl animate-in zoom-in duration-300">
        <div className={`transition-transform duration-200 ${isDragging ? '-translate-y-4 scale-110' : 'translate-y-0 scale-100'}`}>
          <MapPin size={56} className="text-[#00A082] fill-white" strokeWidth={1.5} />
        </div>
        {/* Pin Shadow */}
        <div className="w-4 h-1.5 bg-black/30 rounded-[100%] mx-auto mt-1 blur-[2px] transition-transform duration-200" style={{ transform: isDragging ? 'scale(0.5)' : 'scale(1)' }} />
      </div>

      <div className="flex-1"></div>

      {/* Bottom Confirmation Card */}
      <div className="bg-white rounded-t-[2.5rem] p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] z-20 w-full animate-in slide-in-from-bottom-full duration-500">
        
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <h2 className="text-xl font-bold text-black mb-1">Confirm delivery address</h2>
        <p className="text-gray-500 text-[13px] mb-4 leading-relaxed">Drag the map to move the pin. If the location is wrong, you can manually type in the correct location below.</p>
        
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
          <MapPin size={24} className="text-[#00A082] flex-shrink-0" />
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-transparent border-none outline-none text-black font-semibold w-full text-base"
          />
        </div>

        {isOutOfArea && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-[13px] font-semibold mb-6 border border-red-100 flex items-start gap-2 animate-in fade-in">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p>Sorry, delivery is currently only available within Akure, Ondo State, Nigeria.</p>
          </div>
        )}

        <button 
          onClick={handleConfirmLocation}
          disabled={isOutOfArea}
          className="w-full bg-[#00A082] text-white rounded-full py-4 font-bold text-[15px] hover:bg-[#008d73] active:bg-[#007a63] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition shadow-md shadow-[#00a082]/20"
        >
          Confirm Location
        </button>
      </div>

    </div>
  );
};

export default function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading map...</div>}>
      <MapContent />
    </Suspense>
  );
}
