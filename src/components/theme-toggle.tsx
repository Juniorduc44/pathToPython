import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-[#2A3441] bg-[#1E293B] hover:bg-[#2A3441] hover:text-[#3DBBAC]">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[#FFD700]" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[#3DBBAC]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-[#2A3441] bg-[#1A2331] text-white">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="focus:bg-[#2A3441] focus:text-[#3DBBAC] hover:bg-[#2A3441] hover:text-[#3DBBAC]"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="focus:bg-[#2A3441] focus:text-[#3DBBAC] hover:bg-[#2A3441] hover:text-[#3DBBAC]"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="focus:bg-[#2A3441] focus:text-[#3DBBAC] hover:bg-[#2A3441] hover:text-[#3DBBAC]"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
