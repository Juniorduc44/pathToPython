
import React, { useState } from 'react';
import { Code, Gamepad2, Zap, Heart } from 'lucide-react';
import LessonCard from '@/components/LessonCard';
import ProgressBar from '@/components/ProgressBar';
import ThemeToggle from '@/components/ThemeToggle';
import LessonView from '@/pages/LessonView';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProgressProvider, useProgress } from '@/contexts/ProgressContext';
import { lessons } from '@/data/lessons';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const { completedLessons } = useProgress();

  if (selectedLesson) {
    return (
      <LessonView
        lessonId={selectedLesson}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-green-500 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                  Python Quest
                </h1>
                <p className="text-sm text-gray-400">Level up your coding skills</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <ProgressBar />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Master Python Programming
          </h2>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Learn Python through interactive lessons, hands-on coding challenges, and gamified progress tracking.
          </p>
          
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-cyan-400" />
              <span className="text-gray-300">Gamified Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">Interactive Coding</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-300">Low Latency</span>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6">Chapter 1: Python Fundamentals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => {
              const isLocked = index > 0 && !completedLessons.has(lessons[index - 1].id);
              
              return (
                <LessonCard
                  key={lesson.id}
                  id={lesson.id}
                  title={lesson.title}
                  description={lesson.description}
                  difficulty={lesson.difficulty}
                  isLocked={isLocked}
                  onClick={() => setSelectedLesson(lesson.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{completedLessons.size}/10</div>
            <div className="text-gray-300">Lessons Completed</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{completedLessons.size * 100}</div>
            <div className="text-gray-300">XP Earned</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{Math.floor(completedLessons.size * 100 / 500) + 1}</div>
            <div className="text-gray-300">Current Level</div>
          </div>
        </div>

        {/* Donations Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-8 max-w-md mx-auto">
            <Heart className="h-8 w-8 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-400 mb-2">Support Python Quest</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Help us keep this platform free and continue adding new lessons and features!
            </p>
            <Button
              onClick={() => window.open('https://pay.zaprite.com/pl_iT3k7W4JRo', '_blank')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2"
            >
              <Heart className="h-4 w-4 mr-2" />
              Donate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <Dashboard />
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default Index;
