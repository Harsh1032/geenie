// src/app/orderHistory/page.tsx
"use client";

import { Suspense } from "react";
import Restaurant from "./Restaurant";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading your orders...</div>}>
      <Restaurant/>
    </Suspense>
  );
};

export default Page;
