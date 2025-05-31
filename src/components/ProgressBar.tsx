
import React from 'react';
import { Trophy, Zap } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const ProgressBar: React.FC = () => {
  const { xp, level, getProgress } = useProgress();
  const progress = getProgress();
  const xpForNextLevel = (level * 500) - xp;

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span className="text-yellow-400 font-bold">Level {level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span className="text-cyan-400 text-sm">{xp} XP</span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Overall Progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="text-xs text-gray-400">
        {xpForNextLevel > 0 ? `${xpForNextLevel} XP to next level` : 'Max level reached!'}
      </div>
    </div>
  );
};

export default ProgressBar;
