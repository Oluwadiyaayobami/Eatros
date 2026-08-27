"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Utensils, Bike, MapPin, Clock } from "lucide-react";
import GlassBG from "../../layout/GlassBG";

const steps = [
  { id: 1, title: "Order Confirmed", desc: "We have received your order", icon: CheckCircle2 },
  { id: 2, title: "Preparing Food", desc: "The kitchen is working their magic", icon: Utensils },
  { id: 3, title: "On the Way", desc: "Your agent is heading to you", icon: Bike },
  { id: 4, title: "Delivered", desc: "Enjoy your meal from Eatro!", icon: MapPin },
];

const TrackingOrder = () => {
  const [currentStep, setCurrentStep] = useState(2); // Mocking "Preparing Food"

  return (
    <GlassBG className="w-full max-w-md mx-auto p-6 bg-white/30 backdrop-blur-xl rounded-xl border ">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Tracking Order</h3>
          <p className="text-xs text-gray-500 font-mono">ID: #EA-77210</p>
        </div>
        <div className="bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3 text-green-700 animate-pulse" />
          <span className="text-[10px] font-bold text-green-700">25-30 MIN</span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* The connecting line background */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200" />
        
        {/* The animated progress line */}
        <div 
          className="absolute left-[19px] top-2 w-0.5 bg-green-600 transition-all duration-1000 ease-in-out" 
          style={{ height: `${(currentStep - 1) * 33}%` }}
        />

        <div className="space-y-8">
          {steps.map((step, index) => {
            const isCompleted = index + 1 < currentStep;
            const isCurrent = index + 1 === currentStep;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex gap-4 relative">
                {/* Circle Indicator */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isCompleted || isCurrent ? "bg-green-600 shadow-lg shadow-green-200" : "bg-gray-100"
                }`}>
                  <Icon className={`w-5 h-5 ${isCompleted || isCurrent ? "text-white" : "text-gray-400"}`} />
                  
                  {/* Pulsing ring for current step */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-25" />
                  )}
                </div>

                {/* Text Content */}
                <div className="flex flex-col justify-center">
                  <p className={`font-bold text-sm ${isCurrent ? "text-green-700" : "text-gray-800"}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver/Agent Mockup Card */}
      {currentStep >= 3 && (
         <div className="mt-10 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                    <img src="https://i.pravatar.cc/150?u=1" alt="agent" className="object-cover" />
                </div>
                <div>
                    <p className="text-xs text-gray-400">Your Agent</p>
                    <p className="text-sm font-bold text-gray-800">Tunde Joshua</p>
                </div>
            </div>
            <button className="bg-green-700 p-2 rounded-full text-white">
                <Bike size={18} />
            </button>
         </div>
      )}
    </GlassBG>
  );
};

export default TrackingOrder;