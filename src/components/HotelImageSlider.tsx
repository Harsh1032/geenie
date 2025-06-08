"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect } from "react";

const hotelImages = [
  "/hotel.png",
  "/hotel2.png",
  "/hotel3.png",
  "/hotel4.png",
];

export default function HotelImageSlider() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 3000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div ref={sliderRef} className="keen-slider w-full h-56 overflow-hidden relative">
      {hotelImages.map((src, idx) => (
        <div className="keen-slider__slide relative" key={idx}>
          <img src={src} alt={`hotel-${idx}`} className="w-full h-64 object-cover" />

          {/* ✨ Overlay Text */}
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 text-white text-center px-4">
            <h1 className="text-2xl font-bold drop-shadow-md">Welcome to Hotel Gennie</h1>
            <p className="text-base mt-1 drop-shadow-sm">Thank you for staying with XYZ!</p>
          </div>
        </div>
      ))}
    </div>
  );
}
