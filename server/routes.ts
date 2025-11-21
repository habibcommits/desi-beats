import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./mongo-storage";
import { insertOrderSchema, insertCategorySchema, insertMenuItemSchema } from "@shared/schema";
import { z } from "zod";

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      });
      
      const { username, password } = loginSchema.parse(req.body);
      
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin";
      
      if (username === adminUsername && password === adminPassword) {
        req.session.isAdmin = true;
        res.json({ success: true, message: "Logged in successfully" });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/status", async (req, res) => {
    res.json({ isAuthenticated: !!req.session?.isAdmin });
  });
  // Hero Slider
  app.get("/api/hero-slider", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const configPath = path.join(process.cwd(), 'hero-slider-config.json');
      
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        res.json(config);
      } else {
        // Fallback to default config if file doesn't exist
        res.json({
          slides: [
            {
              id: 1,
              title: "Halwa Puri Nashta Deal",
              description: "2 Puri + 1 Plate Aloo + 1 Cup Halwa",
              price: "450",
              bgGradient: "from-amber-600/90 to-orange-800/90",
              imageUrl: "",
            },
            {
              id: 2,
              title: "Family BBQ Platter",
              description: "Malai Boti 6 Seekh + Naan + Raita",
              price: "2400",
              bgGradient: "from-red-700/90 to-red-900/90",
              imageUrl: "",
            },
            {
              id: 3,
              title: "Desi Murgh Karahi",
              description: "Full Karahi with 4 Naan",
              price: "3700",
              bgGradient: "from-orange-600/90 to-amber-800/90",
              imageUrl: "",
            },
          ],
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hero slider data" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Menu Items
  app.get("/api/menu-items", async (req, res) => {
    try {
      const { categoryId } = req.query;
      
      if (categoryId && typeof categoryId === "string") {
        const items = await storage.getMenuItemsByCategory(categoryId);
        return res.json(items);
      }
      
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const item = await storage.getMenuItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  // Orders
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      // Convert API format to schema format for validation
      const body = { ...req.body };
      if (body.totalAmount !== undefined) {
        const parsed = typeof body.totalAmount === 'string' ? parseFloat(body.totalAmount) : body.totalAmount;
        if (!Number.isFinite(parsed)) {
          return res.status(400).json({ error: "Invalid total amount value" });
        }
        body.totalAmount = parsed;
      }
      
      const validatedData = insertOrderSchema.parse(body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Admin category routes
  app.post("/api/admin/categories", requireAuth, async (req, res) => {
    try {
      // Convert API format to schema format for validation
      const body = { ...req.body };
      if (body.order !== undefined && typeof body.order === 'string') {
        body.order = parseInt(body.order, 10);
      }
      
      const validatedData = insertCategorySchema.parse(body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.patch("/api/admin/categories/:id", requireAuth, async (req, res) => {
    try {
      const updateSchema = insertCategorySchema.partial();
      
      // Convert API format to schema format for validation
      const body = { ...req.body };
      if (body.order !== undefined && typeof body.order === 'string') {
        body.order = parseInt(body.order, 10);
      }
      
      const validatedData = updateSchema.parse(body);
      const category = await storage.updateCategory(req.params.id, validatedData);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Admin menu item routes
  app.post("/api/admin/menu-items", requireAuth, async (req, res) => {
    try {
      // Convert API format to schema format for validation
      const body = { ...req.body };
      if (body.price !== undefined) {
        const parsed = typeof body.price === 'string' ? parseFloat(body.price) : body.price;
        if (!Number.isFinite(parsed)) {
          return res.status(400).json({ error: "Invalid price value" });
        }
        body.price = parsed;
      }
      if (body.order !== undefined && typeof body.order === 'string') {
        body.order = parseInt(body.order, 10);
      }
      if (body.available !== undefined) {
        body.available = body.available === 1 || body.available === '1' || body.available === true || body.available === 'true';
      }
      if (body.featured !== undefined) {
        body.featured = body.featured === 1 || body.featured === '1' || body.featured === true || body.featured === 'true';
      }
      
      const validatedData = insertMenuItemSchema.parse(body);
      const menuItem = await storage.createMenuItem(validatedData);
      res.status(201).json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid menu item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  app.patch("/api/admin/menu-items/:id", requireAuth, async (req, res) => {
    try {
      const updateSchema = insertMenuItemSchema.partial();
      
      // Convert API format to schema format for validation
      const body = { ...req.body };
      if (body.price !== undefined) {
        const parsed = typeof body.price === 'string' ? parseFloat(body.price) : body.price;
        if (!Number.isFinite(parsed)) {
          return res.status(400).json({ error: "Invalid price value" });
        }
        body.price = parsed;
      }
      if (body.order !== undefined && typeof body.order === 'string') {
        body.order = parseInt(body.order, 10);
      }
      if (body.available !== undefined) {
        body.available = body.available === 1 || body.available === '1' || body.available === true || body.available === 'true';
      }
      if (body.featured !== undefined) {
        body.featured = body.featured === 1 || body.featured === '1' || body.featured === true || body.featured === 'true';
      }
      
      const validatedData = updateSchema.parse(body);
      const menuItem = await storage.updateMenuItem(req.params.id, validatedData);
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid menu item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  app.delete("/api/admin/menu-items/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteMenuItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  // ImageKit upload signature endpoint
  app.get("/api/imagekit/auth", requireAuth, async (req, res) => {
    try {
      const crypto = await import("crypto");
      const token = (typeof req.query.token === 'string' ? req.query.token : null) || crypto.randomUUID();
      const expire = (typeof req.query.expire === 'string' ? req.query.expire : null) || (Math.floor(Date.now() / 1000) + 2400).toString();
      const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
      
      if (!privateKey) {
        return res.status(500).json({ error: "ImageKit not configured" });
      }
      
      const signature = crypto
        .createHmac("sha1", privateKey)
        .update(token + expire)
        .digest("hex");
      
      res.json({
        token,
        expire,
        signature,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate signature" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
