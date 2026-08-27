"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Info, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "../../../utils/api";

const Login = () => {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('eatroAccessToken');
    if (token) {
      router.push('/auth/location');
    }
  }, [router]);
  
  const handleContinue = async () => {
    if (!email || !password) {
      toast.error("Please fill in all required fields", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      // Save token and user details to localStorage
      localStorage.setItem('eatroAccessToken', data.acessToken);
      localStorage.setItem('eatroUser', JSON.stringify({ email, role: data.role }));

      toast.success(data.message || `Welcome back!`, {
        icon: '🚀',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      
      // Redirect based on role
      if (data.role === 'vendor') {
        router.push("/restaurant/home_dashboard");
      } else if (data.role === 'agent') {
        router.push("/agent/home_dashboard");
      } else {
        router.push("/auth/location");
      }
    } catch (error) {
      toast.error(error.message || "Failed to login", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast.success("Google login triggered!", { icon: "🌐" });
    // Simulate navigation
    setTimeout(() => {
      router.push("/auth/location");
    }, 1000);
  };

  return (
    <>
      {/* MOBILE LAYOUT (Kept from original) */}
      <div className="md:hidden min-h-screen bg-[#FFC244] flex flex-col relative overflow-hidden">
        
        {/* Top Half: eatro brand image — rotates so the food orbits */}
        <div className="flex-1 relative min-h-[35vh] sm:min-h-[40vh] overflow-hidden flex items-center justify-center bg-[#FFC244]">
          <img
            src="/img/eatro.png"
            alt="eatro"
            className="w-full h-full object-cover"
            style={{
              animation: 'rotateFoodRing 20s linear infinite',
              transformOrigin: 'center center',
              transform: 'scale(1.2)',
            }}
          />
          <style>{`
            @keyframes rotateFoodRing {
              from { transform: scale(1.2) rotate(0deg); }
              to   { transform: scale(1.2) rotate(360deg); }
            }
          `}</style>
        </div>

        {/* Bottom Half: White Card Form */}
        <div className="bg-white rounded-t-[2.5rem] px-6 pt-10 pb-8 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] z-20 flex-1 flex flex-col items-center relative">
          
          <h2 className="text-3xl font-bold text-black mb-2">Welcome</h2>
          <p className="text-gray-500 text-sm mb-8">Enter your details to get started</p>

          <div className="w-full max-w-[360px] flex flex-col gap-4 mb-8">
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-gray-400" size={20} />
              <input 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-black focus:ring-1 focus:ring-black font-medium text-black transition placeholder-gray-400"
              />
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-gray-400" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-12 py-3.5 outline-none focus:border-black focus:ring-1 focus:ring-black font-medium text-black transition placeholder-gray-400"
              />
              <button 
                className="absolute right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="w-full max-w-[360px] mb-8">
            <button 
              onClick={handleContinue}
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-black'} text-white rounded-full py-3.5 font-bold text-sm hover:bg-gray-800 transition shadow-md flex justify-center items-center`}
            >
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Continue"}
            </button>
          </div>

          <div className="w-full max-w-[360px] flex items-center gap-4 mb-8 text-gray-400 text-[13px]">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span>or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="w-full max-w-[360px] flex justify-center mb-6">
            <button 
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3.5 font-medium text-sm hover:bg-gray-50 transition shadow-sm"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Don't have an account?{" "}
            <Link href="/auth/user/register" className="text-black font-extrabold hover:underline">
              Sign Up
            </Link>
          </p>

          <p className="text-gray-400 text-xs text-center max-w-[320px] mt-auto leading-relaxed">
            By continuing, you automatically accept our <Link href="#" className="underline hover:text-gray-600 transition">Terms & Conditions</Link>, <Link href="#" className="underline hover:text-gray-600 transition">Privacy Policy</Link> and <Link href="#" className="underline hover:text-gray-600 transition">Cookies policy</Link>.
          </p>
          
        </div>
      </div>


      {/* DESKTOP LAYOUT (Chowdeck Style) */}
      <div className="hidden md:flex min-h-screen bg-vendor-pattern flex-col relative items-center justify-center font-sans">
        
        {/* Top Navigation */}
        <header className="absolute top-0 w-full p-8 flex justify-between items-center z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-black">Eatro</span>
            <span className="text-black/70 font-medium text-xl border-l border-black/20 pl-2">Vendor</span>
          </Link>
          <div className="text-black font-semibold text-lg">
            New to Eatro? <Link href="/auth/vendor/register" className="hover:underline text-black font-bold ml-1">Create account</Link>
          </div>
        </header>

        {/* Login Card */}
        <div className="bg-white rounded-2xl w-full max-w-[500px] p-12 shadow-2xl z-20">
          
          <h1 className="text-3xl font-black italic text-[#1D1D1D] mb-10 uppercase tracking-tight">
            Log in to your account
          </h1>

          <div className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-[#1D1D1D] mb-2">Email address</label>
              <input 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-4 outline-none focus:border-black focus:ring-1 focus:ring-black text-black transition placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-[#1D1D1D] mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-4 pr-12 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black text-black transition placeholder-gray-400"
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center gap-2 mt-4 text-[#1D1D1D] hover:opacity-70 cursor-pointer transition w-fit">
              <Info size={18} className="text-gray-500" /> 
              <span className="font-semibold text-[15px]">Forgot your password?</span>
            </div>

          </div>

          {/* Login Button */}
          <button 
            onClick={handleContinue}
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-[#1D1D1D]'} text-white rounded-lg py-4 mt-10 font-bold text-lg hover:bg-black transition shadow-lg flex justify-center items-center`}
          >
            {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Log in"}
          </button>

        </div>

        {/* Footer Links */}
        <div className="absolute bottom-10 flex gap-8 text-black font-semibold text-lg z-10">
          <Link href="#" className="hover:underline">Privacy policy</Link>
          <Link href="#" className="hover:underline">Terms of service</Link>
        </div>

      </div>
    </>
  )
}

export default Login