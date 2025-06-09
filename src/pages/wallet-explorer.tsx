import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Zap, BookOpen, Award, Lightbulb } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Assuming AuthContext provides user/profile

// Placeholder for lesson data
const LESSONS = [
  { id: 1, title: "Python Basics: Variables & Data Types", progress: 100, completed: true, xp: 10 },
  { id: 2, title: "Control Flow: If/Else & Loops", progress: 75, completed: false, xp: 15 },
  { id: 3, title: "Functions: Building Reusable Code", progress: 50, completed: false, xp: 20 },
  { id: 4, title: "Data Structures: Lists & Dictionaries", progress: 0, completed: false, xp: 25 },
  { id: 5, title: "Object-Oriented Programming", progress: 0, completed: false, xp: 30 },
];

export function WalletExplorer() { // Renamed from WalletExplorer to reflect new purpose
  const { user, profile } = useAuth();
  const username = profile?.username || user?.email?.split('@')[0] || "Explorer";

  // Calculate overall progress
  const totalLessons = LESSONS.length;
  const completedLessons = LESSONS.filter(lesson => lesson.completed).length;
  const overallProgress = (completedLessons / totalLessons) * 100;

  // Placeholder for user level and XP (can be integrated with Supabase later)
  const userLevel = 1;
  const currentXp = 0;
  const xpToNextLevel = 100;
  const xpProgress = (currentXp / xpToNextLevel) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome and Level/Progress Section */}
      <Card className="mb-6 border-border bg-card text-card-foreground">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-[#3DBBAC]">Welcome, {username}!</CardTitle>
            <div className="flex items-center space-x-1 text-[#FFD700]">
              <Award className="h-5 w-5 fill-current" />
              <span className="text-lg font-bold">{userLevel}</span>
            </div>
          </div>
          <CardDescription>
            Your Path To Python learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-muted-foreground">Overall Course Progress</span>
                <span className="text-muted-foreground">{completedLessons} / {totalLessons} Lessons</span>
              </div>
              <Progress value={overallProgress} className="h-2 bg-[#1E293B]">
                <div className="h-full bg-[#3DBBAC] rounded-full" />
              </Progress>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-muted-foreground">XP to Next Level</span>
                <span className="text-muted-foreground">{currentXp} / {xpToNextLevel} XP</span>
              </div>
              <Progress value={xpProgress} className="h-2 bg-[#1E293B]">
                <div className="h-full bg-[#FFD700] rounded-full" />
              </Progress>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Section - Learning Path Overview */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-[#3DBBAC]">Your Python Learning Path</h2>
        <p className="text-lg text-muted-foreground">Embark on a quest to master Python programming</p>

        <div className="flex flex-wrap justify-center mt-6 gap-6">
          <div className="flex items-center">
            <BookOpen className="text-[#3DBBAC] mr-2" size={20} />
            <span className="text-muted-foreground">Interactive Lessons</span>
          </div>
          <div className="flex items-center">
            <Zap className="text-[#FFD700] mr-2" size={20} />
            <span className="text-muted-foreground">Gamified Experience</span>
          </div>
          <div className="flex items-center">
            <Lightbulb className="text-[#3DBBAC] mr-2" size={20} />
            <span className="text-muted-foreground">Practical Projects</span>
          </div>
        </div>
      </div>

      {/* Lesson Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LESSONS.map((lesson) => (
          <Card 
            key={lesson.id} 
            className={`border-border bg-card text-card-foreground transition-all hover:shadow-md hover:border-[#3DBBAC] ${
              lesson.completed ? "border-l-4 border-l-[#3DBBAC]" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-[#3DBBAC]">
                  {lesson.title}
                </CardTitle>
                <div className="flex items-center space-x-1 text-[#FFD700]">
                  <span className="text-xs font-medium">+{lesson.xp} XP</span>
                </div>
              </div>
              <CardDescription>
                Lesson {lesson.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-muted-foreground">{lesson.progress}%</span>
                  </div>
                  <Progress value={lesson.progress} className="h-1.5 bg-[#1E293B]">
                    <div className="h-full bg-[#3DBBAC] rounded-full" />
                  </Progress>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    {lesson.completed ? (
                      <span className="text-xs text-[#3DBBAC] font-medium">Completed</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">In Progress</span>
                    )}
                  </div>
                  <button 
                    className="text-xs font-medium text-[#3DBBAC] hover:text-[#2A9D90] transition-colors"
                  >
                    {lesson.completed ? "Review" : "Continue"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
