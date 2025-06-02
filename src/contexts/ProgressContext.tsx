/**
 * @file ProgressContext.tsx
 * @version 1.2.0
 * @description Manages user progress, including completed lessons, experience points (XP), and levels.
 * This context provides a centralized way to track and update user achievements throughout the
 * Python Quest application. It also handles persistence of progress data to local storage.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date May 31, 2025
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lessons as allLessonsData, Lesson } from '@/data/lessons'; // Import lessons data for chapter calculations

// =====================================================================================
// CONSTANTS
// =====================================================================================
// These constants define the core parameters of the gamification system.
// Modifying these will directly impact how users earn XP and level up.
// =====================================================================================

/** @const {number} TOTAL_LESSONS - The total number of lessons in the entire curriculum. Used for overall progress calculation. */
const TOTAL_LESSONS = 100; // Currently, 10 chapters * 10 lessons each (as per curriculum design)

/** @const {number} XP_PER_LESSON - Experience points awarded for completing a single lesson. */
const XP_PER_LESSON = 100;

/** @const {number} XP_PER_LEVEL - The total experience points required to advance one level. */
const XP_PER_LEVEL = 500; // e.g., Level 1: 0-499 XP, Level 2: 500-999 XP, etc.

// =====================================================================================
// INTERFACE DEFINITIONS
// =====================================================================================

/**
 * @interface ProgressContextType
 * @description Defines the shape of the progress context data and actions.
 * This interface ensures type safety for consumers of the ProgressContext.
 */
interface ProgressContextType {
  /** 
   * @property {Set<string>} completedLessons - A set of lesson IDs that the user has successfully completed.
   * Using a Set provides efficient O(1) average time complexity for add and check operations.
   */
  completedLessons: Set<string>;

  /** 
   * @property {number} xp - The total experience points (XP) accumulated by the user.
   * XP is earned by completing lessons and contributes to leveling up.
   */
  xp: number;

  /** 
   * @property {number} level - The current level achieved by the user based on their total XP.
   * Levels provide a sense of progression and achievement.
   */
  level: number;

  /**
   * @function completeLesson
   * @description Marks a lesson as completed, updates XP, and recalculates the user's level.
   * This is the primary action for recording user progress.
   * @param {string} lessonId - The unique identifier of the lesson being completed.
   * @returns {void}
   */
  completeLesson: (lessonId: string) => void;

  /**
   * @function isLessonCompleted
   * @description Checks if a specific lesson has been completed by the user.
   * @param {string} lessonId - The unique identifier of the lesson to check.
   * @returns {boolean} True if the lesson is completed, false otherwise.
   */
  isLessonCompleted: (lessonId: string) => boolean;

  /**
   * @function getOverallProgress
   * @description Calculates the user's overall progress percentage based on completed lessons.
   * @returns {number} The overall progress percentage (0-100).
   */
  getOverallProgress: () => number;

  /**
   * @function getChapterProgress
   * @description Calculates the user's progress within a specific chapter.
   * @param {number} chapterId - The unique identifier of the chapter.
   * @returns {{ completed: number; total: number; percentage: number }} An object containing the number of completed lessons,
   * total lessons in the chapter, and the completion percentage for that chapter.
   */
  getChapterProgress: (chapterId: number) => { completed: number; total: number; percentage: number };
  
  /**
   * @function getTotalLessonsInChapter
   * @description Retrieves the total number of lessons within a specific chapter.
   * @param {number} chapterId - The unique identifier of the chapter.
   * @returns {number} The total number of lessons in the specified chapter.
   */
  getTotalLessonsInChapter: (chapterId: number) => number;
}

// =====================================================================================
// CONTEXT CREATION
// =====================================================================================

/**
 * @const {React.Context<ProgressContextType | undefined>} ProgressContext
 * @description The React Context object for managing user progress.
 * Initialized with `undefined` and will be provided a value by `ProgressProvider`.
 */
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// =====================================================================================
// PROVIDER COMPONENT
// =====================================================================================

/**
 * @component ProgressProvider
 * @description Provides the ProgressContext to its children.
 * It encapsulates the state management logic for user progress, including loading from
 * and saving to local storage, and calculating XP and levels.
 * @param {{ children: ReactNode }} props - The child components that will have access to this context.
 * @returns {JSX.Element} The provider component wrapping its children.
 */
