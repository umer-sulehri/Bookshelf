"use client";

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import {
    Typography,
    Card,
    CardBody,
    CardHeader,
  } from "@material-tailwind/react";
import { useApp } from "@/lib/store";
  
  interface BookCardProps {
    bookId?: string;
    img: string;
    title: string;
    desc: string;
    category: string;
    price: string;
    offPrice?: string;
  }
  
  export function BookCard({
    bookId,
    img,
    category,
    title,
    desc,
    price,
    offPrice,
  }: BookCardProps) {
    const { books, addToCart } = useApp();
    const [added, setAdded] = React.useState(false);
    const storeBook = bookId ? books.find((b) => b.id === bookId) : undefined;
    const outOfStock = storeBook ? storeBook.stock <= 0 : false;
    const href = bookId ? `/books/${bookId}` : "/books";

    const handleAdd = () => {
      if (!bookId) return;
      addToCart(bookId);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    };

    return (
      <Card color="transparent" shadow={false}>
        <CardHeader color="gray" floated={false} className="mx-0 mt-0 mb-6">
          <Link href={href}>
            <Image
              width={768}
              height={768}
              src={img}
              alt={title}
              className="h-full w-full scale-[1.1] object-cover object-center"
            />
          </Link>
        </CardHeader>
        <CardBody className="p-0">
          <Typography color="blue" className="mb-2 text-xs !font-semibold">
            {category}
          </Typography>
          <Link href={href}>
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-3 font-bold normal-case xl:w-64"
            >
              {title}
            </Typography>
          </Link>
          <Typography className="mb-4 font-normal !text-gray-500">
            {desc}
          </Typography>
          <div className="flex gap-2">
            <Typography
              variant="h5"
              color="blue-gray"
              className={offPrice ? "line-through" : ""}
            >
              {price}
            </Typography>
            <Typography variant="h5" color="red">
              {offPrice}
            </Typography>
          </div>
          {bookId ? (
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                outOfStock
                  ? "cursor-not-allowed bg-gray-200 text-gray-500"
                  : added
                  ? "bg-emerald-600"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {outOfStock ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
            </button>
          ) : null}
        </CardBody>
      </Card>
    );
  }
export default BookCard
