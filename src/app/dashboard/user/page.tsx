"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpenIcon,
  HeartIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { useApp, formatPrice } from "@/lib/store";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";

export default function UserOverviewPage() {
  const { currentUser, orders, books, wishlist, cartCount, addToCart } = useApp();
  const [added, setAdded] = React.useState<string | null>(null);

  const myOrders = currentUser
    ? orders.filter((order) => order.userId === currentUser.id)
    : [];
  const spent = myOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const recommended = books.slice(0, 4);

  const handleAdd = (id: string) => {
    addToCart(id);
    setAdded(id);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-6 text-white sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Hi, {currentUser?.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 max-w-lg text-sm text-gray-300">
            Pick up where you left off, track your orders, or discover something
            new from the shelves.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/dashboard/user/books"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              <BookOpenIcon className="h-4 w-4" />
              Browse books
            </Link>
            <Link
              href="/dashboard/user/orders"
              className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              My orders
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="My orders"
          value={myOrders.length}
          hint={`${myOrders.filter((o) => o.status === "delivered").length} delivered`}
          icon={ShoppingBagIcon}
          tone="bg-blue-600 text-white"
        />
        <StatCard
          label="Total spent"
          value={formatPrice(spent)}
          hint="Excluding cancelled orders"
          icon={CurrencyDollarIcon}
          tone="bg-emerald-600 text-white"
        />
        <StatCard
          label="Wishlist"
          value={wishlist.length}
          hint="Books saved for later"
          icon={HeartIcon}
          tone="bg-red-500 text-white"
        />
        <StatCard
          label="In cart"
          value={cartCount}
          hint="Ready to checkout"
          icon={ShoppingCartIcon}
          tone="bg-gray-900 text-white"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-bold text-gray-900">Recent orders</h2>
              <Link
                href="/dashboard/user/orders"
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                View all
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {myOrders.slice(0, 4).map((order) => (
                <li
                  key={order.id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.bookId}
                        className="h-11 w-8 overflow-hidden rounded border border-white bg-gray-100"
                      >
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={60}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {order.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.date} &middot; {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                </li>
              ))}
              {myOrders.length === 0 ? (
                <li className="px-5 py-12 text-center">
                  <p className="text-sm text-gray-500">
                    You haven&apos;t placed any orders yet.
                  </p>
                  <Link
                    href="/dashboard/user/books"
                    className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline"
                  >
                    Start shopping
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recommended</h2>
            <Link
              href="/dashboard/user/books"
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              See all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recommended.map((book) => (
              <li key={book.id} className="flex items-center gap-3">
                <Link
                  href={`/books/${book.id}`}
                  className="h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-100"
                >
                  <Image
                    src={book.img}
                    alt={book.title}
                    width={80}
                    height={110}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/books/${book.id}`}
                    className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-blue-700"
                  >
                    {book.title}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {formatPrice(book.offPrice ?? book.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd(book.id)}
                  className={`grid h-8 w-8 place-items-center rounded-lg text-white ${
                    added === book.id ? "bg-emerald-600" : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  aria-label="Add to cart"
                >
                  {added === book.id ? (
                    <span className="text-xs font-bold">✓</span>
                  ) : (
                    <ShoppingCartIcon className="h-4 w-4" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/user/wishlist"
            className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="flex items-center gap-2">
              <HeartIcon className="h-4 w-4 text-red-500" />
              View wishlist
            </span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
