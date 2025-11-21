import { z } from "zod";

// Zod schemas for validation
export const insertCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.number().default(0),
});

export const insertMenuItemSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  image: z.string().optional(),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const insertOrderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  customerAddress: z.string().optional(),
  deliveryType: z.enum(["delivery", "pickup"]),
  totalAmount: z.number().positive("Total amount must be positive"),
  status: z.string().default('pending'),
  items: z.string(),
});

// TypeScript types (matching the existing API interface)
export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  order: number;
};

export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  available: number;
  featured: number;
  order: number;
};

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  deliveryType: string;
  totalAmount: string;
  status: string;
  items: string;
  createdAt: string;
};

export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Cart item type (used in frontend)
export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};
