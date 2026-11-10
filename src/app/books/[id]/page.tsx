"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/components";
import { useApp, formatPrice } from "@/lib/store";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";
  const { books, addToCart, toggleWishlist, wishlist, hydrated } = useApp();
  const book = books.find((b) => b.id === id);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <div className="grid min-h-[50vh] place-items-center">
          <span className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
        <Footer />
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto grid min-h-[50vh] place-items-center px-8 text-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book not found</h1>
            <p className="mt-2 text-sm text-gray-500">
              This title may have been removed from the store.
            </p>
            <Link
              href="/books"
              className="mt-5 inline-block rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to shop
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const wished = wishlist.includes(book.id);
  const outOfStock = book.stock <= 0;
  const related = books
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 4);
  const relatedFallback =
    related.length > 0 ? related : books.filter((b) => b.id !== book.id).slice(0, 4);

  const handleAdd = (goToCart = false) => {
    addToCart(book.id, qty);
    if (goToCart) {
      router.push("/cart");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-10 sm:px-8">
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/books" className="hover:text-gray-900">
            Shop
          </Link>
          <span>/</span>
          <span className="truncate font-medium text-gray-900">{book.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex justify-center rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-10">
            <div className="h-[22rem] w-[17rem] overflow-hidden rounded-xl shadow-xl sm:h-[26rem] sm:w-[20rem]">
              <Image
                src={book.img}
                alt={book.title}
                width={600}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {book.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {book.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              by <span className="font-medium text-gray-700">{book.author}</span>
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${
                      star < Math.round(book.rating)
                        ? "text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {book.rating.toFixed(1)} rating
              </span>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-600">
              {book.desc}
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(book.offPrice ?? book.price)}
              </span>
              {book.offPrice ? (
                <>
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(book.price)}
                  </span>
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">
                    Save {formatPrice(book.price - book.offPrice)}
                  </span>
                </>
              ) : null}
            </div>

            <p className="mt-3 text-sm">
              {outOfStock ? (
                <span className="font-semibold text-red-600">Out of stock</span>
              ) : book.stock <= 5 ? (
                <span className="font-semibold text-amber-600">
                  Only {book.stock} left in stock
                </span>
              ) : (
                <span className="font-semibold text-emerald-600">In stock</span>
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="grid h-11 w-11 place-items-center text-gray-600 hover:text-gray-900"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQty((value) => Math.min(book.stock || 1, value + 1))
                  }
                  className="grid h-11 w-11 place-items-center text-gray-600 hover:text-gray-900"
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={outOfStock}
                onClick={() => handleAdd(false)}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${
                  outOfStock
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : added
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <ShoppingCartIcon className="h-4 w-4" />
                {outOfStock ? "Unavailable" : added ? "Added" : "Add to cart"}
              </button>

              <button
                type="button"
                disabled={outOfStock}
                onClick={() => handleAdd(true)}
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Buy now
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(book.id)}
                className="grid h-11 w-11 place-items-center rounded-xl border border-gray-200 transition-colors hover:border-gray-900"
                aria-label="Toggle wishlist"
              >
                <HeartIcon
                  className={`h-5 w-5 ${wished ? "text-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                <TruckIcon className="h-5 w-5 text-gray-700" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Free delivery
                  </p>
                  <p className="text-xs text-gray-500">On all orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                <ShieldCheckIcon className="h-5 w-5 text-gray-700" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Secure checkout
                  </p>
                  <p className="text-xs text-gray-500">30-day returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900">You may also like</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedFallback.map((item) => (
              <Link
                key={item.id}
                href={`/books/${item.id}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={400}
                    height={520}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{item.author}</p>
                  <p className="mt-2 text-sm font-bold text-gray-900">
                    {formatPrice(item.offPrice ?? item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
