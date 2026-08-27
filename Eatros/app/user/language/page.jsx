"use client"

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Globe, CheckCircle2 } from "lucide-react";

const LanguagePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English (US)" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "pt", name: "Português" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <Link href="/user/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} className="text-black" />
        </Link>
        <h1 className="text-xl font-bold text-black">Language</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {languages.map((lang, index) => (
            <div 
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition ${
                index !== languages.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <span className="font-semibold text-gray-800">{lang.name}</span>
              {selectedLanguage === lang.code && (
                <CheckCircle2 size={24} className="text-[#00A082]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguagePage;
