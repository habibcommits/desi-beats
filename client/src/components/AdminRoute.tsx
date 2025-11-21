import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isLoading = useAuth((state) => state.isLoading);
  const checkAuth = useAuth((state) => state.checkAuth);
  const [, setLocation] = useLocation();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const performCheck = async () => {
      await checkAuth();
      setHasChecked(true);
    };
    performCheck();
  }, []);

  useEffect(() => {
    if (hasChecked && !isLoading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [hasChecked, isAuthenticated, isLoading, setLocation]);

  if (!hasChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
