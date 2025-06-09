import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, Star, Wallet, Code, Zap, Lock, Settings } from "lucide-react";
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

// Format balance to be more readable
const formatBalance = (balanceWei: string, decimals = 18): string => {
  const balance = parseInt(balanceWei) / Math.pow(10, decimals);
  if (balance < 0.000001 && balance > 0) {
    return balance.toFixed(8);
  }
  return balance.toFixed(6);
};

interface WalletExplorerProps {
  apiKey: string;
}

export function WalletExplorer({ apiKey }: WalletExplorerProps) {
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
    
    // Check if API key is available
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please add your Moralis API key in the settings to use this feature",
        variant: "destructive",
      });
      return;
    }
    
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
            "X-API-Key": apiKey,
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

  // Render API key missing message
  const renderApiKeyMissing = () => (
    <Card className="mb-6 border-border bg-card text-card-foreground">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-[#3DBBAC]">API Key Required</CardTitle>
          <div className="text-[#FFD700]">
            <Settings className="h-5 w-5" />
          </div>
        </div>
        <CardDescription>
          You need to add your Moralis API key to use this application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <p className="mb-4 text-[#A6B0C2]">
            To use the Moralis Wallet Explorer, you need to add your API key in the settings.
          </p>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-[#A6B0C2]">
              1. Click the <Settings className="inline h-4 w-4 text-[#3DBBAC]" /> icon in the top right corner
            </p>
            <p className="text-sm text-[#A6B0C2]">
              2. Enter your Moralis API key
            </p>
            <p className="text-sm text-[#A6B0C2]">
              3. Save your settings
            </p>
          </div>
          <div className="mt-6">
            <a
              href="https://admin.moralis.io/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3DBBAC] hover:underline"
            >
              Get a free API key from Moralis.io
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Level and progress section */}
      <Card className="mb-6 border-border bg-card text-card-foreground">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-[#3DBBAC]">Python Quest: Blockchain Explorer</CardTitle>
            <div className="flex items-center space-x-1 text-[#FFD700]">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4" />
              <Star className="h-4 w-4" />
            </div>
          </div>
          <CardDescription>
            Level 3: Blockchain Interaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Progress</span>
              <span>60%</span>
            </div>
            <Progress value={60} className="h-2 bg-[#1E293B]">
              <div className="h-full bg-[#3DBBAC] rounded-full" />
            </Progress>
          </div>
        </CardContent>
      </Card>

      {/* API Key missing message */}
      {!apiKey && renderApiKeyMissing()}

      {/* Wallet address input form */}
      <Card className="mb-6 border-border bg-card text-card-foreground">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-[#3DBBAC]">Wallet Balance Explorer</CardTitle>
            <div className="text-[#FFD700]">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <CardDescription>
            Check native token balance for any wallet address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#A6B0C2]">Wallet Address</Label>
              <Input
                id="address"
                placeholder="Enter wallet address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-[#1E293B] border-[#2A3441] text-white"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chain" className="text-[#A6B0C2]">Blockchain</Label>
              <Select
                value={chain}
                onValueChange={setChain}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-[#1E293B] border-[#2A3441] text-white">
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A2331] border-[#2A3441] text-white">
                  {CHAINS.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id} className="focus:bg-[#2A3441] focus:text-[#3DBBAC]">
                      {chain.name} ({chain.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#3DBBAC] text-[#101823] hover:bg-[#2A9D90]"
              disabled={isLoading || !apiKey}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-4 w-4" />
                  Check Balance
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results display */}
      {balance && (
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-[#3DBBAC]">Balance Result</CardTitle>
              <div className="text-[#FFD700]">
                <Zap className="h-5 w-5" />
              </div>
            </div>
            <CardDescription>
              Native token balance for {shortenAddress(balance.address)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-3xl font-bold mb-2 text-white">
                {balance.formatted} <span className="text-[#FFD700]">{balance.symbol}</span>
              </div>
              <p className="text-sm text-[#A6B0C2]">
                Address: {balance.address}
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <Lock className="h-4 w-4 text-[#3DBBAC]" />
                <span className="text-xs text-[#A6B0C2]">Secured by Moralis Web3 API</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
