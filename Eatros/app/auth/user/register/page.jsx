"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "../../../../utils/api";

const SignUp = () => {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('eatroAccessToken');
    if (token) {
      router.push('/auth/location');
    }
  }, [router]);
  
  const handleSignUp = async () => {
    if (!email || !password || !name) {
      toast.error("Please fill in all fields", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: 'customer' }) // sending role
      });
      
      toast.success(data.message || `Account created for ${name}!`, {
        icon: '🎉',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      router.push("/auth/location");
    } catch (error) {
      toast.error(error.message || "Failed to create account", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast.success("Google signup triggered!", { icon: "🌐" });
    // Simulate navigation
    setTimeout(() => {
      router.push("/auth/location");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFC244] flex flex-col relative overflow-hidden">
      
      {/* Top Half: eatro brand image — rotates so the food orbits */}
      <div className="flex-1 relative min-h-[35vh] overflow-hidden flex items-center justify-center bg-[#FFC244]">
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
      <div className="bg-white rounded-t-[2.5rem] px-6 pt-8 pb-6 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] z-20 flex-1 flex flex-col items-center relative">
        
        <h2 className="text-3xl font-bold text-black mb-2">Create Account</h2>
        <p className="text-gray-500 text-sm mb-6">Join us to get started</p>

        {/* Input Fields */}
        <div className="w-full max-w-[360px] flex flex-col gap-4 mb-6">
          
          {/* Name Field */}
          <div className="relative flex items-center">
            <User className="absolute left-4 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#00A082] font-medium text-black transition placeholder-gray-400"
            />
          </div>

          {/* Email Field */}
          <div className="relative flex items-center">
            <Mail className="absolute left-4 text-gray-400" size={20} />
            <input 
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#00A082] font-medium text-black transition placeholder-gray-400"
            />
          </div>

          {/* Password Field */}
          <div className="relative flex items-center">
            <Lock className="absolute left-4 text-gray-400" size={20} />
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#00A082] font-medium text-black transition placeholder-gray-400"
            />
          </div>

        </div>

        <div className="w-full max-w-[360px] mb-6">
          <button 
            onClick={handleSignUp}
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-black'} text-white rounded-full py-3.5 font-bold text-sm hover:bg-gray-800 transition shadow-md flex justify-center items-center`}
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Sign Up"}
          </button>
        </div>

        {/* Divider */}
        <div className="w-full max-w-[360px] flex items-center gap-4 mb-6 text-gray-400 text-[13px]">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span>or sign up with</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social Buttons */}
        <div className="w-full max-w-[360px] flex justify-center mb-6">
          <button 
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3.5 font-medium text-sm hover:bg-gray-50 transition shadow-sm"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#00A082] font-semibold hover:underline">
            Login
          </Link>
        </p>

        <p className="text-gray-400 text-xs text-center max-w-[320px] mt-auto leading-relaxed">
          By signing up, you automatically accept our <Link href="#" className="underline hover:text-gray-600 transition">Terms & Conditions</Link>, <Link href="#" className="underline hover:text-gray-600 transition">Privacy Policy</Link> and <Link href="#" className="underline hover:text-gray-600 transition">Cookies policy</Link>.
        </p>
        
      </div>
    </div>
  )
}

export default SignUp