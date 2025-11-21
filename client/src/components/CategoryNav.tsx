import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface CategoryNavProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryNav({ selectedCategory, onCategorySelect }: CategoryNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-20 z-40 bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
            data-testid="button-scroll-left"
          >
            <div className="p-2 rounded-full bg-background shadow-md hover-elevate active-elevate-2">
              <ChevronLeft className="h-4 w-4" />
            </div>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-8 md:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => onCategorySelect(null)}
              className="whitespace-nowrap"
              data-testid="button-category-all"
            >
              All Items
            </Button>
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => onCategorySelect(category.id)}
                className="whitespace-nowrap"
                data-testid={`button-category-${category.slug}`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block"
            data-testid="button-scroll-right"
          >
            <div className="p-2 rounded-full bg-background shadow-md hover-elevate active-elevate-2">
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
