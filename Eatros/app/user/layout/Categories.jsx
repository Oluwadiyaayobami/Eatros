import React from 'react';

const categories = [
  { name: 'Promotions', icon: '🏷️', bg: 'bg-red-50' },
  { name: 'Jollof', icon: '🍛', bg: 'bg-orange-50' },
  { name: 'Local food', icon: '🍲', bg: 'bg-yellow-50' },
  { name: 'Chicken', icon: '🍗', bg: 'bg-amber-50' },
  { name: 'Snacks', icon: '🍿', bg: 'bg-green-50' },
];

const Categories = () => {
  return (
    <div className="flex overflow-x-auto gap-4 px-4 pb-4 pt-2 hide-scrollbar">
      {categories.map((cat, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm border border-gray-100 ${cat.bg} group-hover:shadow-md transition`}>
            {cat.icon}
          </div>
          <span className="text-[13px] font-semibold text-gray-800">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Categories;
