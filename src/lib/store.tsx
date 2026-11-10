"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  NewBook,
  Order,
  OrderItem,
  OrderStatus,
  Role,
  User,
  Book,
  CartItem,
} from "./types";
import { initialBooks, initialOrders, initialUsers } from "./data";

const STORAGE_KEY = "bookshelf-app-state-v1";

interface PersistedState {
  currentUser: User | null;
  users: User[];
  books: Book[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
}

interface AppContextValue extends PersistedState {
  hydrated: boolean;
  cartCount: number;
  cartTotal: number;
  login: (role: Role) => User | null;
  logout: () => void;
  addToCart: (bookId: string, qty?: number) => void;
  removeFromCart: (bookId: string) => void;
  setQty: (bookId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (bookId: string) => void;
  placeOrder: (address: string) => Order | null;
  addBook: (book: NewBook) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateProfile: (data: Partial<Pick<User, "name" | "email">>) => void;
  toggleUserStatus: (id: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        if (parsed.currentUser !== undefined) setCurrentUser(parsed.currentUser);
        if (Array.isArray(parsed.users)) setUsers(parsed.users);
        if (Array.isArray(parsed.books)) setBooks(parsed.books);
        if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
        if (Array.isArray(parsed.cart)) setCart(parsed.cart);
        if (Array.isArray(parsed.wishlist)) setWishlist(parsed.wishlist);
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = {
      currentUser,
      users,
      books,
      orders,
      cart,
      wishlist,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [hydrated, currentUser, users, books, orders, cart, wishlist]);

  const login = useCallback(
    (role: Role) => {
      const demo = users.find((u) => u.role === role) ?? null;
      setCurrentUser(demo);
      return demo;
    },
    [users]
  );

  const logout = useCallback(() => setCurrentUser(null), []);

  const addToCart = useCallback((bookId: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.bookId === bookId);
      if (existing) {
        return prev.map((item) =>
          item.bookId === bookId ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { bookId, qty }];
    });
  }, []);

  const removeFromCart = useCallback((bookId: string) => {
    setCart((prev) => prev.filter((item) => item.bookId !== bookId));
  }, []);

  const setQty = useCallback((bookId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.bookId === bookId ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((bookId: string) => {
    setWishlist((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  }, []);

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const book = books.find((b) => b.id === item.bookId);
        if (!book) return sum;
        return sum + (book.offPrice ?? book.price) * item.qty;
      }, 0),
    [cart, books]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const placeOrder = useCallback(
    (address: string) => {
      if (!currentUser || cart.length === 0) return null;
      const items: OrderItem[] = cart
        .map((item) => {
          const book = books.find((b) => b.id === item.bookId);
          if (!book) return null;
          return {
            bookId: book.id,
            title: book.title,
            price: book.offPrice ?? book.price,
            qty: item.qty,
            img: book.img,
          };
        })
        .filter((item): item is OrderItem => item !== null);

      if (items.length === 0) return null;

      const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const order: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        userId: currentUser.id,
        userName: currentUser.name,
        items,
        total,
        status: "pending",
        date: new Date().toISOString().slice(0, 10),
        address,
      };

      setOrders((prev) => [order, ...prev]);
      setBooks((prev) =>
        prev.map((book) => {
          const line = items.find((item) => item.bookId === book.id);
          return line
            ? { ...book, stock: Math.max(0, book.stock - line.qty) }
            : book;
        })
      );
      setCart([]);
      return order;
    },
    [currentUser, cart, books]
  );

  const addBook = useCallback((book: NewBook) => {
    setBooks((prev) => [
      { ...book, id: `b${Date.now()}` },
      ...prev,
    ]);
  }, []);

  const updateBook = useCallback((book: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setCart((prev) => prev.filter((item) => item.bookId !== id));
    setWishlist((prev) => prev.filter((item) => item !== id));
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  }, []);

  const updateProfile = useCallback(
    (data: Partial<Pick<User, "name" | "email">>) => {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...data };
        setUsers((all) => all.map((u) => (u.id === next.id ? next : u)));
        return next;
      });
    },
    []
  );

  const toggleUserStatus = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  }, []);

  const resetDemoData = useCallback(() => {
    setCurrentUser(null);
    setUsers(initialUsers);
    setBooks(initialBooks);
    setOrders(initialOrders);
    setCart([]);
    setWishlist([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value: AppContextValue = {
    hydrated,
    currentUser,
    users,
    books,
    orders,
    cart,
    wishlist,
    cartCount,
    cartTotal,
    login,
    logout,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    toggleWishlist,
    placeOrder,
    addBook,
    updateBook,
    deleteBook,
    updateOrderStatus,
    updateProfile,
    toggleUserStatus,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
}

export function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}
