"use client";

import React from "react";
import Image from "next/image";
import GlassBG from "../../layout/GlassBG";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


// Import your food images
import food1 from "../../../../public/img/food1.png";
import food2 from "../../../../public/img/food2.png";
import food3 from "../../../../public/img/food3.png";
import food4 from "../../../../public/img/food4.png";
import food5 from "../../../../public/img/food5.png";
import food6 from "../../../../public/img/food6.png";
import food7 from "../../../../public/img/food7.png";
import food8 from "../../../../public/img/food8.png";

const foods = [
  { image: food1, name: "Pizza" },
  { image: food2, name: "Burger" },
  { image: food3, name: "Ice Cream" },
  { image: food4, name: "Jollof Rice" },
  { image: food5, name: "Pasta" },
  { image: food6, name: "Seafood" },
  { image: food7, name: "Suya" },
  { image: food8, name: "Shawarma" },
];

const Specials = () => {
  return (
    <div className="px-4 py-6">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        spaceBetween={20}
        slidesPerView={5}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-10"
      >
        {foods.map((food, index) => (
        <SwiperSlide key={index}>
        <div className="flex flex-col items-center justify-center text-center">
            <GlassBG className="w-16 h-16 rounded-full flex items-center justify-center">
          <div className="w-10 h-10 relative mb-2 ">
            <Image
              src={food.image}
              alt={food.name}
              
              
              className="object-contain  "
            />
          </div>
          </GlassBG>
          <p className="text-gray-700 text-sm font-medium">{food.name}</p>
        </div>
      </SwiperSlide>
        ))}

        {/* Custom Pagination */}
        <div className="custom-pagination flex justify-center pt-5"></div>
      </Swiper>
    </div>
  );
};

export default Specials;
