export type Role = "admin" | "user";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type UserStatus = "active" | "blocked";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  offPrice?: number;
  desc: string;
  img: string;
  stock: number;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  joined: string;
  status: UserStatus;
}

export interface CartItem {
  bookId: string;
  qty: number;
}

export interface OrderItem {
  bookId: string;
  title: string;
  price: number;
  qty: number;
  img: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
}

export interface NewBook {
  title: string;
  author: string;
  category: string;
  price: number;
  offPrice?: number;
  desc: string;
  img: string;
  stock: number;
  rating: number;
}
