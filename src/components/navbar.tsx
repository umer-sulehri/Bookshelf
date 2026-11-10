"use client";

import React from "react";
import Link from "next/link";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  CommandLineIcon,
  XMarkIcon,
  Bars3Icon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { useApp } from "@/lib/store";

const NAV_MENU = [
  {
    name: "Shop",
    icon: RectangleStackIcon,
    href: "/books",
  },
  {
    name: "Dashboard",
    icon: UserCircleIcon,
    href: "/dashboard",
  },
  {
    name: "Docs",
    icon: CommandLineIcon,
    href: "#!",
  },
];

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Link
        href={href || "#"}
        className="flex items-center gap-2 text-sm font-medium text-gray-900 transition-colors hover:text-gray-500"
      >
        {children}
      </Link>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { currentUser, cartCount } = useApp();

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    const handler = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <MTNavbar shadow={false} fullWidth className="border-0 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-blue-gray-900">
          Bookshelf
        </Link>
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href}>
              <Icon className="h-5 w-5" />
              {name}
            </NavItem>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100"
            aria-label="Cart"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
          {currentUser ? (
            <>
              <span className="hidden text-sm font-medium text-gray-500 xl:inline">
                Hi, {currentUser.name.split(" ")[0]}
              </span>
              <Link href={`/dashboard/${currentUser.role}`}>
                <Button color="gray">Dashboard</Button>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button color="gray">Log in</Button>
            </Link>
          )}
        </div>
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
          <div className="mt-6 mb-4 flex items-center gap-2">
            <Link href="/cart">
              <Button variant="text" className="flex items-center gap-2">
                <ShoppingCartIcon className="h-5 w-5" />
                Cart {cartCount > 0 ? `(${cartCount})` : ""}
              </Button>
            </Link>
            {currentUser ? (
              <Link href={`/dashboard/${currentUser.role}`}>
                <Button color="gray">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button color="gray">Log in</Button>
              </Link>
            )}
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
