import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-8 h-8 border-[#2A3441] bg-[#1E293B] hover:bg-[#2A3441] hover:text-[#3DBBAC]"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-[#FFD700]" />
      ) : (
        <Moon className="h-4 w-4 text-[#3DBBAC]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
