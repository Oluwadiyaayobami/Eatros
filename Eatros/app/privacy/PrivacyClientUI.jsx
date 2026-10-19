"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Check,

  Lock, 
  MapPin, 
  CreditCard, 
  Eye, 
  Bell, 
  RefreshCw, 
  FileText, 
  Scale, 
  UserCheck, 
  AlertCircle, 
  Trash2, 
  Mail, 
  Phone, 
  ChevronRight, 
  Search, 
  Printer, 
  ArrowLeft, 
  ArrowUp, 
  ExternalLink, 
  CheckCircle2, 
  Globe 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    id: "overview",
    title: "1. Overview & Scope",
    icon: Globe,
    summary: "How Eatros collects and protects your data across our mobile and web applications."
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    icon: FileText,
    summary: "Personal details, live delivery coordinates, account credentials, and device diagnostics."
  },
  {
    id: "how-we-use-data",
    title: "3. How We Use Your Data",
    icon: RefreshCw,
    summary: "Dispatching orders, live telemetry, processing payments, and customer care."
  },
  {
    id: "geolocation",
    title: "4. Geolocation & Real-Time Tracking",
    icon: MapPin,
    summary: "How we track rider location and delivery destinations via WebSockets."
  },
  {
    id: "data-sharing",
    title: "5. Information Sharing & Third Parties",
    icon: UserCheck,
    summary: "Data exchange with participating restaurants and delivery agents."
  },
  {
    id: "data-security",
    title: "6. Security & Storage Safeguards",
    icon: Lock,
    summary: "Encryption, tokenized authentication, and cloud infrastructure safety."
  },
  {
    id: "cookies-storage",
    title: "7. Cookies & Local Storage",
    icon: Eye,
    summary: "Session persistence, access tokens, and browsing preferences."
  },
  {
    id: "your-rights",
    title: "8. Your Privacy Rights & Choices",
    icon: Scale,
    summary: "Accessing, updating, exporting, or permanently deleting your account data."
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    icon: AlertCircle,
    summary: "Strict prohibition of collection of data from minors under 18 years."
  },
  {
    id: "contact",
    title: "10. Contact Data Protection Officer",
    icon: Mail,
    summary: "How to reach our legal and compliance desk in Akure, Ondo State."
  }
];

