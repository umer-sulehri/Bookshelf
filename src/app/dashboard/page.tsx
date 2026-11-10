"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function DashboardIndex() {
  const { hydrated, currentUser } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (!hydrated) return;
    router.replace(currentUser ? `/dashboard/${currentUser.role}` : "/login");
  }, [hydrated, currentUser, router]);

  return (
    <div className="grid min-h-screen place-items-center bg-gray-50">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
    </div>
  );
}
