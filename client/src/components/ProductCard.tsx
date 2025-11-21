import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Check } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

interface ProductCardProps {
  item: MenuItem;
}

export function ProductCard({ item }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const cartItems = useCart((state) => state.items);
  const [isAdding, setIsAdding] = useState(false);

  const isInCart = cartItems.some((cartItem) => cartItem.menuItem.id === item.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(item);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 group hover:shadow-xl border-2 hover:border-primary/30"
      data-testid={`card-product-${item.id}`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            data-testid={`img-product-${item.id}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        )}
        {item.featured === 1 && (
          <Badge 
            variant="destructive" 
            className="absolute top-3 right-3 shadow-lg animate-pulse"
            data-testid={`badge-featured-${item.id}`}
          >
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        <div className="space-y-1">
          <h3 
            className="font-semibold text-lg leading-tight"
            data-testid={`text-product-name-${item.id}`}
          >
            {item.name}
          </h3>
          {item.description && (
            <p 
              className="text-sm text-muted-foreground line-clamp-2"
              data-testid={`text-product-description-${item.id}`}
            >
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-muted-foreground">Rs</span>
            <span 
              className="text-2xl font-bold text-destructive"
              data-testid={`text-product-price-${item.id}`}
            >
              {item.price.toLocaleString()}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={item.available !== 1}
            size="sm"
            className="gap-2 min-w-[100px] bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            data-testid={`button-add-to-cart-${item.id}`}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4 animate-in zoom-in" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {isInCart ? "Add More" : "Add"}
              </>
            )}
          </Button>
        </div>

        {item.available !== 1 && (
          <Badge variant="secondary" className="w-full justify-center">
            Currently Unavailable
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
