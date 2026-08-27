"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import GlassBG from '@/app/restaurant/layout/GlassBG'

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import food1 from '../../../../public/img/food1.png'
import food2 from "../../../../public/img/food2.png";
import food3 from "../../../../public/img/food3.png";
import food4 from "../../../../public/img/food4.png";
import food5 from "../../../../public/img/food5.png";
import food6 from "../../../../public/img/food6.png";
import food7 from "../../../../public/img/food7.png";
import food8 from "../../../../public/img/food8.png";

const foods = [
    { image: food1, name: "Rice", quantity: "1 scoop" },
    { image: food2, name: "Beans", quantity: "1 scoop" },
    { image: food3, name: "Yam", quantity: "1 scoop" },
    { image: food4, name: "Egg", quantity: "1 piece" },
    { image: food5, name: "Pasta", quantity: "1 scoop" },
    { image: food6, name: "Seafood", quantity: "1 scoop" },
    { image: food7, name: "Suya", quantity: "1 scoop" },
    { image: food8, name: "Shawarma", quantity: "1 scoop" },
];

export default function FoodSwiper() {
  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      autoplay={{ delay: 3000 }}
    //   pagination={{ clickable: true }}
      spaceBetween={20}
      slidesPerView={4}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {foods.map((food, index) => (
        <SwiperSlide key={index}>
          <div className="flex flex-col items-center text-center mt-3">
            <GlassBG className="w-16 h-16 rounded-full flex items-center justify-center">
              <Image
                src={food.image}
                alt={food.name}
                width={40}
                height={40}
              />
            </GlassBG>

            <p className="text-sm font-medium">{food.name}</p>
            <p className="text-xs text-gray-500">{food.quantity}</p>
          </div>
        </SwiperSlide>
      ))}
  
    </Swiper>
  );
}
