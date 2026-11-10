"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useApp, formatPrice } from "@/lib/store";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOverviewPage() {
  const { books, orders, users } = useApp();

  const customers = users.filter((u) => u.role === "user");
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter((order) => order.status === "pending").length;
  const lowStock = [...books]
    .filter((book) => book.stock <= 8)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);
  const recent = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Store overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A snapshot of your bookstore performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/admin/books"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:border-gray-900"
          >
            Manage books
          </Link>
          <Link
            href="/dashboard/admin/orders"
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            View orders
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatPrice(revenue)}
          hint={`${orders.length} orders all time`}
          icon={CurrencyDollarIcon}
          tone="bg-emerald-600 text-white"
        />
        <StatCard
          label="Orders"
          value={orders.length}
          hint={`${pending} awaiting processing`}
          icon={ShoppingBagIcon}
          tone="bg-blue-600 text-white"
        />
        <StatCard
          label="Books"
          value={books.length}
          hint={`${lowStock.length} need restocking`}
          icon={BookOpenIcon}
          tone="bg-gray-900 text-white"
        />
        <StatCard
          label="Customers"
          value={customers.length}
          hint={`${customers.filter((u) => u.status === "active").length} active accounts`}
          icon={UsersIcon}
          tone="bg-indigo-600 text-white"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-bold text-gray-900">Recent orders</h2>
              <Link
                href="/dashboard/admin/orders"
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Order</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recent.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-semibold text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{order.userName}</td>
                      <td className="px-5 py-3 text-gray-500">{order.date}</td>
                      <td className="px-5 py-3 font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                  {recent.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-sm text-gray-500"
                      >
                        No orders yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-gray-900">Low stock</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {lowStock.map((book) => (
                <li key={book.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {book.title}
                    </p>
                    <p className="text-xs text-gray-500">{book.category}</p>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      book.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {book.stock} left
                  </span>
                </li>
              ))}
              {lowStock.length === 0 ? (
                <li className="text-sm text-gray-500">All books are well stocked.</li>
              ) : null}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900">Order status</h2>
            <ul className="mt-4 space-y-3">
              {STATUSES.map((status) => {
                const count = orders.filter((o) => o.status === status).length;
                const pct = orders.length
                  ? Math.round((count / orders.length) * 100)
                  : 0;
                return (
                  <li key={status}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium capitalize text-gray-600">
                        {status}
                      </span>
                      <span className="text-gray-500">{count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-900"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
