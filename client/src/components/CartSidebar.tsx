import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add items from the menu to get started
            </p>
            <Link href="/menu" onClick={onClose}>
              <Button data-testid="button-browse-menu">Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="flex gap-4 pb-4 border-b"
                    data-testid={`cart-item-${item.menuItem.id}`}
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {item.menuItem.image ? (
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-full h-full object-cover"
                          data-testid={`img-cart-item-${item.menuItem.id}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/10">
                          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-medium leading-tight mb-1"
                        data-testid={`text-cart-item-name-${item.menuItem.id}`}
                      >
                        {item.menuItem.name}
                      </h4>
                      <p 
                        className="text-sm text-destructive font-semibold"
                        data-testid={`text-cart-item-price-${item.menuItem.id}`}
                      >
                        Rs {item.menuItem.price.toLocaleString()}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1 bg-muted rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                            data-testid={`button-decrease-${item.menuItem.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span 
                            className="w-8 text-center text-sm font-medium"
                            data-testid={`text-quantity-${item.menuItem.id}`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.menuItem.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(item.menuItem.id)}
                          data-testid={`button-remove-${item.menuItem.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p 
                        className="font-semibold"
                        data-testid={`text-cart-item-total-${item.menuItem.id}`}
                      >
                        Rs {(item.menuItem.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
                data-testid="button-clear-cart"
              >
                Clear Cart
              </Button>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium" data-testid="text-subtotal">
                    Rs {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-destructive" data-testid="text-total">
                    Rs {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full" size="lg" data-testid="button-checkout">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
