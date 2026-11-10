"use client";

import { Navbar, Footer } from "@/components";
import CartView from "@/components/cart-view";

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-10 sm:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Shopping cart
        </h1>
        <p className="mt-1 mb-8 text-sm text-gray-500">
          Review your items and complete checkout.
        </p>
        <CartView />
      </main>
      <Footer />
    </>
  );
}
