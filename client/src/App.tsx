import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { useState } from "react";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmation from "@/pages/OrderConfirmation";
import NotFound from "@/pages/not-found";

function Router({ onCartClick }: { onCartClick: () => void }) {
  return (
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
