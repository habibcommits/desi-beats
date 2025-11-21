import { useState } from "react";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const [, setLocation] = useLocation();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    setIsOpen(false);
    setLocation("/checkout");
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-primary via-primary to-accent hover:shadow-primary/50 transition-all duration-300 hover:scale-110 active:scale-95"
          size="icon"
          data-testid="button-floating-cart"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full flex items-center justify-center p-0 font-bold shadow-lg animate-in zoom-in"
              data-testid="badge-cart-count"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
              data-testid="overlay-cart"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md"
              data-testid="popup-cart"
            >
              <div className="bg-card rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-black/20 flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-primary-foreground">Your Cart</h3>
                        <p className="text-sm text-primary-foreground/80">
                          {totalItems} {totalItems === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-primary-foreground hover:bg-black/20 rounded-full"
                      data-testid="button-close-cart"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {items.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Your cart is empty</h4>
                    <p className="text-sm text-muted-foreground mb-6">
                      Add items from the menu to get started
                    </p>
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        setLocation("/menu");
                      }}
                      className="bg-gradient-to-r from-primary to-accent"
                      data-testid="button-browse-menu"
                    >
                      Browse Menu
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="max-h-[50vh] overflow-y-auto p-4">
                      <div className="space-y-4">
                        {items.map((item, index) => (
                          <motion.div
                            key={item.menuItem.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                            data-testid={`cart-item-${item.menuItem.id}`}
                          >
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 shadow-md">
                              {item.menuItem.image ? (
                                <img
                                  src={item.menuItem.image}
                                  alt={item.menuItem.name}
                                  className="w-full h-full object-cover"
                                  data-testid={`img-cart-item-${item.menuItem.id}`}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                                  <ShoppingCart className="w-8 h-8 text-accent" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate mb-1">
                                {item.menuItem.name}
                              </h4>
                              <p className="text-sm font-bold text-destructive mb-2">
                                Rs {(item.menuItem.price * item.quantity).toLocaleString()}
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 rounded-full"
                                  onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                  data-testid={`button-decrease-${item.menuItem.id}`}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span
                                  className="w-8 text-center font-semibold text-sm"
                                  data-testid={`text-quantity-${item.menuItem.id}`}
                                >
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 rounded-full"
                                  onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                  data-testid={`button-increase-${item.menuItem.id}`}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full ml-auto text-destructive hover:bg-destructive/10"
                                  onClick={() => removeItem(item.menuItem.id)}
                                  data-testid={`button-remove-${item.menuItem.id}`}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-destructive" data-testid="text-total-price">
                          Rs {totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        onClick={handleCheckout}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                        data-testid="button-checkout"
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
