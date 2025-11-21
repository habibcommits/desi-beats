import mongoose from "mongoose";
import { CategoryModel, MenuItemModel, OrderModel } from "./models";
import {
  type Category,
  type InsertCategory,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { type IStorage } from "./storage";

export class MongoStorage implements IStorage {
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private async connect() {
    if (this.isConnected) {
      return;
    }

    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI or MONGODB_URI environment variable is not set");
    }

    try {
      await mongoose.connect(mongoUri);
      this.isConnected = true;
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  private async ensureConnection() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  // Helper to convert MongoDB document to app format
  private convertCategory(doc: any): Category {
    return {
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description ?? null,
      image: doc.image ?? null,
      order: doc.order,
    };
  }

  private convertMenuItem(doc: any): MenuItem {
    return {
      id: doc._id.toString(),
      categoryId: doc.categoryId,
      name: doc.name,
      description: doc.description ?? null,
      price: doc.price,
      image: doc.image ?? null,
      available: doc.available ? 1 : 0,
      featured: doc.featured ? 1 : 0,
      order: doc.order,
    };
  }

  private convertOrder(doc: any): Order {
    return {
      id: doc._id.toString(),
      customerName: doc.customerName,
      customerPhone: doc.customerPhone,
      customerAddress: doc.customerAddress ?? null,
      deliveryType: doc.deliveryType,
      totalAmount: doc.totalAmount.toString(),
      status: doc.status,
      items: doc.items,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    await this.ensureConnection();
    const categories = await CategoryModel.find().sort({ order: 1 });
    return categories.map(this.convertCategory);
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    await this.ensureConnection();
    const category = await CategoryModel.findById(id);
    return category ? this.convertCategory(category) : undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    await this.ensureConnection();
    const category = await CategoryModel.findOne({ slug });
    return category ? this.convertCategory(category) : undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    await this.ensureConnection();
    const newCategory = await CategoryModel.create(category);
    return this.convertCategory(newCategory);
  }

  async updateCategory(id: string, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    await this.ensureConnection();
    const updated = await CategoryModel.findByIdAndUpdate(id, categoryData, { new: true });
    return updated ? this.convertCategory(updated) : undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await CategoryModel.findByIdAndDelete(id);
    return !!result;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    await this.ensureConnection();
    const items = await MenuItemModel.find().sort({ order: 1 });
    return items.map(this.convertMenuItem);
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    await this.ensureConnection();
    const item = await MenuItemModel.findById(id);
    return item ? this.convertMenuItem(item) : undefined;
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    await this.ensureConnection();
    const items = await MenuItemModel.find({ categoryId }).sort({ order: 1 });
    return items.map(this.convertMenuItem);
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    await this.ensureConnection();
    const newItem = await MenuItemModel.create(menuItem);
    return this.convertMenuItem(newItem);
  }

  async updateMenuItem(id: string, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    await this.ensureConnection();
    const updated = await MenuItemModel.findByIdAndUpdate(id, menuItem, { new: true });
    return updated ? this.convertMenuItem(updated) : undefined;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await MenuItemModel.findByIdAndDelete(id);
    return !!result;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    await this.ensureConnection();
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    return orders.map(this.convertOrder);
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    await this.ensureConnection();
    const order = await OrderModel.findById(id);
    return order ? this.convertOrder(order) : undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    await this.ensureConnection();
    const newOrder = await OrderModel.create(order);
    return this.convertOrder(newOrder);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    await this.ensureConnection();
    const updated = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
    return updated ? this.convertOrder(updated) : undefined;
  }
}

// Export a singleton instance
export const storage = new MongoStorage();
