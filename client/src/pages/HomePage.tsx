import { useQuery } from "@tanstack/react-query";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Flame, Clock, Star } from "lucide-react";
import type { MenuItem, Category } from "@shared/schema";

export default function HomePage() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const featuredItems = menuItems?.filter((item) => item.featured === 1).slice(0, 6) || [];
  const popularItems = menuItems?.slice(0, 8) || [];

  return (
    <div className="min-h-screen">
      <HeroSlider />

      <section className="py-12 md:py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-accent/10 hover-elevate">
              <div className="p-3 rounded-lg bg-primary">
                <Flame className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Fresh & Hot</h3>
                <p className="text-sm text-muted-foreground">
                  Every dish prepared fresh with authentic spices
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-accent/10 hover-elevate">
              <div className="p-3 rounded-lg bg-primary">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Quick delivery to your doorstep in Islamabad
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-accent/10 hover-elevate">
              <div className="p-3 rounded-lg bg-primary">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Quality Food</h3>
                <p className="text-sm text-muted-foreground">
                  Premium ingredients, authentic Pakistani cuisine
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredItems.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Dishes</h2>
                <p className="text-muted-foreground">Our chef's special recommendations</p>
              </div>
              <Link href="/menu">
                <Button variant="outline" className="gap-2" data-testid="link-view-all-featured">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Items</h2>
              <p className="text-muted-foreground">Customer favorites you'll love</p>
            </div>
            <Link href="/menu">
              <Button variant="outline" className="gap-2" data-testid="link-view-all-popular">
                View Menu <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularItems.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-br from-accent/20 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Menu</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From traditional breakfast to sizzling BBQ, discover authentic Pakistani flavors
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {categories.slice(0, 10).map((category) => (
                <Link key={category.id} href={`/menu?category=${category.slug}`}>
                  <div 
                    className="group cursor-pointer"
                    data-testid={`category-card-${category.slug}`}
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-card border-2 border-card-border hover:border-primary transition-all hover-elevate active-elevate-2">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/10">
                          <div className="w-20 h-20 rounded-full bg-accent/30 flex items-center justify-center">
                            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-center font-semibold mt-3 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/menu">
                <Button size="lg" className="gap-2" data-testid="button-browse-menu">
                  Browse Full Menu <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
