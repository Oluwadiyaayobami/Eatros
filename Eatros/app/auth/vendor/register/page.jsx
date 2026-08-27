"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Info, Menu, ChevronDown, Check, X, Store, CreditCard, TrendingUp, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "@/utils/api";
import { useRouter } from "next/navigation";

const VendorRegistration = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Sell");
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    establishmentName: "",
    firstName: "",
    lastName: "",
    businessType: "",
    customBusinessType: "",
    branches: "1",
    email: "",
    password: "",
    phone: "+234",
    samePhoneAsStore: true,
    hasRegistration: null,
    wantsUpdates: true,
    acceptsPrivacy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptsPrivacy) {
      toast.error("Please accept the Privacy Policy.");
      return;
    }
    if (formData.hasRegistration === null) {
      toast.error("Please indicate if you have business registration.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: 'vendor',
        phoneNumber: formData.phone,
        vendorDetails: {
          restaurantName: formData.establishmentName,
          description: formData.businessType === 'Other' ? formData.customBusinessType : formData.businessType
        }
      };

      await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      toast.success("Registration successful! Please log in.");
      router.push("/auth/login");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabContent = {
    Sell: {
      title: "Sell to new customers and neighbourhoods",
      description: "Increase your orders by reaching more customers thanks to an online marketplace and network of couriers available through our technology.",
      points: ["Delivery with Eatro", "In-store pick-up"]
    },
    Manage: {
      title: "Manage your business effortlessly",
      description: "Take control of your menu, track orders in real-time, and get valuable insights to optimize your daily operations.",
      points: ["Real-time Order Tracking", "Menu Management"]
    },
    Grow: {
      title: "Grow your revenue and visibility",
      description: "Access marketing tools, promotions, and data analytics to scale your business and reach thousands of new customers.",
      points: ["Promotions & Discounts", "Data Analytics & Insights"]
    }
  };

  return (
    <div className="min-h-screen bg-vendor-pattern font-sans overflow-x-hidden relative">
      {/* Background shapes mimicking the screenshot */}
      <div className="absolute top-[500px] left-[-50px] w-64 h-96 bg-[#F8C12C] rounded-full blur-3xl opacity-30 z-0"></div>
      
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-1 text-xl font-bold">
          <span className="text-[#F8C12C]">Eatro</span>
          <span className="text-[#F8C12C]">Local</span>
        </div>
        <button onClick={() => setIsMenuOpen(true)}>
          <Menu className="text-gray-800" size={28} />
        </button>
      </header>

      {/* Slide-out Menu */}
      <div className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-64 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <span className="font-bold text-lg text-[#1D1D1D]">Menu</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-800" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <Link href="/auth/login" className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition">
            <Store size={20} className="text-[#F8C12C]" />
            <span className="font-semibold">Partner Login</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition">
            <CreditCard size={20} className="text-[#F8C12C]" />
            <span className="font-semibold">Pricing & Fees</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition">
            <TrendingUp size={20} className="text-[#F8C12C]" />
            <span className="font-semibold">Success Stories</span>
          </Link>
        </div>
        <div className="p-5 border-t border-gray-100">
          <button onClick={() => setIsMenuOpen(false)} className="w-full bg-[#F8C12C] text-white py-3 rounded-full font-bold shadow-md hover:bg-[#e6b124] transition">
            Register Now
          </button>
        </div>
      </div>

      <main className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-16">
        <h1 className="text-4xl font-extrabold text-[#1D1D1D] leading-tight mb-8">
          Build your business online with Eatro
        </h1>

        {/* Registration Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50">
          <h2 className="text-3xl font-extrabold text-[#1D1D1D] mb-2 leading-tight">
            Start selling through Eatro
          </h2>
          <p className="text-gray-800 font-medium text-[15px] mb-8">
            Registering on Eatro has never been easier. Become a partner now.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name of establishment */}
            <div className="relative">
              <input
                type="text"
                name="establishmentName"
                value={formData.establishmentName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#F8C12C] focus:ring-1 focus:ring-[#F8C12C] transition peer placeholder-transparent"
                placeholder="Name of the establishment *"
                required
              />
              <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#F8C12C] peer-valid:-top-2 peer-valid:left-3 peer-valid:text-xs peer-valid:bg-white peer-valid:px-1">
                Name of the establishment <span className="text-red-500">*</span>
              </label>
              <Info className="absolute right-4 top-4 text-[#F8C12C]" size={20} />
            </div>

            {/* First Name & Last Name */}
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#F8C12C] focus:ring-1 focus:ring-[#F8C12C] transition peer placeholder-transparent"
                placeholder="First Name *"
                required
              />
              <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#F8C12C] peer-valid:-top-2 peer-valid:left-3 peer-valid:text-xs peer-valid:bg-white peer-valid:px-1">
                First Name <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#F8C12C] focus:ring-1 focus:ring-[#F8C12C] transition peer placeholder-transparent"
                placeholder="Last Name *"
                required
              />
              <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#F8C12C] peer-valid:-top-2 peer-valid:left-3 peer-valid:text-xs peer-valid:bg-white peer-valid:px-1">
                Last Name <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Business Type */}
            <div className="relative">
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 bg-white appearance-none focus:outline-none focus:border-[#F8C12C] focus:ring-1 focus:ring-[#F8C12C] transition peer"
                required
              >
                <option value="" disabled hidden></option>
                <option value="Restaurant">Restaurant</option>
                <option value="Grocery">Grocery</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Convenience Store">Convenience Store</option>
                <option value="Florist">Florist</option>
                <option value="Liquor Store">Liquor Store</option>
                <option value="Bakery">Bakery</option>
                <option value="Cafe / Coffee Shop">Cafe / Coffee Shop</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing & Apparel">Clothing & Apparel</option>
                <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Other">Other</option>
              </select>
              <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#F8C12C] peer-valid:-top-2 peer-valid:left-3 peer-valid:text-xs peer-valid:bg-white peer-valid:px-1 pointer-events-none">
                Business Type <span className="text-red-500">*</span>
              </label>
              <ChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" size={20} />
            </div>

            {/* Custom Business Type */}
            {formData.businessType === "Other" && (
              <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  type="text"
                  name="customBusinessType"
                  value={formData.customBusinessType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#F8C12C] focus:ring-1 focus:ring-[#F8C12C] transition peer placeholder-transparent"
                  placeholder="Please specify *"
                  required
                />
                <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#F8C12C] peer-valid:-top-2 peer-valid:left-3 peer-valid:text-xs peer-valid:bg-white peer-valid:px-1">
                  Please specify <span className="text-red-500">*</span>
                </label>
              </div>
            )}

            {/* Branches */}
            <div className="relative">
              <input
                type="number"
                name="branches"
                value={formData.branches}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#F8C12C] focus:ring-1 focus:ring-[#F8C12C] transition peer placeholder-transparent"
                placeholder="Branches *"
                min="1"
                required
              />
              <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#F8C12C] peer-valid:-top-2 peer-valid:left-3 peer-valid:text-xs peer-valid:bg-white peer-valid:px-1">
                Branches <span className="text-red-500">*</span>
              </label>
              <Info className="absolute right-4 top-4 text-[#F8C12C]" size={20} />
            </div>

            {/* Business Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#F8C12C] focus:ring-1 focus:ring-[#F8C12C] transition peer placeholder-transparent"
                placeholder="Business email *"
                required
              />
              <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#F8C12C] peer-valid:-top-2 peer-valid:left-3 peer-valid:text-xs peer-valid:bg-white peer-valid:px-1">
                Business email <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 pr-12 text-gray-800 focus:outline-none focus:border-[#F8C12C] focus:ring-1 focus:ring-[#F8C12C] transition peer placeholder-transparent"
                placeholder="Password *"
                required
              />
              <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#F8C12C] peer-valid:-top-2 peer-valid:left-3 peer-valid:text-xs peer-valid:bg-white peer-valid:px-1">
                Password <span className="text-red-500">*</span>
              </label>
              <button 
                type="button"
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Mobile Phone */}
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#F8C12C] focus:ring-1 focus:ring-[#F8C12C] transition peer placeholder-transparent"
                placeholder="Mobile phone number *"
                required
              />
              <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#F8C12C] peer-valid:-top-2 peer-valid:left-3 peer-valid:text-xs peer-valid:bg-white peer-valid:px-1">
                Mobile phone number <span className="text-red-500">*</span>
              </label>
            </div>

            {/* OTP Info Box */}
            <div className="bg-[#EEF2F6] rounded-xl p-4 flex gap-3 items-start mt-2">
              <Info className="text-gray-800 shrink-0 mt-0.5" size={20} />
              <p className="text-[#333333] text-sm leading-relaxed">
                We'll send an OTP to this number for verification. This number will also be used for all important communication.
              </p>
            </div>

            {/* Checkboxes & Radios */}
            <div className="space-y-5 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center transition-colors ${formData.samePhoneAsStore ? 'bg-[#F8C12C]' : 'border border-gray-300'}`}>
                  {formData.samePhoneAsStore && <Check className="text-white" size={16} />}
                </div>
                <input type="checkbox" name="samePhoneAsStore" checked={formData.samePhoneAsStore} onChange={handleChange} className="hidden" />
                <span className="text-[#1D1D1D] font-medium leading-snug">My mobile phone number is the same as my store number</span>
              </label>

              <div>
                <p className="text-[#1D1D1D] font-bold mb-3">Do you have business registration? <span className="text-red-500">*</span></p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.hasRegistration === true ? 'border-[#F8C12C]' : 'border-gray-400'}`}>
                      {formData.hasRegistration === true && <div className="w-3 h-3 bg-[#F8C12C] rounded-full"></div>}
                    </div>
                    <input type="radio" name="hasRegistration" onChange={() => setFormData(p => ({...p, hasRegistration: true}))} className="hidden" />
                    <span className="text-gray-800">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.hasRegistration === false ? 'border-[#F8C12C]' : 'border-gray-400'}`}>
                      {formData.hasRegistration === false && <div className="w-3 h-3 bg-[#F8C12C] rounded-full"></div>}
                    </div>
                    <input type="radio" name="hasRegistration" onChange={() => setFormData(p => ({...p, hasRegistration: false}))} className="hidden" />
                    <span className="text-gray-800">No</span>
                  </label>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center transition-colors ${formData.wantsUpdates ? 'bg-[#F8C12C]' : 'border border-gray-300'}`}>
                  {formData.wantsUpdates && <Check className="text-white" size={16} />}
                </div>
                <input type="checkbox" name="wantsUpdates" checked={formData.wantsUpdates} onChange={handleChange} className="hidden" />
                <span className="text-[#1D1D1D] font-medium leading-snug flex items-center flex-wrap gap-1">
                  I'd like to get updates & promotions by <span className="text-[#25D366] font-bold">WhatsApp</span>
                  <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center transition-colors ${formData.acceptsPrivacy ? 'bg-[#F8C12C]' : 'border border-gray-300'}`}>
                  {formData.acceptsPrivacy && <Check className="text-white" size={16} />}
                </div>
                <input type="checkbox" name="acceptsPrivacy" checked={formData.acceptsPrivacy} onChange={handleChange} className="hidden" required />
                <span className="text-[#1D1D1D] font-medium leading-snug">
                  I accept the <a href="#" className="text-[#F8C12C] hover:underline">Privacy Policy</a> <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-[#F8C12C]'} text-white rounded-2xl py-4 font-bold text-lg mt-6 shadow-md hover:bg-[#e6b124] transition flex justify-center items-center`}
            >
              {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Register"}
            </button>
            <p className="text-xs text-gray-500 text-center mt-4 px-4 leading-relaxed">
              This site is protected by reCAPTCHA and the Google <a href="#" className="text-[#F8C12C]">Privacy Policy</a> and <a href="#" className="text-[#F8C12C]">Terms of Service</a> apply.
            </p>
          </form>
        </div>

        {/* Info Section Below Form */}
        <div className="mt-16 text-center">
          <h2 className="text-[28px] font-extrabold text-[#1D1D1D] leading-tight mb-8">
            Find the best solution for your business
          </h2>

          <div className="bg-[#F2F2F2] rounded-full p-1.5 flex mb-8">
            {["Sell", "Manage", "Grow"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-full font-bold text-sm transition ${
                  activeTab === tab 
                    ? "bg-[#F8C12C] text-white shadow-sm" 
                    : "text-[#1D1D1D] hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-left animate-in fade-in slide-in-from-bottom-2 duration-300" key={activeTab}>
            <h3 className="text-2xl font-bold text-[#1D1D1D] mb-4">{tabContent[activeTab].title}</h3>
            <p className="text-[#1D1D1D] mb-6 leading-relaxed">
              {tabContent[activeTab].description}
            </p>
            <p className="font-bold text-[#1D1D1D] mb-3">Learn more about:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#1D1D1D] font-medium underline decoration-gray-400 underline-offset-4 cursor-pointer">
              {tabContent[activeTab].points.map((point, index) => (
                <li key={index} className="hover:text-[#F8C12C] transition-colors">{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Testimonial Section */}
      <section className="bg-gradient-to-b from-black to-[#2A2A2A] text-white pt-16 pb-32 px-5 relative z-10 rounded-t-[40px] mt-10">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-32 h-32 mx-auto rounded-full bg-[#F8C12C] p-1 mb-8 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" alt="Vendor" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-relaxed mb-8">
            "Since we became a partner with Eatro, we've recorded more sales, we've gotten more audiences, we've gained publicity, and it's been an interesting journey all along."
          </h2>
          <p className="font-bold tracking-wide uppercase text-sm">
            Patience DC - Akara University
          </p>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-[#F8C12C] pt-20 pb-10 px-5 -mt-20 relative z-0 rounded-t-[40px] text-center">
        <h2 className="text-3xl font-extrabold text-[#1D1D1D] mb-6 max-w-xs mx-auto">
          Not a Eatro Local Partner yet?
        </h2>
        <button className="bg-[#F8C12C] text-white py-4 px-12 rounded-full font-bold text-lg hover:bg-[#e6b124] transition shadow-md">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default VendorRegistration;
