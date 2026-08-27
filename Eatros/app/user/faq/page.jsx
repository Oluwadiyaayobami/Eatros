"use client"

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "Once your order is accepted by the restaurant, you can track its status in real-time on the Order History page. When an agent picks it up, you'll see them on the map!"
    },
    {
      question: "What if my food arrives cold or damaged?",
      answer: "We're sorry to hear that! Please contact our support team within 24 hours via the Help button, and we will arrange a refund or replacement for you."
    },
    {
      question: "How do I use a promo code?",
      answer: "You can apply a promo code directly at the checkout screen before paying, or you can add them to your account in the Promo Codes section of your profile."
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can only be cancelled before the restaurant accepts them. Once preparation begins, the order is locked in to prevent food waste."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <Link href="/user/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} className="text-black" />
        </Link>
        <h1 className="text-xl font-bold text-black">FAQ</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-gray-50 transition"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="font-bold text-gray-800 pr-4">{faq.question}</h3>
                <div className="text-[#00A082] flex-shrink-0">
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-[#00A082]/10 rounded-2xl text-center">
          <h3 className="font-bold text-[#00A082] mb-2">Still need help?</h3>
          <p className="text-gray-600 text-sm mb-4">Our support team is available 24/7 to assist you.</p>
          <button className="bg-[#00A082] text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-90">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
