import React from 'react';

const PromoBanner = () => {
  return (
    <div className="px-4 mb-8 relative">
      <div className="w-full h-32 rounded-xl overflow-hidden relative shadow-sm cursor-pointer group bg-[#FFD166]">
        {/* We use object-cover to make sure the AI generated banner perfectly fills the box */}
        <img 
          src="/img/promo-banner.png" 
          alt="Promo Background" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <span className="text-[13px] font-bold text-black mb-1 drop-shadow-sm">Your welcome gift</span>
          <h2 className="text-xl font-extrabold text-black drop-shadow-sm">Free delivery on your<br/>first order</h2>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
