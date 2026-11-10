"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useApp } from "@/lib/store";
import { Role } from "@/lib/types";

export interface DashboardNavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardShellProps {
  role: Role;
  nav: DashboardNavItem[];
  children: React.ReactNode;
}

function Spinner({ label }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <span className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        {label ? <p className="text-sm text-gray-500">{label}</p> : null}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardShell({ role, nav, children }: DashboardShellProps) {
  const { hydrated, currentUser, logout, cartCount } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace("/login");
    } else if (currentUser.role !== role) {
      router.replace(`/dashboard/${currentUser.role}`);
    }
  }, [hydrated, currentUser, role, router]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!hydrated || !currentUser || currentUser.role !== role) {
    return <Spinner label="Loading your workspace..." />;
  }

  const active =
    [...nav]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    nav[0];

  const sidebar = (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-lg font-black text-gray-900">
          B
        </span>
        <div>
          <p className="text-base font-bold leading-none">Bookshelf</p>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-gray-400">
            {role} panel
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.name}</span>
              {role === "user" && item.href.endsWith("/cart") && cartCount > 0 ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isActive ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  {cartCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/books"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          Visit store
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 md:block">
        {sidebar}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">{sidebar}</div>
        </div>
      ) : null}

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-gray-900">
              {active?.name ?? "Dashboard"}
            </p>
            <p className="hidden text-xs text-gray-500 sm:block">
              {role === "admin"
                ? "Manage your store, orders and customers"
                : "Your personal reading space"}
            </p>
          </div>

          {role === "user" ? (
            <Link
              href="/dashboard/user/cart"
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              aria-label="Cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          ) : null}

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 py-1.5 pl-1.5 pr-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gray-900 text-xs font-bold text-white">
              {initials(currentUser.name)}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {currentUser.name}
              </p>
              <p className="text-[11px] capitalize text-gray-500">
                {currentUser.role}
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
