"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useApp } from "@/lib/store";
import { Role } from "@/lib/types";

export default function LoginPage() {
  const { hydrated, currentUser, login } = useApp();
  const router = useRouter();
  const [email, setEmail] = React.useState("alex@example.com");
  const [password, setPassword] = React.useState("demo1234");

  const handleLogin = (role: Role) => {
    const account = login(role);
    if (account) {
      router.push(`/dashboard/${role}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-gray-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/5 blur-2xl" />

          <Link href="/" className="relative flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg font-black text-gray-900">
              B
            </span>
            <span className="text-xl font-bold">Bookshelf</span>
          </Link>

          <div className="relative">
            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Welcome back to your reading universe.
            </h1>
            <p className="mt-4 max-w-md text-sm text-gray-300">
              Sign in to browse exclusive offers, track your orders, and manage
              your wishlist. One account, endless stories.
            </p>

            <div className="mt-10 flex gap-4">
              {[
                "/image/books/RectangleBig1.svg",
                "/image/books/RectangleBig3.svg",
                "/image/books/RectangleBig5.svg",
                "/image/books/RectangleBig7.svg",
              ].map((src) => (
                <div
                  key={src}
                  className="h-28 w-20 overflow-hidden rounded-lg shadow-lg ring-1 ring-white/20"
                >
                  <Image
                    src={src}
                    alt="Book cover"
                    width={160}
                    height={230}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Bookshelf. All rights reserved.
          </p>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gray-900 text-lg font-black text-white">
                  B
                </span>
                <span className="text-xl font-bold text-gray-900">Bookshelf</span>
              </Link>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose a demo role below to jump straight into a dashboard.
            </p>

            {hydrated && currentUser ? (
              <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <span>
                  Signed in as <strong>{currentUser.name}</strong>
                </span>
                <Link
                  href={`/dashboard/${currentUser.role}`}
                  className="font-semibold underline"
                >
                  Continue
                </Link>
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => handleLogin("admin")}
                disabled={!hydrated}
                className="flex w-full items-center justify-between rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Continue as Admin
                </span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleLogin("user")}
                disabled={!hydrated}
                className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50 disabled:opacity-60"
              >
                <span className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Continue as User
                </span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Demo mode
              </span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              No password required. Admin sees store management, User sees a
              personal dashboard.
            </p>
            <p className="mt-6 text-center text-sm text-gray-500">
              <Link href="/" className="font-semibold text-gray-900 hover:underline">
                &larr; Back to store
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
