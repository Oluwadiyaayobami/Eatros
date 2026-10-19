"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FileText, 
  Scale, 
  Store, 
  Bike, 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  Ban, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  Printer, 
  ArrowLeft, 
  ArrowUp, 
  Search, 
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Shield,
  Check
} from "lucide-react";


const sections = [
  {
    id: "agreement",
    title: "1. Agreement & Acceptance",
    icon: FileText,
    summary: "Binding legal contract between you and Eatros Technologies."
  },
  {
    id: "eligibility",
    title: "2. Eligibility & Accounts",
    icon: CheckCircle2,
    summary: "Account credentials, minimum age requirement (18+), and security."
  },
  {
    id: "marketplace",
    title: "3. Three-Sided Marketplace",
    icon: Store,
    summary: "How customers, restaurants, and freelance riders interact."
  },
  {
    id: "pricing",
    title: "4. Pricing & Delivery Fees",
    icon: CreditCard,
    summary: "Pricing in Nigerian Naira (NGN), distance charges, and payments."
  },
  {
    id: "fulfillment",
    title: "5. Delivery & Real-Time Tracking",
    icon: Bike,
    summary: "Estimated delivery times, recipient obligations, and live GPS map."
  },
  {
    id: "cancellations",
    title: "6. Cancellations & Refunds",
    icon: RotateCcw,
    summary: "Window for cancellations, missing meal dispute policy, and resolutions."
  },
  {
    id: "vendor-standards",
    title: "7. Vendor Terms & Hygiene",
    icon: Store,
    summary: "Restaurant kitchen standards, menu updates, and weekly settlements."
  },
  {
    id: "agent-standards",
    title: "8. Delivery Agent Conduct",
    icon: Bike,
    summary: "Rider safety, Akure operating zones, and verified onboarding."
  },
  {
    id: "prohibited",
    title: "9. Prohibited Conduct",
    icon: Ban,
    summary: "Fraudulent orders, harassment, reverse engineering, and platform abuse."
  },
  {
    id: "ip",
    title: "10. Intellectual Property",
    icon: Award,
    summary: "Ownership of trademarks, logos, app code, and media assets."
  },
  {
    id: "liability",
    title: "11. Limitation of Liability",
    icon: AlertTriangle,
    summary: "Service disclaimers, allergen notices, and maximum damage caps."
  },
  {
    id: "governing-law",
    title: "12. Governing Law & Jurisdiction",
    icon: Scale,
    summary: "Laws of Ondo State, Federal Republic of Nigeria."
  },
  {
    id: "contact-legal",
    title: "13. Inquiries & Legal Notices",
    icon: Mail,
    summary: "Official contact address and communication channels."
  }
];

