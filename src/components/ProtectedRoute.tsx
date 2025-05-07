
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-theme-purple-light/30 to-background p-10">
        <div className="container mx-auto">
          <Skeleton className="h-[40px] w-[200px] mb-6" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin access is required but the user is not an admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
