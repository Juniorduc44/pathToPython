import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Local storage key for the API key
const API_KEY_STORAGE_KEY = "moralis-wallet-explorer-api-key";

interface SettingsDialogProps {
  onApiKeyChange: (apiKey: string) => void;
}

export function SettingsDialog({ onApiKeyChange }: SettingsDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  // Load API key from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || "";
      setApiKey(savedApiKey);
      setError("");
    }
  }, [open]);

  const handleSave = () => {
    // Validate API key
    if (!apiKey.trim()) {
      setError("API key cannot be empty");
      return;
    }

    // Simple format validation (JWT tokens typically have 3 parts separated by dots)
    if (!apiKey.includes(".")) {
      setError("API key format appears to be invalid");
      return;
    }

    // Save to localStorage
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    
    // Notify parent component
    onApiKeyChange(apiKey);
    
    // Show success toast
    toast({
      title: "Settings saved",
      description: "Your Moralis API key has been saved",
      variant: "success",
    });
    
    // Close dialog
    setOpen(false);
  };

  const handleCancel = () => {
    // Reset to saved value
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || "";
    setApiKey(savedApiKey);
    setError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8 border-[#2A3441] bg-[#1E293B] hover:bg-[#2A3441] hover:text-[#3DBBAC]"
          title="Settings"
        >
          <Settings className="h-4 w-4 text-[#3DBBAC]" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-[#2A3441] bg-[#1A2331] text-white">
        <DialogHeader>
          <DialogTitle className="text-[#3DBBAC]">Settings</DialogTitle>
          <DialogDescription className="text-[#A6B0C2]">
            Configure your Moralis API key to access blockchain data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-[#A6B0C2] col-span-4">
              Moralis API Key
            </Label>
            <div className="col-span-4">
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError("");
                }}
                placeholder="Enter your Moralis API key"
                className="bg-[#1E293B] border-[#2A3441] text-white"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
              <p className="text-[#A6B0C2] text-xs mt-2">
                Get your free API key from{" "}
                <a
                  href="https://admin.moralis.io/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3DBBAC] hover:underline"
                >
                  Moralis.io
                </a>
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-[#2A3441] bg-transparent hover:bg-[#2A3441] text-[#A6B0C2] hover:text-[#3DBBAC]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-[#3DBBAC] text-[#101823] hover:bg-[#2A9D90]"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
