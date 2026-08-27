"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, MapPin, Bike, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "../../../../utils/api";

const AgentRegister = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zone, setZone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name || !phone || !zone) {
      toast.error("Please fill in all fields", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }
    if (!zone.toLowerCase().includes("akure")) {
      toast.error("Primary operating zone must be within Akure, Ondo State", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }

    setIsLoading(true);
    try {
      await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'agent',
          phoneNumber: phone,
          agentDetails: { operatingZone: zone }
        })
      });

      toast.success(`Agent account created! Let's get you verified.`, {
        icon: '🚀',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      router.push("/agent/kyc");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">

      {/* Top Half: Branding */}
      <div className="flex-1 relative min-h-[30vh] overflow-hidden flex flex-col items-center justify-center bg-black pt-10">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 mb-4 z-10">
          <Bike size={40} className="text-white" />
        </div>
        <h1 className="text-white text-3xl font-black tracking-wider z-10">EATRO <span className="text-green-500">RIDER</span></h1>

        {/* Subtle background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-t from-black/80 to-transparent z-0 pointer-events-none"></div>
      </div>

      {/* Bottom Half: White Card Form */}
      <div className="bg-white rounded-t-[2.5rem] px-6 pt-8 pb-10 shadow-[0_-15px_40px_rgba(0,0,0,0.2)] z-20 flex-1 flex flex-col items-center relative overflow-y-auto">

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join the Fleet</h2>
        <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">Register as a delivery agent and start earning today.</p>

        {/* Input Fields */}
        <div className="w-full max-w-[360px] flex flex-col gap-4 mb-6">

          <div className="relative flex items-center">
            <User className="absolute left-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-green-500 focus:bg-white font-medium text-gray-900 transition-all placeholder-gray-400"
            />
          </div>

          <div className="relative flex items-center">
            <Mail className="absolute left-4 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-green-500 focus:bg-white font-medium text-gray-900 transition-all placeholder-gray-400"
            />
          </div>

          <div className="relative flex items-center">
            <Phone className="absolute left-4 text-gray-400" size={20} />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-green-500 focus:bg-white font-medium text-gray-900 transition-all placeholder-gray-400"
            />
          </div>

          <div className="relative flex items-center">
            <MapPin className="absolute left-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Primary Operating Zone (e.g. Akure, Ondo State)"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-green-500 focus:bg-white font-medium text-gray-900 transition-all placeholder-gray-400"
            />
          </div>

          <div className="relative flex items-center">
            <Lock className="absolute left-4 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-12 pr-12 py-3.5 outline-none focus:border-green-500 focus:bg-white font-medium text-gray-900 transition-all placeholder-gray-400"
            />
            <button 
              type="button" 
              className="absolute right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative flex items-center">
            <Lock className="absolute left-4 text-gray-400" size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-12 pr-12 py-3.5 outline-none focus:border-green-500 focus:bg-white font-medium text-gray-900 transition-all placeholder-gray-400"
            />
            <button 
              type="button" 
              className="absolute right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

        </div>

        {/* Action Button */}
        <div className="w-full max-w-[360px] flex flex-col gap-4">
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className={`w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Registering...' : 'Continue to Verification'}
          </button>
        </div>

        {/* Link back to generic login or user signup if needed */}
        <p className="mt-8 text-sm text-gray-500 font-medium">
          Already have an account? <Link href="/auth/login" className="text-green-600 hover:underline">Log in</Link>
        </p>

      </div>
    </div>
  );
};

export default AgentRegister;
