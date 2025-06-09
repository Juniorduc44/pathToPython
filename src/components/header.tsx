import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsDialog } from "@/components/settings-dialog";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";

interface HeaderProps {
  onApiKeyChange: (apiKey: string) => void;
  isAuthenticated?: boolean;
  username?: string;
  onSignOut?: () => void;
}

export function Header({ onApiKeyChange, isAuthenticated = false, username = "User", onSignOut }: HeaderProps) {
  return (
    <header className="border-b border-border py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="bg-[#3DBBAC] rounded-lg p-2 mr-3">
            <Wallet className="h-5 w-5 text-[#101823]" />
          </div>
          <div>
            <h1 className="text-[#3DBBAC] text-xl font-bold m-0">Path To Python</h1>
            <p className="text-xs text-muted-foreground m-0">Master Python programming</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="text-sm text-muted-foreground mr-2">
                Welcome, <span className="font-medium text-primary">{username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSignOut}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="flex items-center"
            >
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
          <div className="bg-[#FFD700] text-[#101823] text-xs font-medium px-3 py-1 rounded">
            <span className="mr-1">⚡</span> Powered by Supabase
          </div>
          <SettingsDialog onApiKeyChange={onApiKeyChange} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
