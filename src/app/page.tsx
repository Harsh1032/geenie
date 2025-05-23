import FloatingImages from "@/components/FloatingImages";
import HotelImageSlider from "@/components/HotelImageSlider";
import Recommendations from "@/components/Recommendations";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-y-4 mb-5">
      <div className="flex flex-col items-center w-full gap-y-2">
        <HotelImageSlider />

        <FloatingImages />
        <div className="flex flex-col  w-[95%] gap-y-2">
          <h1 className="text-balck text-3xl font-semibold">
            Welcome to Hotel Gennie
          </h1>
          <p className="text-balck text-base font-normal text-justify">
            Thanks for staying with us! You can order items from our kitty
            whether its a delicious dish from our kitchen or a essential kit or
            an complimentary service at your doorstep and that too in less than
            10 mins.
          </p>
          <button className="bg-[#ff493d] px-5 py-2 rounded-md hover:shadow-md">
            <Link href="/restaurant">
              <span className="text-white text-lg font-semibold ">
                Shop now
              </span>
            </Link>
          </button>
        </div>
      </div>
      <div className="flex flex-col overflow-x-auto snap-x snap-mandatory w-[95%] gap-y-3">
        {/* Card 1 */}
        <div className="snap-center flex-shrink-0 w-full h-[175px] p-2 backdrop-blur-lg bg-white border-gray-200 border-2 rounded-2xl">
          <div className="w-full bg-opacity-50 text-black rounded-b-lg px-3 gap-y-2">
            <span className="font-semibold text-xl ">
              Complimentary Products
            </span>
            <p className="font-normal text-base mt-2 text-justify">
              We provide no of products to make your stay memorable with us by
              providing as much a products as complimentary with you stay..
              Order No
            </p>
            <Link href="/complimentary">
              <span className="text-xl text-blue-500">Complimentary</span>
            </Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="snap-center flex-shrink-0 w-full h-[175px] p-2 backdrop-blur-lg bg-white border-gray-200 border-2 rounded-2xl">
          <div className="w-full bg-opacity-50 text-black rounded-b-lg px-3 gap-y-2">
            <span className="font-semibold text-xl ">Essentials Products</span>
            <p className="font-normal text-base mt-2 text-justify">
              We provide no of products that you will be required during your
              visit with us (prepaid)
            </p>
            <Link href="/shop">
              <span className="text-xl text-blue-500">Essentials</span>
            </Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="snap-center flex-shrink-0 w-full h-[175px] p-2 backdrop-blur-lg bg-white border-gray-200 border-2 rounded-2xl">
          <div className="w-full bg-opacity-50 text-black rounded-b-lg px-3 gap-y-2">
            <span className="font-semibold text-xl ">Restaurent</span>
            <p className="font-normal text-base mt-2 text-justify">
              We provide no of delicious items from our Chef (prepaid)
            </p>
            <Link href="/restaurant">
              <span className="text-xl text-blue-500">Restaurant</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full bg-gray-200 items-center py-5">
        <h3 className="uppercase text-2xl text-black font-semibold">
          Just in!
        </h3>
        <span>Browse our new products</span>
        <Recommendations category="essentials" />
      </div>

      <div className="flex flex-col w-full bg-gray-200 items-center py-5 text-center">
        <span className="uppercase text-xl text-black font-semibold">
          Try our bestsellers
        </span>
        <p className="px-5">
          At our shop, we believe in the power of herbs to heal and nourish the
          body. That's why we've carefully curated a selection of the finest
          herbal teas from around the world. From refreshing mint to soothing
          chamomile, we have a tea for every mood and occasion.
        </p>
        <Recommendations category="restaurant" />
      </div>
    </div>
  );
}
