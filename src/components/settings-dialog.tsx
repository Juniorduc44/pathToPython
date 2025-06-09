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
import { Settings, User as UserIcon, Award, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";

// Placeholder for lesson data (similar to WalletExplorer for consistency)
const LESSONS = [
  { id: 1, title: "Python Basics: Variables & Data Types", progress: 100, completed: true, xp: 10 },
  { id: 2, title: "Control Flow: If/Else & Loops", progress: 75, completed: false, xp: 15 },
  { id: 3, title: "Functions: Building Reusable Code", progress: 50, completed: false, xp: 20 },
  { id: 4, title: "Data Structures: Lists & Dictionaries", progress: 0, completed: false, xp: 25 },
  { id: 5, title: "Object-Oriented Programming", progress: 0, completed: false, xp: 30 },
];

export function SettingsDialog() {
  const { toast } = useToast();
  const { user, profile, updateUsername, isLoading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [formError, setFormError] = useState("");

  // Calculate overall progress for display
  const totalLessons = LESSONS.length;
  const completedLessons = LESSONS.filter(lesson => lesson.completed).length;
  const overallProgress = (completedLessons / totalLessons) * 100;

  // Placeholder for user level and XP
  const userLevel = 1;
  const currentXp = 0;
  const xpToNextLevel = 100;
  const xpProgress = (currentXp / xpToNextLevel) * 100;

  // Load username from profile when dialog opens or profile changes
  useEffect(() => {
    if (open && profile?.username) {
      setUsernameInput(profile.username);
      setFormError("");
    } else if (open && !profile?.username) {
      setUsernameInput("");
      setFormError("");
    }
  }, [open, profile]);

  const handleSave = async () => {
    setFormError("");
    if (!user) {
      setFormError("You must be logged in to update your profile.");
      return;
    }

    if (!usernameInput.trim()) {
      setFormError("Username cannot be empty.");
      return;
    }

    if (usernameInput.trim().length < 3 || usernameInput.trim().length > 20) {
      setFormError("Username must be between 3 and 20 characters.");
      return;
    }

    // Check if username is different from current profile username
    if (profile?.username === usernameInput.trim()) {
      toast({
        title: "No Changes",
        description: "Username is already set to this value.",
        variant: "warning",
      });
      setOpen(false);
      return;
    }

    // Call updateUsername from AuthContext
    try {
      await updateUsername(usernameInput.trim());
      setOpen(false);
    } catch (error) {
      setFormError((error as Error).message || "Failed to update username.");
    }
  };

  const handleCancel = () => {
    setUsernameInput(profile?.username || "");
    setFormError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8 border-[#2A3441] bg-[#1E293B] hover:bg-[#2A3441] hover:text-[#3DBBAC]"
          title="Profile Settings"
        >
          <Settings className="h-4 w-4 text-[#3DBBAC]" />
          <span className="sr-only">Profile Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-[#2A3441] bg-[#1A2331] text-white">
        <DialogHeader>
          <DialogTitle className="text-[#3DBBAC]">Profile Settings</DialogTitle>
          <DialogDescription className="text-[#A6B0C2]">
            Manage your username and view your learning progress.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Username Section */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[#A6B0C2]">
              Username
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-[#A6B0C2]" />
              <Input
                id="username"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setFormError("");
                }}
                placeholder="Enter your username"
                className="pl-10 bg-[#1E293B] border-[#2A3441] text-white"
              />
              {formError && (
                <p className="text-red-500 text-sm mt-1">{formError}</p>
              )}
            </div>
          </div>

          {/* Learning Progress Section */}
          <div className="space-y-2 pt-2">
            <Label className="text-[#A6B0C2]">Learning Progress</Label>
            <div className="border border-[#2A3441] rounded-md p-4 bg-[#1E293B]">
              {/* Level and XP */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-[#FFD700] mr-2" />
                  <span className="text-[#A6B0C2]">Current Level</span>
                </div>
                <div className="text-[#FFD700] font-bold">{userLevel}</div>
              </div>
              
              {/* XP Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#A6B0C2]">XP to Next Level</span>
                  <span className="text-[#A6B0C2]">{currentXp} / {xpToNextLevel} XP</span>
                </div>
                <Progress value={xpProgress} className="h-1.5">
                  <div className="h-full bg-[#FFD700] rounded-full" />
                </Progress>
              </div>
              
              {/* Course Progress */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#A6B0C2]">Course Progress</span>
                  <span className="text-[#A6B0C2]">{completedLessons} / {totalLessons} Lessons</span>
                </div>
                <Progress value={overallProgress} className="h-1.5">
                  <div className="h-full bg-[#3DBBAC] rounded-full" />
                </Progress>
              </div>
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
            disabled={authLoading}
            className="bg-[#3DBBAC] text-[#101823] hover:bg-[#2A9D90]"
          >
            {authLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
