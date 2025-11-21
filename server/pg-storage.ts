import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import ws from 'ws';
import * as schema from '../shared/schema';
import type { Category, InsertCategory, MenuItem, InsertMenuItem, Order, InsertOrder } from '@shared/schema';
import type { IStorage } from './storage';

// Configure neon for WebSocket
neonConfig.webSocketConstructor = ws;

export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private pool: Pool;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    this.pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(this.pool, { schema });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const categories = await this.db
      .select()
      .from(schema.categories)
      .orderBy(schema.categories.order);
    return categories;
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const [category] = await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .limit(1);
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, slug))
      .limit(1);
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await this.db
      .insert(schema.categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: string, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await this.db
      .update(schema.categories)
      .set(categoryData)
      .where(eq(schema.categories.id, id))
      .returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.categories)
      .where(eq(schema.categories.id, id))
      .returning();
    return result.length > 0;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    const items = await this.db
      .select()
      .from(schema.menuItems)
      .orderBy(schema.menuItems.order);
    return items;
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    const [item] = await this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.id, id))
      .limit(1);
    return item;
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const items = await this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.categoryId, categoryId))
      .orderBy(schema.menuItems.order);
    return items;
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await this.db
      .insert(schema.menuItems)
      .values(menuItem)
      .returning();
    return newItem;
  }

  async updateMenuItem(id: string, menuItemData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [updated] = await this.db
      .update(schema.menuItems)
      .set(menuItemData)
      .where(eq(schema.menuItems.id, id))
      .returning();
    return updated;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.menuItems)
      .where(eq(schema.menuItems.id, id))
      .returning();
    return result.length > 0;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const orders = await this.db
      .select()
      .from(schema.orders);
    return orders;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await this.db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, id))
      .limit(1);
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await this.db
      .insert(schema.orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await this.db
      .update(schema.orders)
      .set({ status })
      .where(eq(schema.orders.id, id))
      .returning();
    return updated;
  }
}

// Export a singleton instance
export const storage = new PostgresStorage();
