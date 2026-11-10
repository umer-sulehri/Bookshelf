"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useApp, formatPrice } from "@/lib/store";

export function CartView() {
  const {
    hydrated,
    currentUser,
    cart,
    books,
    cartTotal,
    setQty,
    removeFromCart,
    placeOrder,
  } = useApp();
  const router = useRouter();
  const [address, setAddress] = React.useState(
    "12 Oak Street, Springfield, IL 62704"
  );
  const [error, setError] = React.useState("");

  const detailed = cart
    .map((item) => {
      const book = books.find((b) => b.id === item.bookId);
      return book ? { book, qty: item.qty } : null;
    })
    .filter((entry): entry is { book: (typeof books)[number]; qty: number } => entry !== null);

  const handleCheckout = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (detailed.length === 0) return;
    if (!address.trim()) {
      setError("Please enter a shipping address.");
      return;
    }
    const order = placeOrder(address.trim());
    if (order) {
      router.push("/dashboard/user/orders");
    }
  };

  if (!hydrated) {
    return (
      <div className="grid place-items-center rounded-2xl border border-gray-200 bg-white py-24">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  if (detailed.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gray-100">
          <ShoppingBagIcon className="h-7 w-7 text-gray-400" />
        </div>
        <p className="mt-4 text-lg font-bold text-gray-900">Your cart is empty</p>
        <p className="mt-1 max-w-sm px-4 text-sm text-gray-500">
          Browse our collection and add a few books to get started.
        </p>
        <Link
          href="/books"
          className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-4">
        {detailed.map(({ book, qty }) => (
          <div
            key={book.id}
            className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <Link
              href={`/books/${book.id}`}
              className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
            >
              <Image
                src={book.img}
                alt={book.title}
                width={200}
                height={260}
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                    {book.category}
                  </p>
                  <Link href={`/books/${book.id}`}>
                    <h3 className="truncate text-sm font-bold text-gray-900 hover:text-blue-700">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(book.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove item"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setQty(book.id, qty - 1)}
                    className="grid h-8 w-8 place-items-center text-gray-600 hover:text-gray-900"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-900">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(book.id, qty + 1)}
                    className="grid h-8 w-8 place-items-center text-gray-600 hover:text-gray-900"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatPrice((book.offPrice ?? book.price) * qty)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <Link
          href="/books"
          className="inline-block text-sm font-semibold text-blue-700 hover:underline"
        >
          &larr; Continue shopping
        </Link>
      </div>

      <div className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900">Order summary</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <dt>Subtotal</dt>
            <dd className="font-medium text-gray-900">{formatPrice(cartTotal)}</dd>
          </div>
          <div className="flex justify-between text-gray-600">
            <dt>Shipping</dt>
            <dd className="font-medium text-emerald-600">Free</dd>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
            <dt>Total</dt>
            <dd>{formatPrice(cartTotal)}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Shipping address
          </label>
          <textarea
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setError("");
            }}
            rows={3}
            className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none focus:border-gray-900"
          />
          {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>

        {currentUser?.role === "admin" ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            You are signed in as an admin. Checkout is available for customer
            accounts.
          </p>
        ) : null}

        {!currentUser ? (
          <p className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
            You need to sign in before placing an order.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={currentUser?.role === "admin"}
          className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            currentUser?.role === "admin"
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {!currentUser
            ? "Sign in to checkout"
            : currentUser.role === "admin"
            ? "Admin account"
            : "Place order"}
        </button>
      </div>
    </div>
  );
}

export default CartView;
