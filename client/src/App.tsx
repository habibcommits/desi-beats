import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useState } from "react";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmation from "@/pages/OrderConfirmation";
import AdminLoginPage from "@/pages/admin/LoginPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminCategoriesPage from "@/pages/admin/CategoriesPage";
import AdminMenuItemsPage from "@/pages/admin/MenuItemsPage";
import AdminOrdersPage from "@/pages/admin/OrdersPage";
import NotFound from "@/pages/not-found";

function Router({ onCartClick }: { onCartClick: () => void }) {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard">
        <AdminLayout>
          <AdminDashboardPage />
        </AdminLayout>
      </Route>
      <Route path="/admin/categories">
        <AdminLayout>
          <AdminCategoriesPage />
        </AdminLayout>
      </Route>
      <Route path="/admin/menu-items">
        <AdminLayout>
          <AdminMenuItemsPage />
        </AdminLayout>
      </Route>
      <Route path="/admin/orders">
        <AdminLayout>
          <AdminOrdersPage />
        </AdminLayout>
      </Route>
      <Route>
        <div className="flex flex-col min-h-screen">
          <Header onCartClick={onCartClick} />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/menu" component={MenuPage} />
              <Route path="/checkout" component={CheckoutPage} />
              <Route path="/order-confirmation/:id" component={OrderConfirmation} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router onCartClick={() => setIsCartOpen(true)} />
        <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
