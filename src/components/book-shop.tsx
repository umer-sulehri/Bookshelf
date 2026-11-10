"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { useApp, formatPrice } from "@/lib/store";
import { Book } from "@/lib/types";
import { CATEGORIES } from "@/lib/data";

interface BookShopProps {
  heading?: string;
  subheading?: string;
}

function BookTile({ book }: { book: Book }) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [added, setAdded] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const wished = wishlist.includes(book.id);
  const outOfStock = book.stock <= 0;

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleAdd = () => {
    addToCart(book.id);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link href={`/books/${book.id}`}>
          <Image
            src={book.img}
            alt={book.title}
            width={600}
            height={800}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(book.id)}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          <HeartIcon
            className={`h-5 w-5 ${
              wished ? "text-red-500" : "text-gray-400"
            }`}
          />
        </button>
        {book.stock <= 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-semibold text-white">
            Out of stock
          </span>
        ) : book.stock <= 5 ? (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white">
            Only {book.stock} left
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
            {book.category}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
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

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(book.offPrice ?? book.price)}
          </span>
          {book.offPrice ? (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(book.price)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
            outOfStock
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : added
              ? "bg-emerald-600 text-white"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          <ShoppingCartIcon className="h-4 w-4" />
          {outOfStock ? "Unavailable" : added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

export function BookShop({ heading, subheading }: BookShopProps) {
  const { books } = useApp();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");

  const filtered = books.filter((book) => {
    const matchesQuery =
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || book.category === category;
    return matchesQuery && matchesCategory;
  });

  const chips = ["All", ...CATEGORIES];

  return (
    <div>
      {(heading || subheading) && (
        <div className="mb-6">
          {heading ? (
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {heading}
            </h2>
          ) : null}
          {subheading ? (
            <p className="mt-1 text-sm text-gray-500">{subheading}</p>
          ) : null}
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or author..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900"
          />
        </div>
        <p className="text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "book" : "books"}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setCategory(chip)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              category === chip
                ? "bg-gray-900 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm font-medium text-gray-900">No books found</p>
          <p className="mt-1 text-sm text-gray-500">
            Try a different search term or category.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((book) => (
            <BookTile key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookShop;