export default function PrivacyClientUI() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll listener for reading progress and active section spy
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
      setShowScrollTop(window.scrollY > 400);

      const sectionElements = sections.map(sec => ({
        id: sec.id,
        el: document.getElementById(sec.id)
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el) {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const filteredSections = searchQuery.trim()
    ? sections.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1D1D1D] font-sans selection:bg-[#F8C12C] selection:text-[#1D1D1D]">
      
      {/* Top Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#F8C12C] via-[#FF5722] to-[#A31621] z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Navigation Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-40 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md group-hover:scale-105 transition-transform bg-black shrink-0">
                <Image
                  src="/eatrologo.jpeg"
                  alt="Eatro Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight text-[#1D1D1D] flex items-center">
                  EAT<span className="text-[#A31621]">RO</span>
                  <span className="text-[#00A082] text-3xl leading-none">.</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-extrabold text-gray-500 -mt-1">
                  Legal &amp; Trust Center
                </span>
              </div>
            </Link>

            {/* Quick Switcher Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100/90 p-1 rounded-full text-xs font-bold border border-gray-200/60">
              <span className="px-4 py-1.5 rounded-full bg-white text-[#1D1D1D] shadow-sm">
                Privacy Policy
              </span>
              <Link 
                href="/term" 
                className="px-4 py-1.5 rounded-full text-gray-600 hover:text-black transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              aria-label="Print policy"
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold hover:bg-gray-50 transition text-gray-700 cursor-pointer"
            >
              <Printer size={15} />
              Print / Save PDF
            </button>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 bg-[#1D1D1D] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-black transition shadow-sm"
            >
              <ArrowLeft size={14} />
              Return to App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFDF7] via-[#FFF6E5] to-[#FFFFFF] py-16 md:py-24 border-b border-gray-200/70">
        
        {/* Subtle Brand Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00A082]/15 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#F8C12C]/20 blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Value Propositions */}
            <div className="lg:col-span-7">
              
              {/* Eatro Logo Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 border border-amber-300 shadow-sm backdrop-blur-md mb-6">
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-amber-400 shrink-0">
                  <Image src="/eatrologo.jpeg" alt="Eatro" fill className="object-cover" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#A31621]">
                  Eatro Data Protection Standard
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-700">NDPA / NDPR Compliant</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1D1D1D] mb-6 leading-[1.05]">
                Privacy <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A31621] via-[#FF5722] to-[#F8C12C]">
                  Policy
                </span>
              </h1>

              <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed mb-8 font-medium max-w-2xl">
                We believe in total privacy transparency. Learn exactly how Eatros Technologies safeguards, protects, and handles your personal credentials, live order tracking telemetry, and Nigerian bank payment details.
              </p>

              {/* Trust Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                  <Lock size={18} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">TLS Encryption</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                  <Eye size={18} className="text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">No Data Selling</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                  <MapPin size={18} className="text-[#A31621] shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Secure GPS</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                  <Scale size={18} className="text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Full User Rights</span>
                </div>
              </div>

              {/* Quick Metadata Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 pt-4 border-t border-gray-200/80">
                <span className="flex items-center gap-1.5 text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Effective Date: October 19, 2026
                </span>
                <span>•</span>
                <span>Version: 2.4</span>
                <span>•</span>
                <span>Jurisdiction: Akure, Ondo State &amp; Nigeria</span>
              </div>
            </div>

            {/* Right Column: Visual Trust & Legal Badge Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Outer Decorative Glow Ring */}
              <div className="relative w-full max-w-[420px] bg-white/90 backdrop-blur-xl border-2 border-white rounded-[2.5rem] p-8 shadow-[0_25px_60px_rgba(248,193,44,0.22)] overflow-hidden">
                
                {/* Subtle Watermark Orbit */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-[#00A082]/20 to-[#F8C12C]/10 blur-xl pointer-events-none" />

                {/* Centerpiece: Eatro Brand Badge */}
                <div className="flex flex-col items-center text-center relative z-10 mb-6">
                  
                  <div className="relative w-24 h-24 mb-4 rounded-3xl p-1 bg-gradient-to-tr from-[#00A082] via-[#F8C12C] to-[#A31621] shadow-xl group">
                    <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-black">
                      <Image
                        src="/eatrologo.jpeg"
                        alt="Eatro Official Logo"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    {/* Verified Shield Badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shadow-md">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[#1D1D1D] tracking-tight">
                    EATRO PRIVACY SHIELD
                  </h3>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#00A082] mb-2">
                    Verified NDPA Compliant
                  </p>
                  <p className="text-xs text-gray-500 max-w-[280px] leading-relaxed">
                    Protecting customer identities, merchant banking credentials, and courier telemetry with multi-layered cryptography.
                  </p>
                </div>

                {/* Floating Micro-Cards */}
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 hover:bg-white transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                      <Lock size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Encrypted Auth Tokens</p>
                      <p className="text-[11px] text-gray-500">HttpOnly cookies &amp; Bcrypt credential security</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 hover:bg-white transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Protected GPS Telemetry</p>
                      <p className="text-[11px] text-gray-500">Encrypted socket feeds for live order tracking</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 hover:bg-white transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                      <Scale size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Instant Data Erasure</p>
                      <p className="text-[11px] text-gray-500">Full account deletion support in your profile</p>
                    </div>
                  </div>
                </div>

                {/* Seal at bottom of card */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1 text-[#00A082] font-bold">
                    <CheckCircle2 size={13} />
                    Data Protection Sealed
                  </span>
                  <span>Eatro Trust v2.4</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Main Content Layout with Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Sticky Sidebar (TOC) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">
              
              {/* Search Within Policy */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in policy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-400 font-medium"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider font-extrabold text-gray-400 mb-3 px-1">
                  Table of Contents
                </p>
                <nav className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredSections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#1D1D1D] text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-black"
                        }`}
                      >
                        <Icon size={16} className={isActive ? "text-[#F8C12C]" : "text-gray-400"} />
                        <span className="truncate">{sec.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Direct Support Card */}
              <div className="bg-[#FFF9F0] border border-[#F8C12C]/30 rounded-2xl p-4 text-xs">
                <p className="font-bold text-[#1D1D1D] mb-1">Need Clarification?</p>
                <p className="text-gray-600 mb-3 leading-relaxed">
                  Our privacy compliance team is available to assist with any questions regarding your personal data.
                </p>
                <a
                  href="mailto:support@eatro.shop"
                  className="inline-flex items-center gap-1.5 font-bold text-[#A31621] hover:underline"
                >
                  <Mail size={14} />
                  support@eatro.shop
                </a>
              </div>
            </div>
          </aside>

          {/* Right Main Text Content */}
          <main className="lg:col-span-8 space-y-16">
            
            {/* Section 1 */}
            <article id="overview" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F8C12C]/20 flex items-center justify-center text-[#1D1D1D]">
                  <Globe size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  1. Overview & Scope
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Eatros Technologies ("Eatros", "we", "our", or "us") operates the food ordering, vendor onboarding, and dispatch logistics platform available via our web portal (<Link href="https://eatro.shop" className="text-[#00A082] underline font-bold">eatro.shop</Link>) and mobile interfaces.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium mb-6">
                This Privacy Policy explains the specific ways in which we collect, store, share, and protect your information when you access Eatros as a <strong>Customer</strong> (ordering delicious meals), a <strong>Restaurant/Vendor</strong> (managing menus and kitchen orders), or a <strong>Delivery Agent</strong> (accepting and fulfilling delivery dispatches within Akure, Ondo State, and beyond).
              </p>
              <div className="bg-[#FFF9F0] border-l-4 border-[#F8C12C] p-4 rounded-r-xl">
                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  By accessing, registering an account, or interacting with Eatros, you explicitly agree to the data collection and processing practices described herein, compliant with the Nigeria Data Protection Act (NDPA) and global privacy guidelines.
                </p>
              </div>
            </article>

            {/* Section 2 */}
            <article id="information-we-collect" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  2. Information We Collect
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-6">
                To guarantee lightning-fast food deliveries, secure payments, and fraud prevention, we collect specific categories of personal data:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                  <h3 className="font-bold text-sm text-[#1D1D1D] mb-2 flex items-center gap-2">
                    <UserCheck size={16} className="text-[#A31621]" /> Customer Profile Data
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Full name, email address, phone contact, delivery destination coordinates, delivery notes (e.g. gate instructions), and encrypted login credentials.
                  </p>
                </div>

                <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                  <h3 className="font-bold text-sm text-[#1D1D1D] mb-2 flex items-center gap-2">
                    <Globe size={16} className="text-[#00A082]" /> Google Authentication Data
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    When you sign in using Google Auth, we receive your Google ID, verified email, display name, and avatar URL provided through Google OAuth 2.0.
                  </p>
                </div>

                <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                  <h3 className="font-bold text-sm text-[#1D1D1D] mb-2 flex items-center gap-2">
                    <CreditCard size={16} className="text-amber-600" /> Vendor Verification & Banking
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Store name, physical store address, operating schedules, CAC business certificates, and Nigerian bank account details for merchant settlement.
                  </p>
                </div>

                <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                  <h3 className="font-bold text-sm text-[#1D1D1D] mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-purple-600" /> Agent Verification & KYC
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Government-issued ID documents, driver's license numbers, vehicle registration certificates, selfie verification photos, and live delivery zone credentials.
                  </p>
                </div>
              </div>
            </article>

            {/* Section 3 */}
            <article id="how-we-use-data" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <RefreshCw size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  3. How We Use Your Data
                </h2>
              </div>
              <ul className="space-y-4 text-gray-600 text-sm font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Order Routing:</strong> Automatically matching your food order with the selected restaurant's kitchen workflow and dispatching the nearest qualified Eatros rider.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Real-Time Updates:</strong> Sending instantaneous status push notifications and WebSocket broadcasts as your food is prepared, packaged, and transported.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Financial Settlements:</strong> Processing customer transactions securely and calculating payouts for independent agents and food vendors.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Safety & Verification:</strong> Validating rider KYC credentials to guarantee consumer trust and avoid impersonation on the road.</span>
                </li>
              </ul>
            </article>

            {/* Section 4 */}
            <article id="geolocation" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                  <MapPin size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  4. Geolocation & Real-Time Tracking
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Because Eatros is a real-time logistics platform, precise location data is foundational to our service:
              </p>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-[#1D1D1D] mb-1">For Customers:</p>
                  <p>We ask for device GPS permission or manual pin drop to accurately identify your doorstep or campus landmark in Akure. We only track your location during active address selection.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <p className="font-bold text-[#1D1D1D] mb-1">For Delivery Agents:</p>
                  <p>When an agent switches their status to "Online" and accepts a delivery order, their GPS telemetry updates continuously via Socket.io to calculate estimated time of arrival (ETA) and display real-time bike movement on the tracking map.</p>
                </div>
              </div>
            </article>

            {/* Section 5 */}
            <article id="data-sharing" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <UserCheck size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  5. Information Sharing & Third Parties
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                <strong>We will never sell or rent your personal data to advertisers.</strong> We only share information strictly necessary to fulfill delivery orders:
              </p>
              <ul className="space-y-3 text-sm text-gray-600 font-medium">
                <li>• <strong>With Restaurants:</strong> We provide your name, order details, and special instructions so your food is prepared exactly to your taste.</li>
                <li>• <strong>With Delivery Agents:</strong> We provide your name, telephone contact, and delivery location coordinates so the rider can navigate and hand off your package.</li>
                <li>• <strong>Cloud Providers:</strong> We utilize Cloudinary for encrypted media uploads (e.g. food imagery, store banners, and KYC verification records).</li>
                <li>• <strong>Legal Compulsion:</strong> We may disclose data when legally required by Nigerian courts, law enforcement, or statutory agencies.</li>
              </ul>
            </article>

            {/* Section 6 */}
            <article id="data-security" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  6. Security & Storage Safeguards
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                We implement industry-standard cryptographic and architectural measures to guard your data:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <p className="font-bold text-sm mb-1 text-[#1D1D1D]">Bcrypt Hashing</p>
                  <p className="text-xs text-gray-500">All local account passwords undergo multi-round cryptographic salting.</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <p className="font-bold text-sm mb-1 text-[#1D1D1D]">JWT & HttpOnly</p>
                  <p className="text-xs text-gray-500">Dual-token authentication with strictly protected HttpOnly cookies.</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <p className="font-bold text-sm mb-1 text-[#1D1D1D]">TLS Encryption</p>
                  <p className="text-xs text-gray-500">Every WebSocket and REST request is encrypted end-to-end via HTTPS/WSS.</p>
                </div>
              </div>
            </article>

            {/* Section 7 */}
            <article id="cookies-storage" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Eye size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  7. Cookies & Local Storage
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium text-sm">
                Eatros uses browser cookies and local storage tokens (`eatroAccessToken`, `eatroUser`) strictly to maintain your logged-in session, remember recent food selections, and prevent you from having to sign in repeatedly. You can clear these at any time via your browser settings.
              </p>
            </article>

            {/* Section 8 */}
            <article id="your-rights" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Scale size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  8. Your Privacy Rights & Choices
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4 text-sm">
                Under the NDPA, you maintain full control over your personal data:
              </p>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Right to Rectify:</strong> You can edit your name, phone number, and preferences anytime in <Link href="/user/profile" className="text-[#00A082] font-bold hover:underline">Your Profile</Link>.</p>
                <p>• <strong>Right to Erasure (Account Deletion):</strong> You can permanently wipe your account history, saved cards, and profile records at <Link href="/user/delete-account" className="text-red-600 font-bold hover:underline">Delete Account</Link>.</p>
                <p>• <strong>Right to Object:</strong> You may unsubscribe from marketing notifications at any time.</p>
              </div>
            </article>

            {/* Section 9 */}
            <article id="children" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <AlertCircle size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  9. Children's Privacy
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium text-sm">
                Our services are directed to adults and individuals capable of entering legally binding contracts. We do not intentionally solicit or collect personal information from individuals below 18 years of age.
              </p>
            </article>

            {/* Section 10 */}
            <article id="contact" className="bg-[#1D1D1D] text-white rounded-3xl p-8 md:p-10 shadow-xl scroll-mt-28 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F8C12C] text-[#1D1D1D] flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                    10. Contact Data Protection Officer
                  </h2>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium text-sm mb-6">
                  If you have inquiries, complaints, or subject access requests concerning your personal information, contact our privacy compliance desk:
                </p>
                <div className="space-y-3 text-sm text-gray-300">
                  <p className="flex items-center gap-2">
                    <Mail size={16} className="text-[#F8C12C]" />
                    <span>Email: <strong>privacy@eatro.shop</strong> / <strong>support@eatro.shop</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#F8C12C]" />
                    <span>Location: <strong>Akure, Ondo State, Federal Republic of Nigeria</strong></span>
                  </p>
                </div>
              </div>
              {/* Decorative Accent */}
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#F8C12C]/10 rounded-full blur-2xl pointer-events-none" />
            </article>

          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 px-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F8C12C] flex items-center justify-center font-bold text-[#1D1D1D]">
              E
            </div>
            <span className="font-extrabold text-lg text-[#1D1D1D]">Eatros Technologies</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-600">
            <Link href="/privacy" className="text-black font-bold">Privacy Policy</Link>
            <Link href="/term" className="hover:text-black transition">Terms of Service</Link>
            <Link href="/about" className="hover:text-black transition">About Us</Link>
            <Link href="/auth/login" className="hover:text-black transition">Login</Link>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Eatros Technologies. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#1D1D1D] text-white flex items-center justify-center shadow-2xl hover:bg-[#F8C12C] hover:text-[#1D1D1D] transition-all duration-300 z-50 cursor-pointer"
        >
          <ArrowUp size={20} />
        </button>
      )}

    </div>
  );
}
