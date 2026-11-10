"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { useApp } from "@/lib/store";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900";

export default function AdminSettingsPage() {
  const { resetDemoData } = useApp();
  const router = useRouter();
  const [saved, setSaved] = React.useState(false);
  const [store, setStore] = React.useState({
    name: "Bookshelf",
    email: "support@bookshelf.com",
    currency: "USD",
    freeShipping: true,
  });

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all demo data? This clears orders, cart, accounts and restores the default catalog."
    );
    if (!confirmed) return;
    resetDemoData();
    router.replace("/login");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Store settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your storefront preferences (demo only).
        </p>
      </div>

      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          <CheckCircleIcon className="h-5 w-5" />
          Settings saved.
        </div>
      ) : null}

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-base font-bold text-gray-900">General</h2>
          <p className="text-sm text-gray-500">
            Basic information about your bookstore.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Store name
            </label>
            <input
              value={store.name}
              onChange={(e) => setStore({ ...store, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Support email
            </label>
            <input
              type="email"
              value={store.email}
              onChange={(e) => setStore({ ...store, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Currency
            </label>
            <select
              value={store.currency}
              onChange={(e) => setStore({ ...store, currency: e.target.value })}
              className={inputClass}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <span className="font-medium text-gray-700">Free shipping</span>
              <input
                type="checkbox"
                checked={store.freeShipping}
                onChange={(e) =>
                  setStore({ ...store, freeShipping: e.target.checked })
                }
                className="h-4 w-4 accent-gray-900"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Save changes
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Reset demo data</h2>
        <p className="mt-1 text-sm text-gray-500">
          Restore the original catalog, orders and account list. This is useful
          when you want to demo the flow from a clean slate.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Reset all data
        </button>
      </div>
    </div>
  );
}
