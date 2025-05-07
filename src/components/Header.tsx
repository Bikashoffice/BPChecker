
import { ThermometerIcon, InfoIcon, LogOutIcon, ShieldIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ThermometerIcon className="h-6 w-6 text-primary" />
          </div>
          <Link to="/">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-theme-purple-dark bg-clip-text text-transparent">
              BP Checker (by Nischit)
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground hidden sm:block">
            {user ? `Hi, ${user.email?.split('@')[0]}` : 'Your health companion'}
          </div>
          
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin" className="flex items-center gap-1">
                    <ShieldIcon className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link to="/bp-info" className="flex items-center gap-1">
                  <InfoIcon className="h-4 w-4" />
                  <span>BP Info</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut} className="flex items-center gap-1">
                <LogOutIcon className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
