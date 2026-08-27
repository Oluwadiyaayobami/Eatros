"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Store, CreditCard, TrendingUp, CheckCircle2 } from "lucide-react";

export default function VendorLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-vendor-pattern font-sans overflow-x-hidden">
      
      {/* Header */}
      <header className="bg-[#F8C12C] sticky top-0 z-50 px-5 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-1 text-xl font-bold animate-pulse">
          <span className="text-[#1D1D1D]">Eatro</span>
          <span className="text-white">Local</span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="font-semibold text-gray-700 hover:text-[#1D1D1D] transition">Features</Link>
          <Link href="#" className="font-semibold text-gray-700 hover:text-[#1D1D1D] transition">Success Stories</Link>
          <Link href="#" className="font-semibold text-gray-700 hover:text-[#1D1D1D] transition">Pricing</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="hidden md:block font-bold text-gray-800 hover:text-[#1D1D1D] transition">
            Login
          </Link>
          <Link href="/auth/vendor/register" className="hidden md:flex bg-[#1D1D1D] hover:bg-[#000000] text-white px-6 py-2.5 rounded-full font-bold transition items-center gap-2">
            Get Started <ArrowRight size={18} />
          </Link>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden">
            <Menu className="text-gray-800" size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-64 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <span className="font-bold text-lg text-[#1D1D1D]">Menu</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-800" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <Link href="/auth/login" className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition">
            <Store size={20} className="text-[#1D1D1D]" />
            <span className="font-semibold">Partner Login</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition">
            <CreditCard size={20} className="text-[#1D1D1D]" />
            <span className="font-semibold">Pricing & Fees</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition">
            <TrendingUp size={20} className="text-[#1D1D1D]" />
            <span className="font-semibold">Success Stories</span>
          </Link>
        </div>
        <div className="p-5 border-t border-gray-100">
          <Link href="/auth/vendor/register" onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center bg-[#1D1D1D] text-white py-3 rounded-full font-bold shadow-md hover:bg-[#000000] transition">
            Register Now
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10">
        {/* Background Decorative Blobs with Animation */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white rounded-full blur-[100px] opacity-30 animate-[bounce_8s_infinite]"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#1D1D1D] rounded-full blur-[100px] opacity-40 animate-[pulse_6s_infinite]"></div>

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-yellow-200 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              <span className="text-sm font-bold text-gray-800">New Feature: Menu Management</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#1D1D1D] leading-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
              Take complete control of your <span className="text-[#1D1D1D]">digital menu.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto md:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both leading-relaxed">
              Join Eatro and unlock a powerful suite of tools designed to help you manage items, set variations, track stock, and boost your restaurant's revenue effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <Link href="/auth/vendor/register" className="w-full sm:w-auto bg-[#1D1D1D] hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                Become a Partner <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-lg mx-auto animate-in fade-in slide-in-from-right-12 duration-1000 delay-300 fill-mode-both">
            {/* Hero Main Image (Using menu1 (5) as a dashboard overview) */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="/img/menu1 (5).png" alt="Menu Management Dashboard" className="w-full h-auto object-cover" />
            </div>
            {/* Floating Element (Using menu1 (2) as a detail floating card) */}
            <div className="absolute -bottom-8 -left-8 md:-left-16 w-48 md:w-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500 delay-100">
              <img src="/img/menu1 (2).png" alt="Menu Details" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-24 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-20 max-w-7xl mx-auto px-6 mt-12">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1D1D1D] mb-6">Built for growth, designed for ease</h2>
          <p className="text-lg text-gray-600">See exactly how our Menu Management System empowers your restaurant to run smoother than ever.</p>
        </div>

        <div className="space-y-32">
          
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="w-12 h-12 bg-green-50 text-[#1D1D1D] rounded-2xl flex items-center justify-center">
                <Menu size={24} />
              </div>
              <h3 className="text-3xl font-bold text-[#1D1D1D] leading-tight">Organize categories and items with zero friction.</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Group your offerings into logical categories like Starters, Mains, and Drinks. Drag and drop items to reorder them based on popularity or time of day.
              </p>
              <ul className="space-y-3 pt-4">
                {['Unlimited Categories', 'Instant Sync to User App', 'Drag-and-Drop Ordering'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-800 font-semibold">
                    <CheckCircle2 className="text-[#1D1D1D]" size={20} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full relative animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-transparent rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
              <img src="/img/menu1 (1).png" alt="Category Organization" className="w-full rounded-3xl shadow-xl border border-gray-100" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="w-12 h-12 bg-yellow-50 text-[#F8C12C] rounded-2xl flex items-center justify-center">
                <Store size={24} />
              </div>
              <h3 className="text-3xl font-bold text-[#1D1D1D] leading-tight">Complex variations, simplified.</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Need to offer a meal in different sizes? Want to add extra toppings or specify spice levels? Our variation system handles complex modifiers effortlessly.
              </p>
              <ul className="space-y-3 pt-4">
                {['Required vs Optional Choices', 'Variable Pricing', 'Multi-select Add-ons'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-800 font-semibold">
                    <CheckCircle2 className="text-[#F8C12C]" size={20} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full relative animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100 to-transparent rounded-3xl transform -translate-x-4 translate-y-4 -z-10"></div>
              <img src="/img/menu1 (3).png" alt="Menu Variations" className="w-full rounded-3xl shadow-xl border border-gray-100" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-3xl font-bold text-[#1D1D1D] leading-tight">Detailed analytics at a glance.</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Keep an eye on what's selling and what isn't. View item-level performance, peak ordering times, and stock availability directly from the dashboard.
              </p>
              <ul className="space-y-3 pt-4">
                {['Item Performance Tracking', 'Stock Availability Toggles', 'Revenue Insights'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-800 font-semibold">
                    <CheckCircle2 className="text-blue-500" size={20} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full relative animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <img src="/img/menu1 (4).png" alt="Analytics and Overview" className="w-full rounded-3xl shadow-xl border border-gray-100 transform transition-transform hover:scale-[1.02] duration-300" />
                </div>
                <div className="col-span-1">
                  <img src="/img/menu1 (6).png" alt="Analytics Insights" className="w-full h-full object-cover rounded-3xl shadow-xl border border-gray-100 transform transition-transform hover:scale-[1.05] duration-300" />
                </div>
                <div className="col-span-1">
                  <img src="/img/menu1 (7).png" alt="Performance Details" className="w-full h-full object-cover rounded-3xl shadow-xl border border-gray-100 transform transition-transform hover:scale-[1.05] duration-300" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1D1D1D] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D1D1D] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F8C12C] rounded-full blur-[120px] opacity-10"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 animate-in fade-in zoom-in-95 duration-700">
            Ready to upgrade your restaurant?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-700 delay-100">
            Join hundreds of local partners already growing their business with Eatro's powerful ecosystem.
          </p>
          <Link href="/auth/vendor/register" className="inline-flex bg-[#F8C12C] hover:bg-[#e6b124] text-gray-900 px-10 py-5 rounded-full font-bold text-xl transition shadow-2xl hover:scale-105 active:scale-95 items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Start Selling Today <ArrowRight size={24} />
          </Link>
        </div>
      </section>

    </div>
  );
}
