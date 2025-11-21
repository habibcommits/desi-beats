import { Phone, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-muted-foreground">0311-2366143</p>
                  <p className="text-muted-foreground">0322-2366143</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">
                    Shop A6, Opp. Apollo Tower<br />
                    St. #: 15, E11/4 Islamabad
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/">
                <span className="block text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Home
                </span>
              </Link>
              <Link href="/menu">
                <span className="block text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Menu
                </span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Opening Hours</h3>
            <div className="flex items-start gap-3 text-sm">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Breakfast</p>
                <p className="text-muted-foreground">8:00 AM - 12:00 PM</p>
                <p className="font-medium mt-2">Lunch & Dinner</p>
                <p className="text-muted-foreground">12:00 PM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DESI Beats Café. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
