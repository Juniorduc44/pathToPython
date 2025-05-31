
import React from 'react';
import { CheckCircle, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProgress } from '@/contexts/ProgressContext';

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  isLocked: boolean;
  onClick: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  id,
  title,
  description,
  difficulty,
  isLocked,
  onClick
}) => {
  const { isLessonCompleted } = useProgress();
  const completed = isLessonCompleted(id);

  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-300 cursor-pointer
        ${isLocked 
          ? 'bg-gray-800/50 border-gray-700 opacity-60' 
          : completed
          ? 'bg-gradient-to-br from-green-900/50 to-cyan-900/50 border-green-500/50 hover:border-green-400'
          : 'bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20'
        }
      `}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg ${isLocked ? 'text-gray-500' : completed ? 'text-green-400' : 'text-cyan-400'}`}>
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: difficulty }, (_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            {isLocked ? (
              <Lock className="h-5 w-5 text-gray-500" />
            ) : completed ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : null}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-sm ${isLocked ? 'text-gray-500' : 'text-gray-300'} mb-4`}>
          {description}
        </p>
        
        {!isLocked && (
          <Button 
            variant="ghost" 
            className={`w-full ${
              completed 
                ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10' 
                : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
            }`}
          >
            {completed ? 'Review Lesson' : 'Start Lesson'}
          </Button>
        )}
      </CardContent>
      
      {completed && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      )}
    </Card>
  );
};

export default LessonCard;
