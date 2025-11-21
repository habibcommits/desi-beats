import { app } from "./server/app";
import { registerRoutes } from "./server/routes";

// Register all API routes
await registerRoutes(app);

// Export the Express app for Vercel serverless
export default app;
