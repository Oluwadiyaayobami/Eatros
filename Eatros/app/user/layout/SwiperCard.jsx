"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SwiperCard = () => {
  const slides = [
    {
      image:
        "https://img.freepik.com/free-photo/food-frame-with-chinese-dish_23-2148242506.jpg",
      title: "Authentic Chinese Dishes",
      subtitle: "Taste the flavors of the East in every bite.",
    },
    {
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      title: "Fresh & Delicious Meals",
      subtitle: "Savor hand-picked ingredients cooked to perfection.",
    },
    {
      image:
        "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
      title: "Fine Dining Experience",
      subtitle: "Luxury, comfort, and taste combined.",
    },
    {
      image: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg",
      title: "World-Class Chefs",
      subtitle: "Every dish crafted with passion and creativity.",
    },
    {
      image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
      title: "Your Next Favorite Spot",
      subtitle: "Dine, relax, and enjoy the atmosphere.",
    },
  ];

  return (
    <div className="relative m-5">
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
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-10"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative rounded-2xl overflow-hidden shadow-lg group">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-5">
                <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-sm  text-gray-200 max-w-xs">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination */}
      <div className="custom-pagination flex justify-center pt-3"></div>
    </div>
  );
};

export default SwiperCard;
