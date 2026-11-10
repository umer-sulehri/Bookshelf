"use client";

import React from "react";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useApp, formatPrice } from "@/lib/store";
import { Book, NewBook } from "@/lib/types";
import { BOOK_IMAGES, CATEGORIES } from "@/lib/data";

interface BookFormState {
  title: string;
  author: string;
  category: string;
  price: number;
  offPrice: number;
  stock: number;
  rating: number;
  desc: string;
  img: string;
}

const EMPTY_FORM: BookFormState = {
  title: "",
  author: "",
  category: CATEGORIES[0],
  price: 0,
  offPrice: 0,
  stock: 0,
  rating: 4.5,
  desc: "",
  img: BOOK_IMAGES[0],
};

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900";

export default function AdminBooksPage() {
  const { books, addBook, updateBook, deleteBook } = useApp();
  const [query, setQuery] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<BookFormState>(EMPTY_FORM);
  const [error, setError] = React.useState("");

  const filtered = books.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price,
      offPrice: book.offPrice ?? 0,
      stock: book.stock,
      rating: book.rating,
      desc: book.desc,
      img: book.img,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required.");
      return;
    }
    if (form.price <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    const payload: NewBook = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category,
      price: form.price,
      offPrice: form.offPrice > 0 ? form.offPrice : undefined,
      stock: Math.max(0, Math.floor(form.stock)),
      rating: form.rating,
      desc: form.desc.trim() || "No description provided.",
      img: form.img,
    };

    if (editingId) {
      updateBook({ ...payload, id: editingId });
    } else {
      addBook(payload);
    }
    setModalOpen(false);
  };

  const handleDelete = (book: Book) => {
    const confirmed = window.confirm(
      `Delete "${book.title}"? This cannot be undone.`
    );
    if (confirmed) deleteBook(book.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Book catalog
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {books.length} titles in your store.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
        >
          <PlusIcon className="h-4 w-4" />
          Add book
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <div className="relative max-w-sm">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search books..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Book</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Rating</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                        <Image
                          src={book.img}
                          alt={book.title}
                          width={80}
                          height={110}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{book.category}</td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-gray-900">
                      {formatPrice(book.offPrice ?? book.price)}
                    </span>
                    {book.offPrice ? (
                      <span className="ml-2 text-xs text-gray-400 line-through">
                        {formatPrice(book.price)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        book.stock === 0
                          ? "bg-red-100 text-red-700"
                          : book.stock <= 8
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {book.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {book.rating.toFixed(1)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(book)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Edit book"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(book)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete book"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No books match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setModalOpen(false)}
          />
          <form
            onSubmit={handleSubmit}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit book" : "Add new book"}
                </h2>
                <p className="text-sm text-gray-500">
                  Update the details customers see in the store.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                  placeholder="The Night Before Kindergarten"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Author
                </label>
                <input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className={inputClass}
                  placeholder="Natasha Wing"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputClass}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Price ($)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Sale price ($, optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.offPrice}
                  onChange={(e) =>
                    setForm({ ...form, offPrice: Number(e.target.value) })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Stock
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Rating
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Cover image
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BOOK_IMAGES.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setForm({ ...form, img })}
                      className={`h-16 w-12 overflow-hidden rounded border-2 transition-colors ${
                        form.img === img
                          ? "border-gray-900"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img}
                        alt="Cover option"
                        width={80}
                        height={110}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Short summary shown on the product page..."
                />
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                {editingId ? "Save changes" : "Add book"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
