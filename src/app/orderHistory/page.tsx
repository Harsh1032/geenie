// src/app/orderHistory/page.tsx
"use client";

import { Suspense } from "react";
import OrderHistoryContent from "./OrderHistoryContent";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading your orders...</div>}>
      <OrderHistoryContent />
    </Suspense>
  );
};

export default Page;
