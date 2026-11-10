"use client";

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useApp, formatPrice } from "@/lib/store";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserProfilePage() {
  const { currentUser, orders, updateProfile } = useApp();
  const [name, setName] = React.useState(currentUser?.name ?? "");
  const [email, setEmail] = React.useState(currentUser?.email ?? "");
  const [saved, setSaved] = React.useState(false);

  const myOrders = currentUser
    ? orders.filter((order) => order.userId === currentUser.id)
    : [];
  const spent = myOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile({ name: name.trim() || currentUser?.name, email: email.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account details.
        </p>
      </div>

      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          <CheckCircleIcon className="h-5 w-5" />
          Profile updated.
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gray-900 text-xl font-bold text-white">
            {initials(currentUser?.name ?? "U")}
          </span>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {currentUser?.name}
            </p>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-gray-100 px-2 py-0.5 font-semibold capitalize text-gray-700">
                {currentUser?.role}
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold capitalize text-emerald-800">
                {currentUser?.status}
              </span>
              <span className="text-gray-500">
                Joined {currentUser?.joined}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Orders
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {myOrders.length}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Total spent
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {formatPrice(spent)}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Member since
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {currentUser?.joined?.slice(0, 4)}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-base font-bold text-gray-900">Account details</h2>
          <p className="text-sm text-gray-500">
            These details appear on your orders.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Full name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Save profile
          </button>
        </div>
      </form>
    </div>
  );
}
