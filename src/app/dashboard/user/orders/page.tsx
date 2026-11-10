"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp, formatPrice } from "@/lib/store";
import { StatusBadge } from "@/components/status-badge";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";

const FILTERS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

export default function UserOrdersPage() {
  const { currentUser, orders } = useApp();
  const [filter, setFilter] = React.useState("all");

  const myOrders = currentUser
    ? orders.filter((order) => order.userId === currentUser.id)
    : [];

  const filtered =
    filter === "all"
      ? myOrders
      : myOrders.filter((order) => order.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          My orders
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track delivery status and review past purchases.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${
              filter === status
                ? "bg-gray-900 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gray-100">
            <ShoppingBagIcon className="h-7 w-7 text-gray-400" />
          </div>
          <p className="mt-4 text-lg font-bold text-gray-900">No orders here</p>
          <p className="mt-1 max-w-sm px-4 text-sm text-gray-500">
            {filter === "all"
              ? "When you place an order it will appear here for tracking."
              : `You have no ${filter} orders right now.`}
          </p>
          <Link
            href="/dashboard/user/books"
            className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Browse books
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-3">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">
                      Order
                    </p>
                    <p className="text-sm font-bold text-gray-900">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">
                      Placed
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {order.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">
                      Total
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <ul className="divide-y divide-gray-100 px-5">
                {order.items.map((item) => (
                  <li
                    key={item.bookId}
                    className="flex items-center gap-4 py-3"
                  >
                    <Link
                      href={`/books/${item.bookId}`}
                      className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100"
                    >
                      <Image
                        src={item.img}
                        alt={item.title}
                        width={90}
                        height={120}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/books/${item.bookId}`}
                        className="truncate text-sm font-semibold text-gray-900 hover:text-blue-700"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Qty {item.qty} &middot; {formatPrice(item.price)} each
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 px-5 py-3">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">
                    Ship to:
                  </span>{" "}
                  {order.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
