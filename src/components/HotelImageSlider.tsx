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
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div ref={sliderRef} className="keen-slider w-full h-56  overflow-hidden">
      {hotelImages.map((src, idx) => (
        <div className="keen-slider__slide" key={idx}>
          <img
            src={src}
            alt={`hotel-${idx}`}
            className="w-full h-64 object-cover"
          />
        </div>
      ))}
    </div>
  );
}
