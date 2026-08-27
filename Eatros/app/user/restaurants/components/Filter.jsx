import React from "react";
import GlassBG from "../../layout/GlassBG";
import {
  Utensils,
  CheckCircle,
  Star,
  ShoppingBag,
} from "lucide-react";

const Filter = () => {
  const filters = [
    { id: 1, name: "Food type", icon: <Utensils className="w-4 h-4 text-gray-700" /> },
    { id: 2, name: "Available", icon: <CheckCircle className="w-4 h-4 text-gray-700" /> },
    { id: 3, name: "Top Rated", icon: <Star className="w-4 h-4 text-gray-700" /> },
    { id: 4, name: "Most Purchased", icon: <ShoppingBag className="w-4 h-4 text-gray-700" /> },
  ];

  return (
    <div className="flex gap-3 mx-5 mt-5 overflow-x-auto hide-scrollbar  ">
      {filters.map((filter) => (
        <GlassBG
          key={filter.id}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-800 font-medium text-sm whitespace-nowrap hover:bg-white/20 transition"
        >
          {filter.icon}
          <span>{filter.name}</span>
        </GlassBG>
      ))}
    </div>
  );
};

export default Filter;
