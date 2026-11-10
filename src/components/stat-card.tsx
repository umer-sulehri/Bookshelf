import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ElementType;
  tone?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "bg-gray-900 text-white",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {hint ? <p className="mt-3 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

export default StatCard;
