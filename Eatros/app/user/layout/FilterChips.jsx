import React from 'react';
import { ChevronDown, Crown } from 'lucide-react';

const FilterChips = ({ category = "food" }) => {
  const getFilterLabel = () => {
    if (category === 'groceries') return 'Grocery type';
    if (category === 'shops') return 'Store type';
    if (category === 'pharmacy') return 'Product type';
    return 'Food type';
  };

  return (
    <div className="flex overflow-x-auto gap-3 px-4 pb-6 pt-2 hide-scrollbar">
      <button className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-800 transition whitespace-nowrap">
        {getFilterLabel()} <ChevronDown size={16} className="text-gray-500" />
      </button>
      
      <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-800 transition whitespace-nowrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 12 6-2 6 2"/><path d="M12 10v4"/></svg>
        Pickup
      </button>

      <button className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-800 transition whitespace-nowrap">
        Sort by <ChevronDown size={16} className="text-gray-500" />
      </button>

      <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-800 transition whitespace-nowrap">
        <Crown size={16} className="text-gray-600" />
        Top Rated
      </button>
    </div>
  );
};

export default FilterChips;
