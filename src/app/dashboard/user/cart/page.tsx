"use client";

import { CartView } from "@/components/cart-view";

export default function UserCartPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Your cart
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review your books and place your order.
        </p>
      </div>
      <CartView />
    </div>
  );
}
