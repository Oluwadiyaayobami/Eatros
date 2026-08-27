"use client";
import React, { useState, useEffect } from "react";
import { toPng } from 'html-to-image';
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { fetchApi } from "@/utils/api";
import {
  PlusCircle, MinusCircle, Trash2, X, ArrowLeft, User, ChevronLeft,
  Home,
  DoorClosed,
  Building,
  Truck,
  Hand,
  Gift,
  Percent,
  Coins,
  DollarSign,
  HandCoins,
  ClipboardList,
  Receipt,
  Wallet,
  CreditCard,
  Download,
  Search,
  Store,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useParams, useSearchParams } from 'next/navigation';


const Meal = ({ restaurantName, restaurantImage, isClosed, collections = [] }) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurantId = params?.id || '1';

  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchApi(`/vendor/${restaurantId}/products`);
        setMeals(data.products || []);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    if (restaurantId) {
      getProducts();
    }
  }, [restaurantId]);

  useEffect(() => {
    if (meals.length > 0 && !activeCategory) {
      setActiveCategory("All");
    }
  }, [meals, activeCategory]);

  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eatroCart');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    // Auto-open checkout directly if requested (from Global Cart return)
    if (searchParams.get('openCart') === 'true') {
      setShowCheckout(true);
    }
  }, [searchParams]);

  useEffect(() => {
    // Save cart changes to localStorage
    localStorage.setItem('eatroCart', JSON.stringify(cart));
    if (cart.length > 0) {
      localStorage.setItem('eatroCartRestaurantId', restaurantId);
      localStorage.setItem('eatroCartRestaurantName', restaurantName || 'Restaurant');
    }
  }, [cart, restaurantId, restaurantName]);
  const [showCheckout, setShowCheckout] = useState(false)
  const [pickupOption, setPickupOption] = useState("self");
  const [selectedTip, setSelectedTip] = useState(0);
  const [deliveryDetails, setDeliveryDetails] = useState({ name: '', email: '', phone: '', room: '', hostel: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('eatroUser');
    const savedAddress = localStorage.getItem('eatroUserAddress');
    let initialEmail = '';
    
    if (savedUser) {
      try { 
        const userObj = JSON.parse(savedUser);
        initialEmail = userObj.email || '';
      } catch(e) {}
    }
    
    setDeliveryDetails({ name: '', email: initialEmail, phone: '', room: '', hostel: savedAddress || '', coordinates: [0, 0] });

    // Fetch full profile from backend to get Name and Phone
    const loadFullProfile = async () => {
      try {
        const data = await fetchApi('/auth/profile');
        if (data.user) {
          setDeliveryDetails(prev => ({
            ...prev,
            name: data.user.name || prev.name,
            phone: data.user.phoneNumber || prev.phone,
            email: data.user.email || prev.email
          }));
        }
      } catch (err) {
        console.error("Failed to load user profile for prefill", err);
      }
    };
    loadFullProfile();
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentReceived, setIsPaymentReceived] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentPickupCode, setCurrentPickupCode] = useState(null);

  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showConfirmCheckout, setShowConfirmCheckout] = useState(false);

  const executeCheckout = async () => {
    setIsProcessing(true);
    setShowConfirmCheckout(false);
    try {
      const payload = {
        vendorId: restaurantId,
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: finalTotal,
        deliveryFee: pickupOption === "agent" ? deliveryFee : 0,
        deliveryAddress: deliveryDetails.hostel ? `${deliveryDetails.name}, ${deliveryDetails.hostel}` : "Self Pickup",
        deliveryMethod: pickupOption,
        customerInfo: {
          name: deliveryDetails.name || "",
          email: deliveryDetails.email || "",
          phone: deliveryDetails.phone || ""
        },
        coordinates: deliveryDetails.coordinates || [0, 0]
      };
      
      const response = await fetchApi('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      setCurrentOrderId(response.order?._id ? response.order._id.slice(-6).toUpperCase() : `ERROR`);
      if (response.order?.pickupQrCode) setCurrentPickupCode(response.order.pickupQrCode);
      
      setCart([]);
      localStorage.removeItem('eatroCart');
      localStorage.removeItem('eatroCartRestaurantId');
      localStorage.removeItem('eatroCartRestaurantName');
      
      setIsProcessing(false);
      setShowCheckout(false);
      setIsPaymentReceived(true);
      
      setTimeout(() => {
        setIsPaymentReceived(false);
        setIsSuccess(true);
      }, 1500);
    } catch (err) {
      setIsProcessing(false);
      toast.error(err.message || 'Failed to place order. Please try again or log in.');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode to get human readable address
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const address = data.display_name || "Current Location";
          
          setDeliveryDetails(prev => ({
            ...prev,
            hostel: address,
            coordinates: [latitude, longitude]
          }));
          toast.success("Location retrieved successfully!");
        } catch (error) {
          setDeliveryDetails(prev => ({
            ...prev,
            hostel: "Current Location",
            coordinates: [latitude, longitude]
          }));
          toast.success("Coordinates retrieved successfully!");
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        toast.error("Failed to get location. Please ensure location permissions are granted.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById('receipt-content');
    if (!receiptElement) return;

    // Hide buttons temporarily so they aren't in the image
    const buttonsContainer = document.getElementById('receipt-buttons');
    if (buttonsContainer) {
      buttonsContainer.style.display = 'none';
    }

    try {
      const dataUrl = await toPng(receiptElement, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2 // High resolution
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Eatro_Receipt_${currentOrderId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating receipt image:", error);
    } finally {
      if (buttonsContainer) {
        buttonsContainer.style.display = 'block'; // Restore
      }
    }
  };
  const addToCart = (meal) => {
    if (isClosed) {
      toast.error("Restaurant is closed. Ordering is unavailable.", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item._id === meal._id);
      if (existing) {
        return prev.map((item) =>
          item._id === meal._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...meal, quantity: 1 }];
      }
    });
    toast.success("Added to Cart!", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
  };

  const removeFromCart = (mealId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === mealId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getQuantity = (mealId) => {
    const item = cart.find((i) => i._id === mealId);
    return item ? item.quantity : 0;
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);
  // Use Delivery Fee instead of Agent Tip
  const deliveryFee = pickupOption === "self" ? 0 : 800;
  const finalTotal = total + deliveryFee;

   const agents = [
    { id: 1, name: "Tunde", gender: "Male", online: true, image: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Sarah", gender: "Female", online: true, image: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Chidi", gender: "Male", online: false, image: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Blessing", gender: "Female", online: true, image: "https://i.pravatar.cc/150?u=4" },
  ];

  // Filter and Group Meals
  const filteredMeals = meals.filter(meal => 
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (meal.description && meal.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedMeals = filteredMeals.reduce((acc, meal) => {
    const category = meal.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(meal);
    return acc;
  }, {});

  const displayedGroups = activeCategory === "All" 
    ? groupedMeals 
    : (groupedMeals[activeCategory] ? { [activeCategory]: groupedMeals[activeCategory] } : {});

  return (
    <div className="bg-white pb-32">
      {isClosed && (
        <div className="bg-red-50 text-red-600 px-5 py-3 mb-4 text-[13px] font-semibold flex items-center gap-2">
          <DoorClosed className="w-4 h-4" />
          This restaurant is currently closed.
        </div>
      )}
      {/* List of meals */}
      <h2 className="px-4 text-[22px] font-extrabold text-black mb-4">{restaurantName || "Menu"}</h2>
      
      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Search menu..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f2f2f2] rounded-full py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#00A082] text-black font-semibold placeholder-gray-500 transition"
          />
        </div>
      </div>
      
      {/* Dynamic Category Tabs removed per user request */}
      
      {/* Collections Grid (Only shown when "All" is active) */}
      {activeCategory === "All" && !searchQuery && (
        <div className="px-4 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Collections</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(groupedMeals).map(categoryName => {
              const customCol = collections.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
              const image = customCol?.image || groupedMeals[categoryName][0]?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
              
              return (
                <div 
                  key={categoryName} 
                  onClick={() => {
                    setActiveCategory(categoryName);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-shadow group"
                >
                  <div className="h-32 w-full overflow-hidden bg-gray-50">
                    <img 
                      src={image} 
                      alt={categoryName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-[15px] text-gray-900 truncate text-center">{categoryName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Collections Grid (Only shown when "All" is active) */}
      
      {/* Grouped Menu List */}
      <div className="flex flex-col gap-8">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#00A082] rounded-full animate-spin"></div>
          </div>
        ) : Object.keys(displayedGroups).length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium">No menu items found.</div>
        ) : (
          Object.keys(displayedGroups).map((category) => {
            // Only show products if a specific category is selected, OR if they are searching
            if (activeCategory === "All" && !searchQuery) return null;
            
            return (
              <div key={category} id={`category-${category}`} className="px-4">
                {activeCategory !== "All" && !searchQuery && (
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setActiveCategory("All")}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                  </div>
                )}
                
                {searchQuery && (
                   <h3 className="text-lg font-bold text-gray-900 mb-4 bg-white py-2 z-10 border-b border-gray-100">{category}</h3>
                )}
                <div className="flex flex-col gap-6">
                {displayedGroups[category].map((meal) => {
                  const quantity = getQuantity(meal._id);
                  return (
                    <div key={meal._id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0">
                      {/* Image Left */}
                      <div className="relative w-[110px] h-[110px] flex-shrink-0">
                        <Image
                          src={meal.imageUrl || "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&q=80"}
                          alt={meal.name}
                          fill
                          className="object-cover rounded-[18px] bg-gray-50"
                        />
                      </div>
                      
                      {/* Details Right */}
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-black text-[15px]">{meal.name}</p>
                          <p className="text-[13px] text-gray-400 font-medium whitespace-nowrap">₦{meal.price.toLocaleString()}</p>
                        </div>
                        <p className="text-[13px] text-gray-500 mt-1 mb-auto line-clamp-2">{meal.description}</p>

                        {/* Plus button at bottom right */}
                        <div className="flex justify-end mt-3">
                          {quantity === 0 ? (
                            <button
                              onClick={() => addToCart(meal)}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition shadow-sm border border-gray-200 active:scale-95"
                            >
                              <PlusCircle className="w-5 h-5 stroke-[2.5] text-black" />
                            </button>
                          ) : (
                            <div className="flex items-center justify-between w-[90px] bg-black rounded-full px-2 py-1.5 shadow-sm">
                              <button onClick={() => removeFromCart(meal._id)} className="text-white">
                                <MinusCircle className="w-4 h-4" />
                              </button>
                              <span className="text-[13px] font-bold text-white">{quantity}</span>
                              <button onClick={() => addToCart(meal)} className="text-white">
                                <PlusCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Fees Information */}
      <div className="flex items-center justify-center gap-1.5 mt-8 mb-4 cursor-pointer hover:opacity-80 transition">
        <span className="text-sm text-gray-500 font-medium">Fees information</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      </div>


      {showCheckout && (
        <div className="fixed inset-0 bg-white flex flex-col overflow-y-auto z-[100]">
          {/* Header */}
          <div className="flex flex-col p-5 border-b">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="flex items-center text-gray-800 gap-5 cursor-pointer"
                  onClick={() => {
                    setShowCheckout(false);
                  }}
                >
                  <ArrowLeft />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Checkout
                  </h2>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {totalProducts} product{totalProducts !== 1 && "s"} from{" "}
                  <span className="font-semibold underline">{restaurantName}</span>
                </p>
              </div>

              <button onClick={() => setShowCheckout(false)}>
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Ordering From Section */}
          <div className="p-5 border-b bg-[#FFFDF4]">
            <h2 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
              <Store className="w-5 h-5 text-yellow-600" /> Ordering From
            </h2>
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-yellow-100 shadow-sm">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-gray-100">
                <img src={restaurantImage || 'https://via.placeholder.com/150'} alt={restaurantName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-[15px]">{restaurantName}</h3>
                <p className="text-xs text-gray-500 font-medium">Verified Eatro Restaurant</p>
              </div>
            </div>
          </div>

          {/* Delivery Details Section */}
          <div className="p-5 space-y-5">
            <h2 className="font-medium text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-green-700" /> Your Details
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 focus-within:border-green-500 transition-colors">
                <User className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={deliveryDetails.name}
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-gray-500 font-medium cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 focus-within:border-green-500 transition-colors">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={deliveryDetails.email}
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-gray-500 font-medium cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 focus-within:border-green-500 transition-colors">
                <Phone className="w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={deliveryDetails.phone}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, phone: e.target.value})}
                  className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium"
                />
              </div>

              <div className="pt-2">
                <h2 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-green-700" /> Delivery Address
                </h2>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 focus-within:border-green-500 transition-colors">
                  <Building className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Delivery Location (e.g., Hostel / Hall)"
                    value={deliveryDetails.hostel}
                    onChange={(e) => setDeliveryDetails({...deliveryDetails, hostel: e.target.value})}
                    className="w-full bg-transparent outline-none text-sm text-gray-700 font-medium"
                  />
                  <button 
                    onClick={handleGetLocation} 
                    disabled={isGettingLocation}
                    className="shrink-0 ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-md text-xs font-bold transition disabled:opacity-50 flex items-center gap-1"
                    title="Use Current Location"
                  >
                    {isGettingLocation ? (
                      <span className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                    Locate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Option */}
          {/* Pickup Option */}
          <div className="px-5 space-y-3 mb-6">
            <h2 className="font-medium text-gray-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-green-700" /> Pickup Option
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="pickup"
                  value="self"
                  checked={pickupOption === "self"}
                  onChange={() => setPickupOption("self")}
                  className="accent-green-700 w-4 h-4"
                />
                <Hand className="w-4 h-4 text-green-700" />
                Self Pick-up
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="pickup"
                  value="agent"
                  checked={pickupOption === "agent"}
                  onChange={() => setPickupOption("agent")}
                  className="accent-green-700 w-4 h-4"
                />
                <Truck className="w-4 h-4 text-green-700" />
                Agent Pick-up
              </label>
            </div>
          </div>

          {/* Promo Code */}
          <div className="px-5 mb-6">
            <h2 className="font-medium text-gray-800 flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-700" /> Promo Code (Optional)
            </h2>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 mt-2">
              <Percent className="w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Enter promo code"
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="px-5 mt-[10%] pb-24 space-y-2">
            <h2 className="font-medium text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-green-700" /> Order Summary
            </h2>

            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            {pickupOption === "agent" && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-gray-900 mt-2 border-t pt-2 border-gray-100">
              <span>Total</span>
              <span>₦{finalTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Pay Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex items-center justify-between w-full z-[100] pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <button
  className="bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition w-full flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md active:scale-95"
  disabled={isProcessing}
  onClick={async () => {
    if (!deliveryDetails.phone || deliveryDetails.phone.trim() === "") {
      toast.error("Phone number is required. Please enter a valid phone number.");
      return;
    }

    if (pickupOption === "agent") {
      if (!deliveryDetails.hostel || deliveryDetails.hostel.trim() === "") {
        toast.error("Please provide a delivery address.");
        return;
      }
      if (!deliveryDetails.hostel.toLowerCase().includes("akure")) {
        toast.error("Out of delivery area. We currently only deliver within Akure.");
        return;
      }
    }

    const methodStr = pickupOption === "self" ? "Self Pick-up" : "Agent Delivery";
    setShowConfirmCheckout(true);
  }}
>
  {isProcessing ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Processing...
    </>
  ) : (
    <>
      <CreditCard className="w-5 h-5" /> 
      Confirm Payment
    </>
  )}
</button>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmCheckout && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {pickupOption === "self" ? <Hand className="w-8 h-8" /> : <Truck className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delivery</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                You have selected <span className="font-bold text-gray-900">{pickupOption === "self" ? "Self Pick-up" : "Agent Pick-up"}</span>. 
                Are you absolutely sure? You cannot change this after payment is complete.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmCheckout(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeCheckout}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 active:scale-95 transition-all shadow-md"
                >
                  Yes, Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interstitial Payment Received Screen */}
      {isPaymentReceived && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/30">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" strokeWidth="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Received!</h2>
          <p className="text-gray-500 font-medium animate-pulse">Generating your receipt...</p>
        </div>
      )}

      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-[#FDFCF9] flex flex-col items-center overflow-y-auto px-6 py-10 animate-in slide-in-from-bottom-full duration-500">
          
          <div id="receipt-content" className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-6 border border-gray-100 relative mt-8">
            {/* Absolute positioning to pop out the checkmark from the top of the receipt */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" strokeWidth="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
            </div>

            <div className="text-center mt-10 mb-8">
              <h2 className="text-sm font-bold text-green-600 mb-2 uppercase tracking-widest">EATRO</h2>
              <h1 className="text-2xl font-black text-gray-900 mb-1">Payment Successful!</h1>
              <p className="text-gray-500 text-sm font-medium">Order <span className="font-mono text-black">#{currentOrderId}</span></p>
            </div>

            <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-2xl">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <img src={restaurantImage} alt={restaurantName} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ordered From</p>
                <p className="font-bold text-gray-900">{restaurantName}</p>
              </div>
            </div>

            {/* Dashed divider */}
            <div className="border-t-2 border-dashed border-gray-200 my-6"></div>

            {/* Self Pick-up Code */}
            {pickupOption === 'self' && currentPickupCode && (
              <div className="mb-6 bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Pick-up Code</p>
                <div className="text-3xl font-black text-gray-900 tracking-[0.2em]">{currentPickupCode}</div>
                <p className="text-[11px] font-medium text-gray-500 mt-2">Do not share this code with anyone but the restaurant.</p>
              </div>
            )}

            <h3 className="font-bold text-gray-900 mb-4 text-sm">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-start text-sm">
                  <div className="flex gap-2 text-gray-700">
                    <span className="font-bold text-gray-900">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Dashed divider */}
            <div className="border-t-2 border-dashed border-gray-200 my-6"></div>

            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 font-medium">₦{total.toLocaleString()}</span>
              </div>
              {pickupOption === "agent" && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900 font-medium">₦{deliveryFee.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center bg-green-50 p-4 rounded-2xl mb-8">
              <span className="font-bold text-green-800">Total Paid</span>
              <span className="text-xl font-black text-green-800">₦{finalTotal.toLocaleString()}</span>
            </div>

            <div id="receipt-buttons" className="space-y-3">
              <button 
                onClick={handleDownloadReceipt}
                className="w-full bg-green-50 text-green-700 py-4 rounded-xl font-bold shadow-sm hover:bg-green-100 transition flex justify-center items-center gap-2 active:scale-95 border border-green-200"
              >
                <Download size={18} /> Download Receipt
              </button>
              {pickupOption === "agent" ? (
                <Link href={`/user/orders/track?id=${currentOrderId}`}>
                  <button className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-md hover:bg-gray-900 transition flex justify-center items-center gap-2 active:scale-95">
                    <Truck size={18} /> Track Delivery
                  </button>
                </Link>
              ) : (
                <Link href={`/user/orders`}>
                  <button className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-md hover:bg-gray-900 transition flex justify-center items-center gap-2 active:scale-95">
                    <ClipboardList size={18} /> View Order Status
                  </button>
                </Link>
              )}
              <button 
                className="w-full bg-transparent text-gray-500 py-3 font-medium hover:bg-gray-50 rounded-xl transition"
                onClick={() => {
                  setIsSuccess(false);
                  setShowCheckout(false);
                  setCart([]);
                  localStorage.removeItem('eatroCart');
                  localStorage.removeItem('eatroCartRestaurantId');
                  localStorage.removeItem('eatroCartRestaurantName');
                }}
              >
                Return to Home
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Meal;