export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for tracking completed lessons (IDs are stored in a Set for efficient lookups)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  // State for tracking total accumulated XP
  const [xp, setXp] = useState<number>(0);
  // State for tracking the user's current level
  const [level, setLevel] = useState<number>(1);

  /**
   * @effect useEffect (Load Progress)
   * @description Loads user progress from local storage when the component mounts.
   * This ensures that user progress persists across sessions.
   * Includes basic data validation to handle potentially malformed stored data.
   */
  useEffect(() => {
    const savedProgressString = localStorage.getItem('pythonProgress');
    if (savedProgressString) {
      try {
        const savedProgress = JSON.parse(savedProgressString);
        // Validate the structure and types of the loaded data
        if (
          savedProgress &&
          Array.isArray(savedProgress.completed) &&
          typeof savedProgress.userXp === 'number' &&
          typeof savedProgress.userLevel === 'number'
        ) {
          setCompletedLessons(new Set(savedProgress.completed));
          setXp(savedProgress.userXp);
          setLevel(savedProgress.userLevel);
        } else {
          // If data is malformed or missing expected fields, log an error and reset.
          console.warn('Malformed progress data in localStorage. Resetting progress.');
          localStorage.removeItem('pythonProgress'); // Clear invalid data
          // Optionally, initialize with default empty state if needed, though useState already does.
        }
      } catch (error) {
        // If JSON parsing fails, the data is corrupt.
        console.error("Failed to parse progress from localStorage. Resetting progress.", error);
        localStorage.removeItem('pythonProgress'); // Clear corrupt data
      }
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  /**
   * @effect useEffect (Save Progress)
   * @description Saves the current user progress (completed lessons, XP, level) to local storage
   * whenever any of these state variables change. This ensures data persistence.
   */
  useEffect(() => {
    localStorage.setItem('pythonProgress', JSON.stringify({
      completed: Array.from(completedLessons), // Convert Set to Array for JSON serialization
      userXp: xp,
      userLevel: level
    }));
  }, [completedLessons, xp, level]); // Dependencies: run effect when these states change

  /**
   * @function completeLesson
   * @description Marks a lesson as completed, updates XP, and recalculates the user's level.
   * If the lesson is already completed, no action is taken to prevent duplicate XP.
   * @param {string} lessonId - The ID of the lesson to mark as complete.
   */
  const completeLesson = (lessonId: string): void => {
    if (!completedLessons.has(lessonId)) {
      const newCompletedLessons = new Set(completedLessons);
      newCompletedLessons.add(lessonId);
      setCompletedLessons(newCompletedLessons);
      
      // Award XP for completing the lesson
      const newXp = xp + XP_PER_LESSON;
      setXp(newXp);
      
      // Calculate new level based on total XP
      // Leveling system: Each level requires XP_PER_LEVEL points.
      // Level = floor(totalXP / XP_PER_LEVEL) + 1
      // Example: 0-499 XP = Level 1, 500-999 XP = Level 2, etc.
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      setLevel(newLevel);
    }
  };

  /**
   * @function isLessonCompleted
   * @description Checks if a given lesson ID is present in the set of completed lessons.
   * @param {string} lessonId - The ID of the lesson to check.
   * @returns {boolean} True if the lesson is completed, false otherwise.
   */
  const isLessonCompleted = (lessonId: string): boolean => completedLessons.has(lessonId);
  
  /**
   * @function getOverallProgress
   * @description Calculates the overall progress percentage based on the number of completed lessons
   * relative to the total number of lessons defined in the curriculum.
   * @returns {number} Overall progress percentage (0-100). Returns 0 if TOTAL_LESSONS is 0 to prevent division by zero.
   */
  const getOverallProgress = (): number => {
    if (TOTAL_LESSONS === 0) return 0;
    return (completedLessons.size / TOTAL_LESSONS) * 100;
  };

  /**
   * @function getLessonsByChapter
   * @description Filters all lessons to find those belonging to a specific chapter.
   * @param {number} chapterId - The ID of the chapter.
   * @returns {Lesson[]} An array of Lesson objects for the specified chapter.
   * @private This is a helper function, not directly exposed by the context.
   */
  const getLessonsByChapter = (chapterId: number): Lesson[] => {
    return allLessonsData.filter(lesson => lesson.chapterId === chapterId);
  };

  /**
   * @function getTotalLessonsInChapter
   * @description Calculates the total number of lessons in a specific chapter.
   * @param {number} chapterId - The ID of the chapter.
   * @returns {number} The total number of lessons in that chapter.
   */
  const getTotalLessonsInChapter = (chapterId: number): number => {
    return getLessonsByChapter(chapterId).length;
  };

  /**
   * @function getChapterProgress
   * @description Calculates the completion progress for a specific chapter.
   * @param {number} chapterId - The ID of the chapter.
   * @returns {{ completed: number; total: number; percentage: number }} An object detailing
   * completed lessons, total lessons, and completion percentage for the chapter.
   * Returns 0 for all values if the chapter has no lessons.
   */
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
      percentage: (completedChapterLessons / totalChapterLessons) * 100
    };
  };

  // Provide the state and functions to children components
  return (
    <ProgressContext.Provider value={{
      completedLessons,
      xp,
      level,
      completeLesson,
      isLessonCompleted,
      getOverallProgress,
      getChapterProgress,
      getTotalLessonsInChapter
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

// =====================================================================================
// CUSTOM HOOK
// =====================================================================================

/**
 * @function useProgress
 * @description Custom hook to easily access the ProgressContext.
 * This hook simplifies the consumption of the progress state and actions in functional components.
 * It also includes a check to ensure it's used within a `ProgressProvider`.
 * @throws {Error} If used outside of a `ProgressProvider`.
 * @returns {ProgressContextType} The progress context value.
 */
export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    // This error is crucial for development to ensure correct context setup.
    throw new Error('useProgress must be used within a ProgressProvider. Ensure your component tree is wrapped correctly.');
  }
  return context;
};