export default function TermsClientUI() {
  const [activeSection, setActiveSection] = useState("agreement");
  const [searchQuery, setSearchQuery] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-[#A31621] via-[#FF5722] to-[#F8C12C] z-50 transition-all duration-150"
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
                  <span className="text-[#F8C12C] text-3xl leading-none">.</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-extrabold text-gray-500 -mt-1">
                  Legal &amp; Trust Center
                </span>
              </div>
            </Link>

            {/* Quick Switcher Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100/90 p-1 rounded-full text-xs font-bold border border-gray-200/60">
              <Link 
                href="/privacy" 
                className="px-4 py-1.5 rounded-full text-gray-600 hover:text-black transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="px-4 py-1.5 rounded-full bg-white text-[#1D1D1D] shadow-sm">
                Terms of Service
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              aria-label="Print terms"
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
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#F8C12C]/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#A31621]/15 blur-[140px] pointer-events-none" />
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
                  Eatro Official Agreement
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-700">Verified Platform Terms</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1D1D1D] mb-6 leading-[1.05]">
                Terms of <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A31621] via-[#FF5722] to-[#F8C12C]">
                  Service
                </span>
              </h1>

              <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed mb-8 font-medium max-w-2xl">
                The official governing agreement between Eatros Technologies, our users, partnering restaurants, and delivery agents across Akure and Nigeria. Designed for transparency, mutual respect, and guaranteed culinary satisfaction.
              </p>

              {/* Trust Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                  <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Fair Pricing</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                  <Store size={18} className="text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Fresh Kitchens</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                  <Bike size={18} className="text-[#A31621] shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Akure Transit</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                  <CreditCard size={18} className="text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">Safe Payments</span>
                </div>
              </div>

              {/* Quick Metadata Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 pt-4 border-t border-gray-200/80">
                <span className="flex items-center gap-1.5 text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Effective Date: October 19, 2026
                </span>
                <span>•</span>
                <span>Version: 3.1</span>
                <span>•</span>
                <span>Jurisdiction: Ondo State, Nigeria</span>
              </div>
            </div>

            {/* Right Column: Visual Trust & Legal Badge Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Outer Decorative Glow Ring */}
              <div className="relative w-full max-w-[420px] bg-white/90 backdrop-blur-xl border-2 border-white rounded-[2.5rem] p-8 shadow-[0_25px_60px_rgba(248,193,44,0.22)] overflow-hidden">
                
                {/* Subtle Watermark Orbit */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-[#F8C12C]/20 to-[#A31621]/10 blur-xl pointer-events-none" />

                {/* Centerpiece: Eatro Brand Badge */}
                <div className="flex flex-col items-center text-center relative z-10 mb-6">
                  
                  <div className="relative w-24 h-24 mb-4 rounded-3xl p-1 bg-gradient-to-tr from-[#A31621] via-[#F8C12C] to-[#00A082] shadow-xl group">
                    <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-black">
                      <Image
                        src="/eatrologo.jpeg"
                        alt="Eatro Official Logo"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    {/* Verified Check Badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shadow-md">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[#1D1D1D] tracking-tight">
                    EATRO TECHNOLOGIES
                  </h3>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#A31621] mb-2">
                    Certified Marketplace
                  </p>
                  <p className="text-xs text-gray-500 max-w-[280px] leading-relaxed">
                    Connecting hungry foodies, local culinary artists, and independent dispatch couriers in complete harmony.
                  </p>
                </div>

                {/* Floating Micro-Cards */}
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 hover:bg-white transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Consumer Protection</p>
                      <p className="text-[11px] text-gray-500">2-hour dispute window &amp; full refund backing</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 hover:bg-white transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                      <Store size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Restaurant Hygiene</p>
                      <p className="text-[11px] text-gray-500">Tamper-evident packaging &amp; menu accuracy</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 hover:bg-white transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-[#A31621] flex items-center justify-center shrink-0 font-bold">
                      <Bike size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Verified Akure Couriers</p>
                      <p className="text-[11px] text-gray-500">GPS telemetric tracking &amp; verified road safety</p>
                    </div>
                  </div>
                </div>

                {/* Seal at bottom of card */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1 text-[#00A082] font-bold">
                    <CheckCircle2 size={13} />
                    Legally Binding
                  </span>
                  <span>Eatro Legal Standard v3.1</span>
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
              
              {/* Search Within Terms */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in terms..."
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
                <p className="font-bold text-[#1D1D1D] mb-1">Legal or Dispute Questions?</p>
                <p className="text-gray-600 mb-3 leading-relaxed">
                  Our resolution and compliance team will promptly address any order or contractual disputes.
                </p>
                <a
                  href="mailto:legal@eatro.shop"
                  className="inline-flex items-center gap-1.5 font-bold text-[#A31621] hover:underline"
                >
                  <Mail size={14} />
                  legal@eatro.shop
                </a>
              </div>
            </div>
          </aside>

          {/* Right Main Text Content */}
          <main className="lg:col-span-8 space-y-16">
            
            {/* Section 1 */}
            <article id="agreement" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#A31621]/15 text-[#A31621] flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  1. Agreement & Acceptance of Terms
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                These Terms of Service constitute a legally binding agreement between you and Eatros Technologies ("Eatros", "Company", "we", "us"). By visiting our website (<Link href="https://eatro.shop" className="text-[#00A082] underline font-bold">eatro.shop</Link>), creating an account, registering a restaurant storefront, or onboarding as a dispatch courier, you acknowledge that you have read, understood, and agreed to be bound by these terms.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 leading-relaxed font-semibold">
                If you do not accept all conditions outlined in these Terms, you must immediately discontinue use of the Eatros platform and associated services.
              </div>
            </article>

            {/* Section 2 */}
            <article id="eligibility" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  2. Eligibility & User Accounts
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm font-medium leading-relaxed">
                <p>
                  <strong>Age Requirements:</strong> You must be at least 18 years of age and possess full legal capacity to enter into binding contractual obligations under Nigerian law.
                </p>
                <p>
                  <strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your login credentials (passwords, JWT tokens, and OAuth sessions). Any order or activity originating from your account will be deemed authorized by you.
                </p>
                <p>
                  <strong>Accuracy of Information:</strong> You agree to provide true, current, and complete registration data. Providing fraudulent identities or phone numbers will result in immediate termination of service.
                </p>
              </div>
            </article>

            {/* Section 3 */}
            <article id="marketplace" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Store size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  3. The Three-Sided Marketplace Model
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Eatros operates purely as a technology facilitator connecting three independent parties:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-[#1D1D1D] mb-1">Customers</p>
                  <p className="text-gray-600">Browse menus, place orders, make payments, and receive deliveries at selected locations.</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-[#1D1D1D] mb-1">Food Vendors</p>
                  <p className="text-gray-600">Independent restaurants that set their own prices, prepare food, adhere to health codes, and package meals.</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-[#1D1D1D] mb-1">Delivery Agents</p>
                  <p className="text-gray-600">Independent freelance couriers responsible for pickup and safe transit of parcels across designated zones.</p>
                </div>
              </div>
            </article>

            {/* Section 4 */}
            <article id="pricing" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  4. Pricing, Payments & Delivery Fees
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm font-medium leading-relaxed">
                <p>
                  <strong>Currency:</strong> All item prices, service fees, and courier dispatch charges are displayed and charged in Nigerian Naira (NGN).
                </p>
                <p>
                  <strong>Delivery Surcharges:</strong> Delivery charges are computed transparently based on distance between the restaurant's kitchen and your drop-off coordinates, current weather conditions, and peak demand periods.
                </p>
                <p>
                  <strong>Payment Methods:</strong> Eatros supports verified debit card processing, bank transfers, and digital wallet balances. Charges are final once an order is placed and the restaurant starts preparation.
                </p>
              </div>
            </article>

            {/* Section 5 */}
            <article id="fulfillment" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Bike size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  5. Delivery & Real-Time Tracking
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm font-medium leading-relaxed">
                <p>
                  <strong>Estimated Delivery Times:</strong> ETAs shown in the app are calculated approximations. Variations may happen due to food preparation complexity, road conditions, or unexpected traffic in Akure.
                </p>
                <p>
                  <strong>Recipient Handover Duty:</strong> You must ensure someone is present at the drop-off destination to collect the meal. If the courier is unable to reach you by phone or chat within 10 minutes of arrival at your gate, the order will be marked delivered, and no refund will be provided.
                </p>
              </div>
            </article>

            {/* Section 6 */}
            <article id="cancellations" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <RotateCcw size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  6. Cancellations, Missing Items & Refunds
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm font-medium leading-relaxed">
                <p>
                  <strong>Cancellation Policy:</strong> Orders can only be cancelled free of charge if the restaurant has not yet accepted or started food preparation. Once food preparation begins, cancellations cannot be refunded.
                </p>
                <p>
                  <strong>Disputes & Missing Items:</strong> If an item is missing, damaged, or spoiled upon delivery, you must submit a dispute via in-app customer support within <strong>2 hours of delivery</strong> accompanied by photographic evidence. Validated claims will be credited back to your original payment method or Eatros balance.
                </p>
              </div>
            </article>

            {/* Section 7 */}
            <article id="vendor-standards" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Store size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  7. Vendor Obligations & Food Hygiene
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4 text-sm">
                Restaurants listed on Eatros agree to uphold the highest standards of culinary safety:
              </p>
              <ul className="space-y-3 text-sm text-gray-600 font-medium">
                <li>• Compliance with all local health department rules and food handler hygiene practices.</li>
                <li>• Accurately maintaining stock levels and pricing on the Eatros dashboard.</li>
                <li>• Packaging meals securely in tamper-evident containers to prevent spillage or tampering during motorcycle transit.</li>
              </ul>
            </article>

            {/* Section 8 */}
            <article id="agent-standards" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F8C12C]/20 text-[#1D1D1D] flex items-center justify-center">
                  <Bike size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  8. Delivery Agent Obligations & Operating Zone
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4 text-sm">
                Delivery couriers on the Eatros logistics network are independent service providers:
              </p>
              <ul className="space-y-3 text-sm text-gray-600 font-medium">
                <li>• Primary operating zone must be within Akure, Ondo State, or as approved by Eatros operations.</li>
                <li>• Couriers must maintain roadworthy vehicles, a valid driver's license, and required road insurance.</li>
                <li>• Courteous, respectful customer interactions and timely package delivery without unlawful tampering.</li>
              </ul>
            </article>

            {/* Section 9 */}
            <article id="prohibited" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Ban size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  9. Prohibited Conduct & Account Suspension
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-4 text-sm">
                Users agree not to engage in any illicit behavior, including:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                <li>• Placing false orders with no intention of accepting delivery.</li>
                <li>• Verbally abusing, threatening, or harassing delivery personnel or restaurant staff.</li>
                <li>• Attempting SQL injection, scraping, exploiting vulnerabilities, or overloading our servers.</li>
              </ul>
            </article>

            {/* Section 10 */}
            <article id="ip" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  10. Intellectual Property Rights
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium text-sm">
                All trademarks, domain names, UI designs, graphics, branding, software code, and documentation associated with Eatros belong exclusively to Eatros Technologies. You are granted a limited, revocable, non-transferable license to access our services for personal consumption.
              </p>
            </article>

            {/* Section 11 */}
            <article id="liability" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  11. Limitation of Liability & Disclaimers
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm font-medium leading-relaxed">
                <p>
                  <strong>Allergen Warning:</strong> Eatros does not prepare food. Customers with specific food allergies or dietary restrictions must check directly with the restaurant before ordering. Eatros disclaims liability for adverse allergic reactions.
                </p>
                <p>
                  <strong>Cap on Liability:</strong> To the maximum extent permitted under applicable law, Eatros's total cumulative liability arising from any order shall not exceed the total amount paid by the customer for that specific order.
                </p>
              </div>
            </article>

            {/* Section 12 */}
            <article id="governing-law" className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Scale size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1D]">
                  12. Governing Law & Dispute Resolution
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium text-sm">
                These Terms shall be interpreted and governed in accordance with the substantive laws of Ondo State and the Federal Republic of Nigeria. In the event of any claim, parties shall first attempt amicable settlement through informal mediation before resorting to formal court proceedings.
              </p>
            </article>

            {/* Section 13 */}
            <article id="contact-legal" className="bg-[#1D1D1D] text-white rounded-3xl p-8 md:p-10 shadow-xl scroll-mt-28 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F8C12C] text-[#1D1D1D] flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                    13. Inquiries & Legal Notices
                  </h2>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium text-sm mb-6">
                  For formal notifications, compliance reviews, or partnership contracts, please reach our legal department:
                </p>
                <div className="space-y-3 text-sm text-gray-300">
                  <p className="flex items-center gap-2">
                    <Mail size={16} className="text-[#F8C12C]" />
                    <span>Email: <strong>legal@eatro.shop</strong> / <strong>support@eatro.shop</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#F8C12C]" />
                    <span>Headquarters: <strong>Akure, Ondo State, Federal Republic of Nigeria</strong></span>
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#A31621]/20 rounded-full blur-2xl pointer-events-none" />
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
            <Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link>
            <Link href="/term" className="text-black font-bold">Terms of Service</Link>
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
