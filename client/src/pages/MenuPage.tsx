import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";
import { useLocation } from "wouter";
import type { MenuItem } from "@shared/schema";

export default function MenuPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const filteredItems = selectedCategory
    ? menuItems?.filter((item) => item.categoryId === selectedCategory)
    : menuItems;

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setLocation(`/menu?category=${categoryId}`);
    } else {
      setLocation("/menu");
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="bg-gradient-to-br from-accent/20 to-primary/10 py-12 md:py-16 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our delicious selection of authentic Pakistani cuisine, from breakfast favorites to sizzling BBQ
          </p>
        </div>
      </div>

      <CategoryNav 
        selectedCategory={selectedCategory} 
        onCategorySelect={handleCategorySelect} 
      />

      <div className="container mx-auto px-4 mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {selectedCategory ? "This category doesn't have any items yet." : "No menu items available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
