import FloatingImages from "@/components/FloatingImages";
import HotelImageSlider from "@/components/HotelImageSlider";
import Recommendations from "@/components/Recommendations";
import {
  Bath,
  BriefcaseBusiness,
  ChevronRight,
  ConciergeBell,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-y-4 pb-5 bg-[#FFA553]">
      <div className="flex flex-col items-center w-full gap-y-2">
        <HotelImageSlider />

        {/* <FloatingImages /> */}
        <div className="flex flex-col  w-[90%] gap-y-2">
          <button className="bg-[#ffc894] px-5 py-2 rounded-full hover:shadow-md">
            <Link href="/restaurant">
              <span className="text-black text-lg font-bold ">
                Select your welcome drink and let us take care of the rest.
              </span>
            </Link>
          </button>
          <p className="text-white text-base font-medium text-justify">
            From delicious meals to everyday essentials and complimentary
            services — simply tap into our digital menu and have it all
            delivered straight to your room, quickly and hassle-free.
          </p>
        </div>
      </div>
      <div className="flex flex-col overflow-x-auto snap-x snap-mandatory w-[90%] gap-y-3">
        <Link href="/complimentary">
          <div className="flex justify-between items-center p-4 backdrop-blur-lg bg-[#ffc894] rounded-2xl">
            <Bath size={32} />
            <span className="font-semibold text-xl ">Complimentary</span>
            <ChevronRight size={32} />
          </div>
        </Link>
        <Link href="/shop">
          <div className="flex justify-between items-center p-4 backdrop-blur-lg bg-[#ffc894] rounded-2xl">
            <BriefcaseBusiness size={32} />
            <span className="font-semibold text-xl ">Essentials</span>
            <ChevronRight size={32} />
          </div>
        </Link>
        <Link href="/restaurant">
          <div className="flex justify-between items-center p-4 backdrop-blur-lg bg-[#ffc894] rounded-2xl">
            <ConciergeBell size={32} />
            <span className="font-semibold text-xl ">Restaurant</span>
            <ChevronRight size={32} />
          </div>
        </Link>
      </div>

      <div className="flex flex-col w-[90%] bg-transparent border-2 border-black rounded-lg  items-center py-4 px-2 text-center">
        <span className="uppercase text-xl text-black font-semibold">
          Try our best sellers
        </span>
        <Recommendations category="restaurant" />
      </div>
    </div>
  );
}
