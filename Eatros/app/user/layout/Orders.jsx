import React from "react";
import GlassBG from "./GlassBG";
import { Truck } from "lucide-react";

const Orders = () => {
  return (
    <div className="">

      <GlassBG>
        <div className="flex flex-col items-center justify-center text-center py-10">
          {/* 🔹 Lucide Icon Logo */}
          <Truck size={48} className="text-[#A31621] mb-3" />

          {/* 🔹 Text */}
          <p className="text-lg font-semibold text-gray-800 mb-1">
            View Past and Current Deliveries
          </p>
          <p className="text-sm text-gray-600">
            View your past and current deliveries here.
          </p>
        </div>
      </GlassBG>
    </div>
  );
};

export default Orders;
