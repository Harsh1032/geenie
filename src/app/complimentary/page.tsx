// src/app/orderHistory/page.tsx
"use client";

import { Suspense } from "react";
import Complimentary from "./Complimentary";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading your orders...</div>}>
      <Complimentary/>
    </Suspense>
  );
};

export default Page;
