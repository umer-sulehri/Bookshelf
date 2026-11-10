"use client";

import React from "react";
import {
  BookOpenIcon,
  HeartIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import DashboardShell, {
  DashboardNavItem,
} from "@/components/dashboard-shell";

const NAV: DashboardNavItem[] = [
  { name: "Overview", href: "/dashboard/user", icon: Squares2X2Icon },
  { name: "Browse Books", href: "/dashboard/user/books", icon: BookOpenIcon },
  { name: "My Orders", href: "/dashboard/user/orders", icon: ShoppingBagIcon },
  { name: "Wishlist", href: "/dashboard/user/wishlist", icon: HeartIcon },
  { name: "Cart", href: "/dashboard/user/cart", icon: ShoppingCartIcon },
  { name: "Profile", href: "/dashboard/user/profile", icon: UserCircleIcon },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell role="user" nav={NAV}>
      {children}
    </DashboardShell>
  );
}
