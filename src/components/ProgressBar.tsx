import React from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { TrendingUp, Target, Zap } from 'lucide-react';

const TOTAL_LESSONS = 100; // Should match the total lessons in your curriculum
const XP_PER_LEVEL = 500; // XP needed to advance to the next level

const ProgressBar: React.FC = () => {
  const { completedLessons, xp, level, getOverallProgress } = useProgress();

  const overallProgressPercent = getOverallProgress();
  const lessonsCompletedCount = completedLessons.size;

  const xpForCurrentLevel = (level - 1) * XP_PER_LEVEL;
  const xpIntoCurrentLevel = xp - xpForCurrentLevel;
  const xpToNextLevelPercent = (xpIntoCurrentLevel / XP_PER_LEVEL) * 100;
  const nextLevel = level + 1;

  return (
    <div className="space-y-6 p-6 bg-gray-800/50 border border-cyan-500/30 rounded-lg shadow-xl">
      
      {/* Level Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-yellow-400" />
          <div>
            <p className="text-sm text-gray-400">Current Level</p>
            <p className="text-2xl font-bold text-yellow-400">{level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total XP</p>
          <p className="text-2xl font-bold text-green-400">{xp}</p>
        </div>
      </div>

      {/* Overall Lesson Progress */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-cyan-300 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Overall Progress
          </span>
          <span className="text-sm font-medium text-cyan-300">
            {lessonsCompletedCount} / {TOTAL_LESSONS} Lessons
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overallProgressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* XP Towards Next Level */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-green-300 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            XP to Level {nextLevel}
          </span>
          <span className="text-sm font-medium text-green-300">
            {xpIntoCurrentLevel} / {XP_PER_LEVEL} XP
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${xpToNextLevelPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
