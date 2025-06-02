import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="bg-[#3DBBAC] rounded-lg p-2 mr-3">
            <Wallet className="h-5 w-5 text-[#101823]" />
          </div>
          <div>
            <h1 className="text-[#3DBBAC] text-xl font-bold m-0">Moralis Wallet Explorer</h1>
            <p className="text-xs text-muted-foreground m-0">Explore blockchain data with React</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="bg-[#FFD700] text-[#101823] text-xs font-medium px-3 py-1 rounded">
            <span className="mr-1">⚡</span> Powered by Moralis
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
