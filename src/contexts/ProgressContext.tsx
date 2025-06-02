/**
 * @file ProgressContext.tsx
 * @version 1.3.0
 * @description Manages user progress, including completed lessons, experience points (XP), and levels.
 * This context provides a centralized way to track and update user achievements throughout the
 * Python Quest application. It now handles persistence of progress data scoped by authentication
 * mode and user identity, using sessionStorage for guests and localStorage for authenticated users.
 * It also loads initial progress from a keystore file if provided by AuthContext.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date June 2, 2025
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { lessons as allLessonsData, Lesson } from '@/data/lessons';
import { useAuth, ProgressData as AuthProgressData } from '@/contexts/AuthContext'; // Import useAuth and ProgressData

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
  isLoadingProgress: boolean;
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getOverallProgress: () => number;
  getChapterProgress: (chapterId: number) => { completed: number; total: number; percentage: number };
  getTotalLessonsInChapter: (chapterId: number) => number;
  clearProgress: () => void;
  getCurrentProgressData: () => AuthProgressData; // To provide data for saving to keystore
}

// =====================================================================================
// CONTEXT CREATION
// =====================================================================================
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// =====================================================================================
// PROVIDER COMPONENT
// =====================================================================================
export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { authMode, currentUser, isLoading: isAuthLoading, initialProgressFromKeystore } = useAuth();

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);
  const [hasProcessedInitialKeystoreProgress, setHasProcessedInitialKeystoreProgress] = useState(false);

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
  
  const resetProgressState = useCallback(() => {
    console.debug("[ProgressContext] Resetting progress state to defaults.");
    setCompletedLessons(new Set());
    setXp(0);
    setLevel(1);
  }, []);

  // Effect for Loading Progress based on Auth State and Keystore Data
  useEffect(() => {
    if (isAuthLoading) {
      setIsLoadingProgress(true);
      return;
    }

    setIsLoadingProgress(true);
    console.debug(`[ProgressContext] Auth state updated. Mode: ${authMode}, User: ${currentUser?.publicKeyHex}, InitialKeystoreProgress: ${initialProgressFromKeystore ? 'Yes' : 'No'}`);

    // If auth mode changes, reset flag for processing initial keystore progress
    if (authMode !== 'keystore' || !currentUser) {
        setHasProcessedInitialKeystoreProgress(false);
    }
    
    const storage = getStorage();
    const storageKey = getStorageKey();

    if (authMode === 'keystore' && currentUser && initialProgressFromKeystore && !hasProcessedInitialKeystoreProgress) {
      console.debug(`[ProgressContext] Loading progress from initialProgressFromKeystore for user ${currentUser.publicKeyHex}`);
      setCompletedLessons(new Set(initialProgressFromKeystore.completedLessons));
      setXp(initialProgressFromKeystore.xp);
      setLevel(initialProgressFromKeystore.level);
      setHasProcessedInitialKeystoreProgress(true); // Mark as processed for this login/creation
      console.debug("[ProgressContext] Progress loaded from keystore data:", initialProgressFromKeystore);
      // This state will be saved to localStorage by the saving useEffect
    } else if (storage && storageKey) {
      try {
        const savedProgressString = storage.getItem(storageKey);
        if (savedProgressString) {
          console.debug(`[ProgressContext] Found saved progress in ${authMode === 'guest' ? 'sessionStorage' : 'localStorage'} for key: ${storageKey}`);
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
            console.debug("[ProgressContext] Progress loaded successfully from storage:", savedProgress);
          } else {
            console.warn(`[ProgressContext] Malformed progress data for key: ${storageKey}. Resetting.`);
            resetProgressState();
            storage.removeItem(storageKey);
          }
        } else {
          console.debug(`[ProgressContext] No saved progress found for key: ${storageKey}. Resetting to default state.`);
          resetProgressState();
        }
      } catch (error) {
        console.error(`[ProgressContext] Error loading progress for key ${storageKey}:`, error);
        resetProgressState();
      }
    } else { // Unauthenticated or unable to determine storage
      console.debug("[ProgressContext] Unauthenticated or no storage key. Resetting progress state.");
      resetProgressState();
    }
    setIsLoadingProgress(false);
  }, [authMode, currentUser, isAuthLoading, initialProgressFromKeystore, resetProgressState, getStorage, getStorageKey, hasProcessedInitialKeystoreProgress]);


  // Effect for Saving Progress based on Auth State
  useEffect(() => {
    if (isLoadingProgress || isAuthLoading) return;

    const storage = getStorage();
    const storageKey = getStorageKey();

    if (authMode === 'unauthenticated' || !storage || !storageKey) {
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
      console.debug(`[ProgressContext] Progress saved to ${authMode === 'guest' ? 'sessionStorage' : 'localStorage'} for key ${storageKey}:`, progressToSave);
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
    setHasProcessedInitialKeystoreProgress(false); // Reset this flag too
  }, [resetProgressState, getStorage, getStorageKey]);

  const getCurrentProgressData = useCallback((): AuthProgressData => {
    return {
      completedLessons: Array.from(completedLessons),
      xp,
      level,
    };
  }, [completedLessons, xp, level]);


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
      clearProgress,
      getCurrentProgressData
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
