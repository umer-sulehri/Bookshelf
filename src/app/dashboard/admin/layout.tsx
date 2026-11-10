"use client";

import React from "react";
import {
  BookOpenIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import DashboardShell, {
  DashboardNavItem,
} from "@/components/dashboard-shell";

const NAV: DashboardNavItem[] = [
  { name: "Overview", href: "/dashboard/admin", icon: Squares2X2Icon },
  { name: "Books", href: "/dashboard/admin/books", icon: BookOpenIcon },
  { name: "Orders", href: "/dashboard/admin/orders", icon: ShoppingBagIcon },
  { name: "Customers", href: "/dashboard/admin/users", icon: UsersIcon },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Cog6ToothIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell role="admin" nav={NAV}>
      {children}
    </DashboardShell>
  );
}
