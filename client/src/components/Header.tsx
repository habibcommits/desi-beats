import { Link } from "wouter";
import { ShoppingCart, Bike, Store, MapPin, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  onCartClick?: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const totalItems = useCart((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <Link href="/" data-testid="link-home">
          <img 
            src="/logo.png" 
            alt="DESI Beats Café" 
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain hover-elevate active-elevate-2 rounded-full transition-transform"
            data-testid="img-logo"
          />
        </Link>

        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg p-1">
          <Button
            variant={deliveryType === "delivery" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeliveryType("delivery")}
            className="gap-2"
            data-testid="button-delivery-toggle"
          >
            <Bike className="h-4 w-4" />
            <span>Delivery</span>
          </Button>
          <Button
            variant={deliveryType === "pickup" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeliveryType("pickup")}
            className="gap-2"
            data-testid="button-pickup-toggle"
          >
            <Store className="h-4 w-4" />
            <span>Pickup</span>
          </Button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Shop A6, Opp. Apollo Tower, E11/4 Islamabad</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/menu">
            <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="link-menu">
              <MenuIcon className="h-4 w-4 mr-2" />
              Menu
            </Button>
          </Link>

          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={onCartClick}
            data-testid="button-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                data-testid="badge-cart-count"
              >
                {totalItems}
              </Badge>
            )}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/">
                  <Button variant="ghost" className="w-full justify-start" data-testid="link-home-mobile">
                    Home
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button variant="ghost" className="w-full justify-start" data-testid="link-menu-mobile">
                    Menu
                  </Button>
                </Link>
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button
                    variant={deliveryType === "delivery" ? "default" : "outline"}
                    onClick={() => setDeliveryType("delivery")}
                    className="gap-2 justify-start"
                    data-testid="button-delivery-mobile"
                  >
                    <Bike className="h-4 w-4" />
                    Delivery
                  </Button>
                  <Button
                    variant={deliveryType === "pickup" ? "default" : "outline"}
                    onClick={() => setDeliveryType("pickup")}
                    className="gap-2 justify-start"
                    data-testid="button-pickup-mobile"
                  >
                    <Store className="h-4 w-4" />
                    Pickup
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
