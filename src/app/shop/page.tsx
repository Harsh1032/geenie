// src/app/orderHistory/page.tsx
"use client";

import { Suspense } from "react";
import Shop from "./Shop";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading your orders...</div>}>
      <Shop/>
    </Suspense>
  );
};

export default Page;
