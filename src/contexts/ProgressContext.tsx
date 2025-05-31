
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressContextType {
  completedLessons: Set<string>;
  xp: number;
  level: number;
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getProgress: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const savedProgress = localStorage.getItem('pythonProgress');
    if (savedProgress) {
      const { completed, userXp, userLevel } = JSON.parse(savedProgress);
      setCompletedLessons(new Set(completed));
      setXp(userXp);
      setLevel(userLevel);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pythonProgress', JSON.stringify({
      completed: Array.from(completedLessons),
      userXp: xp,
      userLevel: level
    }));
  }, [completedLessons, xp, level]);

  const completeLesson = (lessonId: string) => {
    if (!completedLessons.has(lessonId)) {
      const newCompleted = new Set(completedLessons);
      newCompleted.add(lessonId);
      setCompletedLessons(newCompleted);
      
      const newXp = xp + 100;
      setXp(newXp);
      
      const newLevel = Math.floor(newXp / 500) + 1;
      setLevel(newLevel);
    }
  };

  const isLessonCompleted = (lessonId: string) => completedLessons.has(lessonId);
  
  const getProgress = () => (completedLessons.size / 10) * 100;

  return (
    <ProgressContext.Provider value={{
      completedLessons,
      xp,
      level,
      completeLesson,
      isLessonCompleted,
      getProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
