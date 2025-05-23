

import Marquee from "react-fast-marquee";

export default function FloatingImages() {
  return (
    <div className="w-full py-6 bg-white">
      <Marquee
        speed={50}          // adjust speed (higher = faster)
        gradient={false}     // disable dark gradient edges
        pauseOnHover={true}  // stop moving when hovered
      >
        <img src="/item.png" alt="Item 1" className="h-40 w-72 mx-4" />
        <img src="/item2.png" alt="Item 2" className="h-40 w-72 mx-4" />
        <img src="/item3.png" alt="Item 3" className="h-40 w-72 mx-4" />
        <img src="/item4.png" alt="Item 4" className="h-40 w-72 mx-4" />
      </Marquee>
    </div>
  );
}
