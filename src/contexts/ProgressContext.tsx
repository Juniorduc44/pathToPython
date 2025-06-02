/**
 * @file ProgressContext.tsx
 * @version 1.3.0
 * @description Manages user progress, including completed lessons, experience points (XP), and levels.
 * This context provides a centralized way to track and update user achievements throughout the
 * Python Quest application. It now handles persistence of progress data scoped by authentication
 * mode and user identity, using sessionStorage for guests and localStorage for authenticated users.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date June 2, 2025
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { lessons as allLessonsData, Lesson } from '@/data/lessons';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth to access authentication state

// =====================================================================================
// CONSTANTS
// =====================================================================================
const TOTAL_LESSONS = 100;
const XP_PER_LESSON = 100;
const XP_PER_LEVEL = 500;

const GUEST_PROGRESS_SESSION_KEY = 'pythonProgress_guest';
const USER_PROGRESS_LOCAL_KEY_PREFIX = 'pythonProgress_user_';

// =====================================================================================
// INTERFACE DEFINITIONS
// =====================================================================================
interface ProgressContextType {
  completedLessons: Set<string>;
  xp: number;
  level: number;
  isLoadingProgress: boolean; // Added to indicate when progress is being loaded
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getOverallProgress: () => number;
  getChapterProgress: (chapterId: number) => { completed: number; total: number; percentage: number };
  getTotalLessonsInChapter: (chapterId: number) => number;
  clearProgress: () => void; // Added to explicitly clear progress
}

// =====================================================================================
// CONTEXT CREATION
// =====================================================================================
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// =====================================================================================
// PROVIDER COMPONENT
// =====================================================================================
export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { authMode, currentUser, isLoading: isAuthLoading } = useAuth(); // Get auth state

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);

  const getStorageKey = useCallback((): string | null => {
    if (authMode === 'guest') {
      return GUEST_PROGRESS_SESSION_KEY;
    }
    if (authMode === 'keystore' && currentUser?.publicKeyHex) {
      return `${USER_PROGRESS_LOCAL_KEY_PREFIX}${currentUser.publicKeyHex}`;
    }
    return null;
  }, [authMode, currentUser]);

  const getStorage = useCallback((): Storage | null => {
    if (authMode === 'guest') {
      return sessionStorage;
    }
    if (authMode === 'keystore' && currentUser?.publicKeyHex) {
      return localStorage;
    }
    return null;
  }, [authMode, currentUser]);
  
  // Function to reset progress state
  const resetProgressState = useCallback(() => {
    console.debug("[ProgressContext] Resetting progress state to defaults.");
    setCompletedLessons(new Set());
    setXp(0);
    setLevel(1);
  }, []);

  // Effect for Loading Progress based on Auth State
  useEffect(() => {
    if (isAuthLoading) {
      // Wait for authentication to initialize
      setIsLoadingProgress(true);
      return;
    }

    setIsLoadingProgress(true);
    console.debug(`[ProgressContext] Auth mode changed to: ${authMode}. Current user: ${currentUser?.publicKeyHex}. Attempting to load progress.`);

    const storage = getStorage();
    const storageKey = getStorageKey();

    if (authMode === 'unauthenticated' || !storage || !storageKey) {
      console.debug("[ProgressContext] Unauthenticated or no storage key. Resetting progress state.");
      resetProgressState();
      setIsLoadingProgress(false);
      return;
    }
    
    try {
      const savedProgressString = storage.getItem(storageKey);
      if (savedProgressString) {
        console.debug(`[ProgressContext] Found saved progress for key: ${storageKey}`);
        const savedProgress = JSON.parse(savedProgressString);
        if (
          savedProgress &&
          Array.isArray(savedProgress.completed) &&
          typeof savedProgress.userXp === 'number' &&
          typeof savedProgress.userLevel === 'number'
        ) {
          setCompletedLessons(new Set(savedProgress.completed));
          setXp(savedProgress.userXp);
          setLevel(savedProgress.userLevel);
          console.debug("[ProgressContext] Progress loaded successfully:", savedProgress);
        } else {
          console.warn(`[ProgressContext] Malformed progress data for key: ${storageKey}. Resetting.`);
          resetProgressState();
          storage.removeItem(storageKey); // Clean up malformed data
        }
      } else {
        console.debug(`[ProgressContext] No saved progress found for key: ${storageKey}. Resetting to default state.`);
        resetProgressState(); // No data found, so reset to default state for this user/guest session
      }
    } catch (error) {
      console.error(`[ProgressContext] Error loading progress for key ${storageKey}:`, error);
      resetProgressState(); // Reset on error
    } finally {
      setIsLoadingProgress(false);
    }
  }, [authMode, currentUser, isAuthLoading, resetProgressState, getStorage, getStorageKey]);


  // Effect for Saving Progress based on Auth State
  useEffect(() => {
    // Don't save if progress is still loading or auth is initializing
    if (isLoadingProgress || isAuthLoading) return;

    const storage = getStorage();
    const storageKey = getStorageKey();

    if (authMode === 'unauthenticated' || !storage || !storageKey) {
      // If unauthenticated, we don't save. Any specific clearing is handled by logout logic.
      console.debug("[ProgressContext] Unauthenticated or no storage key. Not saving progress.");
      return;
    }

    try {
      const progressToSave = {
        completed: Array.from(completedLessons),
        userXp: xp,
        userLevel: level,
      };
      storage.setItem(storageKey, JSON.stringify(progressToSave));
      console.debug(`[ProgressContext] Progress saved for key ${storageKey}:`, progressToSave);
    } catch (error) {
      console.error(`[ProgressContext] Error saving progress for key ${storageKey}:`, error);
    }
  }, [completedLessons, xp, level, authMode, currentUser, isLoadingProgress, isAuthLoading, getStorage, getStorageKey]);

  const completeLesson = (lessonId: string): void => {
    if (!completedLessons.has(lessonId)) {
      const newCompletedLessons = new Set(completedLessons);
      newCompletedLessons.add(lessonId);
      setCompletedLessons(newCompletedLessons);
      
      const newXp = xp + XP_PER_LESSON;
      setXp(newXp);
      
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      setLevel(newLevel);
      console.debug(`[ProgressContext] Lesson ${lessonId} completed. New XP: ${newXp}, New Level: ${newLevel}`);
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => completedLessons.has(lessonId);
  
  const getOverallProgress = (): number => {
    if (TOTAL_LESSONS === 0) return 0;
    return (completedLessons.size / TOTAL_LESSONS) * 100;
  };

  const getLessonsByChapter = (chapterId: number): Lesson[] => {
    return allLessonsData.filter(lesson => lesson.chapterId === chapterId);
  };

  const getTotalLessonsInChapter = (chapterId: number): number => {
    return getLessonsByChapter(chapterId).length;
  };

  const getChapterProgress = (chapterId: number): { completed: number; total: number; percentage: number } => {
    const chapterLessons = getLessonsByChapter(chapterId);
    const totalChapterLessons = chapterLessons.length;

    if (totalChapterLessons === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    
    const completedChapterLessons = chapterLessons.filter(lesson => completedLessons.has(lesson.id)).length;
    
    return {
      completed: completedChapterLessons,
      total: totalChapterLessons,
      percentage: totalChapterLessons > 0 ? (completedChapterLessons / totalChapterLessons) * 100 : 0,
    };
  };

  const clearProgress = useCallback(() => {
    console.debug("[ProgressContext] clearProgress called. Clearing current progress state and storage for active mode.");
    const storage = getStorage();
    const storageKey = getStorageKey();
    if (storage && storageKey) {
        try {
            storage.removeItem(storageKey);
            console.debug(`[ProgressContext] Removed item from storage with key: ${storageKey}`);
        } catch (error) {
            console.error(`[ProgressContext] Error removing item from storage with key ${storageKey}:`, error);
        }
    }
    resetProgressState();
  }, [resetProgressState, getStorage, getStorageKey]);


  return (
    <ProgressContext.Provider value={{
      completedLessons,
      xp,
      level,
      isLoadingProgress,
      completeLesson,
      isLessonCompleted,
      getOverallProgress,
      getChapterProgress,
      getTotalLessonsInChapter,
      clearProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

// =====================================================================================
// CUSTOM HOOK
// =====================================================================================
export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider. Ensure your component tree is wrapped correctly.');
  }
  return context;
};
