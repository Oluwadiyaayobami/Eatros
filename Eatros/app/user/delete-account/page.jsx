"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const DeleteAccountPage = () => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.removeItem("eatroAccessToken");
      localStorage.removeItem("eatroUser");
      toast.success("Account deleted permanently");
      router.push("/auth/user/register");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <Link href="/user/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} className="text-black" />
        </Link>
        <h1 className="text-xl font-bold text-black">Delete Account</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-6 max-w-lg mx-auto mt-4">
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Are you absolutely sure?</h2>
          <p className="text-red-500/80 text-sm leading-relaxed">
            Deleting your account is permanent and cannot be undone. All your order history, saved addresses, and payment methods will be completely erased from our servers.
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className={`w-full ${isDeleting ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'} text-white rounded-xl py-4 font-bold transition shadow-sm flex justify-center items-center`}
          >
            {isDeleting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Yes, delete my account"}
          </button>
          
          <Link 
            href="/user/profile"
            className="w-full block text-center bg-white border border-gray-200 text-gray-700 rounded-xl py-4 font-bold hover:bg-gray-50 transition shadow-sm"
          >
            Cancel and keep my account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
