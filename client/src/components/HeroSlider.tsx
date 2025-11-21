import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  price: string;
  bgGradient: string;
  imageUrl: string;
}

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch hero slider data from API
  const { data: heroSliderData, isLoading } = useQuery<{ slides: HeroSlide[] }>({
    queryKey: ['/api/hero-slider'],
  });

  const heroSlides = heroSliderData?.slides || [];

  useEffect(() => {
    if (heroSlides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  if (isLoading || heroSlides.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-black to-amber-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-black to-amber-950">
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div 
              className={`absolute inset-0 bg-cover bg-center`}
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />
            
            <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start text-white">
              <div className="max-w-2xl space-y-4 md:space-y-6">
                <h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  data-testid={`text-hero-title-${index}`}
                >
                  {slide.title}
                </h1>
                <p 
                  className="text-lg md:text-xl lg:text-2xl text-white/90"
                  data-testid={`text-hero-description-${index}`}
                >
                  {slide.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                    Rs {slide.price}
                  </span>
                  <span className="text-lg text-white/80">only</span>
                </div>
                <div className="flex gap-4 pt-4">
                  <Link href="/menu">
                    <Button 
                      size="lg" 
                      className="text-base md:text-lg px-8 backdrop-blur-sm"
                      data-testid={`button-order-now-${index}`}
                    >
                      Order Now
                    </Button>
                  </Link>
                  <Link href="/menu">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-base md:text-lg px-8 backdrop-blur-sm bg-white/10 border-white/30 text-white hover:bg-white/20"
                      data-testid={`button-view-menu-${index}`}
                    >
                      View Menu
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
        aria-label="Previous slide"
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
        aria-label="Next slide"
        data-testid="button-next-slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-slide-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
