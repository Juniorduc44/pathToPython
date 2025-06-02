import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border py-6 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Moralis Wallet Explorer. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="https://docs.moralis.io/web3-data-api/evm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-[#3DBBAC] transition-colors"
            >
              Moralis API Docs
            </Link>
            
            <Link 
              to="https://moralis.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-[#3DBBAC] transition-colors"
            >
              Moralis.io
            </Link>
            
            <Link 
              to="https://github.com/Juniorduc44/pathToPython" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm flex items-center text-muted-foreground hover:text-[#3DBBAC] transition-colors"
            >
              <Github size={16} className="mr-1" />
              GitHub
            </Link>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-center text-muted-foreground">
          Built with React and the Moralis Web3 Data API. Not affiliated with Moralis Inc.
        </div>
      </div>
    </footer>
  );
}
