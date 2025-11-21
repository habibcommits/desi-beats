import mongoose, { Schema, Document } from "mongoose";

// MongoDB Document Interfaces
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
}

export interface IMenuItem extends Document {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  available: boolean;
  featured: boolean;
  order: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deliveryType: "delivery" | "pickup";
  totalAmount: number;
  status: string;
  items: string;
  createdAt: Date;
}

// Mongoose Schemas
const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  order: { type: Number, required: true, default: 0 },
});

const menuItemSchema = new Schema<IMenuItem>({
  categoryId: { type: String, required: true, ref: 'Category' },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  available: { type: Boolean, required: true, default: true },
  featured: { type: Boolean, required: true, default: false },
  order: { type: Number, required: true, default: 0 },
});

const orderSchema = new Schema<IOrder>({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String },
  deliveryType: { type: String, required: true, enum: ['delivery', 'pickup'] },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
  items: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Mongoose Models
export const CategoryModel = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);
export const MenuItemModel = mongoose.models.MenuItem || mongoose.model<IMenuItem>("MenuItem", menuItemSchema);
export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
