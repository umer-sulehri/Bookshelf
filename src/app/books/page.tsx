"use client";

import { Navbar, Footer } from "@/components";
import BookShop from "@/components/book-shop";

export default function BooksPage() {
  return (
    <>
      <Navbar />
      <header className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-8 py-12">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">
            Up to 40% off
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore the Bookshelf
          </h1>
          <p className="mt-3 max-w-xl text-sm text-gray-500 sm:text-base">
            Discover textbooks, bestsellers, and timeless classics. Filter by
            category, search your favourites, and build your personal library.
          </p>
        </div>
      </header>
      <section className="container mx-auto px-6 py-10 sm:px-8">
        <BookShop />
      </section>
      <Footer />
    </>
  );
}
