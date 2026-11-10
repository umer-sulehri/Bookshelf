"use client";

import React from "react";
import { MagnifyingGlassIcon, NoSymbolIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { useApp, formatPrice } from "@/lib/store";
import { StatusBadge } from "@/components/status-badge";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminUsersPage() {
  const { users, orders, toggleUserStatus, currentUser } = useApp();
  const [query, setQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");

  const filtered = users.filter((user) => {
    const matchesQuery =
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Customers
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {users.filter((u) => u.role === "user").length} customers registered.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-4">
          <div className="relative max-w-sm flex-1">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or email..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-900"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-gray-900"
          >
            <option value="all">All roles</option>
            <option value="admin">Admins</option>
            <option value="user">Customers</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[54rem] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Orders</th>
                <th className="px-5 py-3 font-semibold">Spent</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => {
                const userOrders = orders.filter((o) => o.userId === user.id);
                const spent = userOrders
                  .filter((o) => o.status !== "cancelled")
                  .reduce((sum, o) => sum + o.total, 0);
                const isSelf = currentUser?.id === user.id;
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-gray-900 text-xs font-bold text-white">
                          {initials(user.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            {user.name}
                            {isSelf ? (
                              <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
                                You
                              </span>
                            ) : null}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          user.role === "admin"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{user.joined}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {userOrders.length}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      {formatPrice(spent)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        {user.role === "admin" ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(user.id)}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                              user.status === "active"
                                ? "text-red-600 hover:bg-red-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {user.status === "active" ? (
                              <>
                                <NoSymbolIcon className="h-3.5 w-3.5" />
                                Block
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                                Activate
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No users match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
