"use client";

import React from "react";
import Image from "next/image";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useApp, formatPrice } from "@/lib/store";
import { StatusBadge } from "@/components/status-badge";
import { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useApp();
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Order | null>(null);

  const filtered = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesQuery =
      order.id.toLowerCase().includes(query.toLowerCase()) ||
      order.userName.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const counts = STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = orders.filter((order) => order.status === status).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and update the status of every customer order.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
            statusFilter === "all"
              ? "bg-gray-900 text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${
              statusFilter === status
                ? "bg-gray-900 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            {status} ({counts[status] ?? 0})
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <div className="relative max-w-sm">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order or customer..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[58rem] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{order.userName}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {order.items.reduce((sum, item) => sum + item.qty, 0)}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{order.date}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateOrderStatus(
                          order.id,
                          event.target.value as OrderStatus
                        )
                      }
                      className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium capitalize text-gray-700 outline-none focus:border-gray-900"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setSelected(order)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        aria-label="View order details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No orders match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setSelected(null)}
          />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selected.id}
                </h2>
                <p className="text-sm text-gray-500">
                  {selected.userName} &middot; {selected.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <StatusBadge status={selected.status} />
              <span className="text-sm font-semibold text-gray-900">
                {formatPrice(selected.total)}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {selected.items.map((item) => (
                <div
                  key={item.bookId}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-2"
                >
                  <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={80}
                      height={110}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.qty} &times; {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Shipping address
              </p>
              <p className="mt-1 text-sm text-gray-700">{selected.address}</p>
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Update status
              </label>
              <select
                value={selected.status}
                onChange={(event) => {
                  const status = event.target.value as OrderStatus;
                  updateOrderStatus(selected.id, status);
                  setSelected({ ...selected, status });
                }}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-gray-900"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
