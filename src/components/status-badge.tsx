import React from "react";

const ORDER_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  processing: "bg-blue-100 text-blue-800 ring-blue-200",
  shipped: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  cancelled: "bg-red-100 text-red-700 ring-red-200",
  active: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  blocked: "bg-red-100 text-red-700 ring-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  const style =
    ORDER_STYLES[status.toLowerCase()] ?? "bg-gray-100 text-gray-700 ring-gray-200";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export default StatusBadge;
