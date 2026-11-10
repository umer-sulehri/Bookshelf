"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { useApp, formatPrice } from "@/lib/store";

export default function UserWishlistPage() {
  const { books, wishlist, toggleWishlist, addToCart } = useApp();
  const [added, setAdded] = React.useState<string | null>(null);

  const items = books.filter((book) => wishlist.includes(book.id));

  const handleAdd = (id: string) => {
    addToCart(id);
    setAdded(id);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Wishlist
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {items.length} {items.length === 1 ? "book" : "books"} saved for later.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gray-100">
            <HeartIcon className="h-7 w-7 text-gray-400" />
          </div>
          <p className="mt-4 text-lg font-bold text-gray-900">
            Your wishlist is empty
          </p>
          <p className="mt-1 max-w-sm px-4 text-sm text-gray-500">
            Tap the heart on any book to save it here for later.
          </p>
          <Link
            href="/dashboard/user/books"
            className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Discover books
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((book) => (
            <div
              key={book.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Link href={`/books/${book.id}`}>
                  <Image
                    src={book.img}
                    alt={book.title}
                    width={500}
                    height={380}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWishlist(book.id)}
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow"
                  aria-label="Remove from wishlist"
                >
                  <HeartIcon className="h-5 w-5 text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                    {book.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <StarIcon className="h-3.5 w-3.5 text-amber-400" />
                    {book.rating.toFixed(1)}
                  </span>
                </div>
                <Link href={`/books/${book.id}`}>
                  <h3 className="mt-1 line-clamp-2 text-sm font-bold text-gray-900 hover:text-blue-700">
                    {book.title}
                  </h3>
                </Link>
                <p className="mt-1 text-xs text-gray-500">{book.author}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">
                    {formatPrice(book.offPrice ?? book.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdd(book.id)}
                    disabled={book.stock <= 0}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white ${
                      book.stock <= 0
                        ? "cursor-not-allowed bg-gray-300"
                        : added === book.id
                        ? "bg-emerald-600"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    {book.stock <= 0
                      ? "Out of stock"
                      : added === book.id
                      ? "Added"
                      : "Add to cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
