import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, Star, Wallet, Code, Zap, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Chain configuration
const CHAINS = [
  { id: "eth", name: "Ethereum", symbol: "ETH" },
  { id: "bsc", name: "Binance Smart Chain", symbol: "BNB" },
  { id: "polygon", name: "Polygon", symbol: "MATIC" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
  { id: "fantom", name: "Fantom", symbol: "FTM" },
  { id: "cronos", name: "Cronos", symbol: "CRO" },
];

// Moralis API key - In production, this should be secured properly
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFhZTUyYzI4LTc3YjMtNGQ4NC1iMTdhLWY5NzE4NmNjMGU5MyIsIm9yZ0lkIjoiMzA0ODYzIiwidXNlcklkIjoiMzEyOTkzIiwidHlwZUlkIjoiMzIwMjdkMDAtYWNhYS00YTFmLTk4NWMtMWQxMzJkZTVmZGQ4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODk1NDI3NDUsImV4cCI6NDg0NTMwMjc0NX0.g-mbcVZbLwTPNJXihBOaJ0WR3wpZTmkTeF8wo-cQQCg";

// Format balance to be more readable
const formatBalance = (balanceWei: string, decimals = 18): string => {
  const balance = parseInt(balanceWei) / Math.pow(10, decimals);
  if (balance < 0.000001 && balance > 0) {
    return balance.toFixed(8);
  }
  return balance.toFixed(6);
};

export function WalletExplorer() {
  const { toast } = useToast();
  const [address, setAddress] = useState<string>("");
  const [chain, setChain] = useState<string>("eth");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<{
    formatted: string;
    symbol: string;
    address: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setBalance(null);
    
    try {
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2/${address}/balance?chain=${chain}`,
        {
          headers: {
            accept: "application/json",
            "X-API-Key": API_KEY,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      const selectedChain = CHAINS.find(c => c.id === chain);
      
      setBalance({
        formatted: formatBalance(data.balance),
        symbol: selectedChain?.symbol || "",
        address: address,
      });
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast({
        title: "Error fetching balance",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Shortened address display
  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Level and progress section */}
      <Card className="mb-6 border-border bg-card text-card-foreground">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#FFD700] text-[#101823] flex items-center justify-center mr-2">
                <Zap size={16} />
              </div>
              <span className="text-muted-foreground">Explorer Level</span>
            </div>
            <div className="text-[#FFD700] font-bold">1</div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="text-muted-foreground">0 / 4 Features</span>
            </div>
            <Progress value={25} className="h-1.5" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">XP to Level 2</span>
              <span className="text-muted-foreground">0 / 100 XP</span>
            </div>
            <Progress value={0} className="h-1.5" />
          </div>
        </CardContent>
      </Card>

      {/* Main content section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-[#3DBBAC]">Master Blockchain Exploration</h2>
        <p className="text-lg text-muted-foreground">Check wallet balances across multiple blockchains</p>
        
        <div className="flex flex-wrap justify-center mt-6 gap-6">
          <div className="flex items-center">
            <Wallet className="text-[#3DBBAC] mr-2" size={20} />
            <span className="text-muted-foreground">Multi-Chain Support</span>
          </div>
          <div className="flex items-center">
            <Code className="text-[#3DBBAC] mr-2" size={20} />
            <span className="text-muted-foreground">React-Powered</span>
          </div>
          <div className="flex items-center">
            <Zap className="text-[#FFD700] mr-2" size={20} />
            <span className="text-muted-foreground">Low Latency</span>
          </div>
        </div>
      </div>

      {/* Wallet explorer card */}
      <div className="max-w-xl mx-auto">
        <Card className="mb-6 border-border bg-card text-card-foreground">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-[#3DBBAC]">Wallet Balance Checker</CardTitle>
              <div className="text-[#FFD700]">
                <Star className="fill-[#FFD700] stroke-[#FFD700]" size={20} />
              </div>
            </div>
            <CardDescription>
              Enter any wallet address to check its native balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <Input
                  id="wallet-address"
                  placeholder="Enter wallet address (0x...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-[#1E293B] border-[#2A3441]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chain">Blockchain</Label>
                <Select 
                  value={chain} 
                  onValueChange={setChain}
                >
                  <SelectTrigger className="bg-[#1E293B] border-[#2A3441]">
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHAINS.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center">
                <Button 
                  type="submit" 
                  className="flex-grow bg-[#3DBBAC] text-[#101823] hover:bg-[#2A9D90]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Balance"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {balance && (
          <Card className="mb-6 border-border bg-card text-card-foreground">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-[#3DBBAC]">Wallet Balance</CardTitle>
                <div className="text-[#FFD700] flex">
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={20} />
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-l-4 border-[#3DBBAC] pl-4 py-2">
                <p className="mb-2 text-muted-foreground">
                  Address: {shortenAddress(balance.address)}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg">Native Balance:</span>
                  <span className="text-xl font-bold text-[#FFD700]">
                    {balance.formatted} {balance.symbol}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Feature cards (locked) */}
      <div className="max-w-4xl mx-auto mt-12">
        <h3 className="text-xl font-semibold mb-6 text-center text-[#3DBBAC]">Coming Soon</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Token Balance Card */}
          <Card className="border-border bg-card text-card-foreground opacity-75">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-[#3DBBAC]">Token Balances</CardTitle>
                <div className="text-[#FFD700] flex">
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={16} />
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={16} />
                </div>
              </div>
              <CardDescription>
                View all ERC-20 tokens in a wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mt-6">
                <Lock className="text-muted-foreground" size={32} />
              </div>
            </CardContent>
          </Card>
          
          {/* NFT Card */}
          <Card className="border-border bg-card text-card-foreground opacity-75">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-[#3DBBAC]">NFT Gallery</CardTitle>
                <div className="text-[#FFD700] flex">
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={16} />
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={16} />
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={16} />
                </div>
              </div>
              <CardDescription>
                Explore NFTs owned by an address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mt-6">
                <Lock className="text-muted-foreground" size={32} />
              </div>
            </CardContent>
          </Card>
          
          {/* Transaction History Card */}
          <Card className="border-border bg-card text-card-foreground opacity-75">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-[#3DBBAC]">Transaction History</CardTitle>
                <div className="text-[#FFD700] flex">
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={16} />
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={16} />
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={16} />
                  <Star className="fill-[#FFD700] stroke-[#FFD700]" size={16} />
                </div>
              </div>
              <CardDescription>
                View recent transactions for any wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mt-6">
                <Lock className="text-muted-foreground" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
