/**
 * @file Index.tsx
 * @version 1.2.0
 * @description Main dashboard page for Python Quest.
 * This component orchestrates the display of the curriculum, including chapters and lessons,
 * manages user navigation to individual lesson views, and showcases overall progress.
 * It leverages context for progress tracking and theme management, providing a seamless
 * and gamified learning experience.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date May 31, 2025
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Code, Gamepad2, Zap, Heart, ChevronDown, Lock } from 'lucide-react';
import LessonCard from '@/components/LessonCard';
import ProgressBar from '@/components/ProgressBar';
import ThemeToggle from '@/components/ThemeToggle';
import LessonView from '@/pages/LessonView';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProgressProvider, useProgress } from '@/contexts/ProgressContext';
import { lessons as allLessonsData, chapters as allChaptersData, Lesson, Chapter } from '@/data/lessons'; // Renamed for clarity
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define a constant for the total number of lessons, derived from the curriculum data.
// This ensures accuracy if the number of lessons changes in `lessons.ts`.
const TOTAL_LESSONS = allLessonsData.length;

/**
 * @component Dashboard
 * @description The core UI component for the main learning dashboard.
 * It displays chapters and lessons, handles lesson selection, and shows user progress.
 * This component is responsible for the primary user interface where learners interact with the curriculum.
 *
 * Key functionalities:
 * - Renders the main header with the application title and theme toggle.
 * - Displays the user's overall progress bar.
 * - Presents a hero section with a motivational message and key platform features.
 * - Organizes lessons into chapters using an accordion interface.
 * - Implements logic for locking/unlocking chapters and lessons based on user progress.
 * - Navigates to the `LessonView` component when a lesson is selected.
 * - Shows user statistics like completed lessons, XP earned, and current level.
 * - Includes a section for supporting the platform.
 *
 * @returns {JSX.Element} The rendered dashboard.
 */
const Dashboard: React.FC = () => {
  // State to manage the currently selected lesson ID. If null, the dashboard is shown.
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  // Access progress data and functions from the ProgressContext.
  const { completedLessons, xp, level, getChapterProgress, isLessonCompleted } = useProgress();

  // State to manage which accordion item (chapter) is currently open.
  // Defaults to the first chapter being open.
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>(
    allChaptersData.length > 0 ? `chapter-${allChaptersData[0].id}` : undefined
  );

  /**
   * @memoizedValue lessonsByChapter
   * @description Groups all lessons by their `chapterId` for efficient rendering and access.
   * This is memoized to prevent re-computation on every render unless `allLessonsData` changes.
   * @returns {Object.<number, Lesson[]>} A dictionary where keys are chapter IDs and values are arrays of lessons.
   */
  const lessonsByChapter = useMemo(() => {
    const grouped: { [key: number]: Lesson[] } = {};
    allLessonsData.forEach(lesson => {
      if (!grouped[lesson.chapterId]) {
        grouped[lesson.chapterId] = [];
      }
      grouped[lesson.chapterId].push(lesson);
    });
    return grouped;
  }, []); // Dependency: allLessonsData (if it were dynamic, it would be listed here)

  /**
   * @function isChapterLocked
   * @description Determines if a chapter should be locked based on the completion of the previous chapter.
   * The first chapter is always unlocked. Subsequent chapters unlock if all lessons
   * in the *immediately preceding* chapter are completed.
   * @param {number} chapterId - The ID of the chapter to check.
   * @returns {boolean} True if the chapter is locked, false otherwise.
   */
  const isChapterLocked = (chapterId: number): boolean => {
    if (chapterId === 1) return false; // Chapter 1 is never locked.

    const previousChapterId = chapterId - 1;
    const prevChapterData = allChaptersData.find(ch => ch.id === previousChapterId);

    // If the previous chapter doesn't exist (e.g., misconfigured chapter IDs), treat current as locked.
    if (!prevChapterData) return true; 

    const prevChapterLessons = lessonsByChapter[previousChapterId] || [];

    // If the previous chapter has no lessons defined, it cannot be "completed".
    // In this specific logic, if a preceding chapter has no lessons, subsequent chapters are locked.
    // This encourages defining lessons for all preceding chapters.
    if (prevChapterLessons.length === 0) return true; 

    // A chapter is locked if NOT ALL lessons in the previous chapter are completed.
    return !prevChapterLessons.every(lesson => isLessonCompleted(lesson.id));
  };

  // Effect to handle accordion behavior when a locked chapter is clicked.
  // If a user tries to open a locked chapter, this keeps the accordion closed
  // or reverts to the previously open, unlocked chapter.
  useEffect(() => {
    if (activeAccordionItem) {
      const chapterIdStr = activeAccordionItem.replace('chapter-', '');
      const chapterIdNum = parseInt(chapterIdStr, 10);
      if (!isNaN(chapterIdNum) && isChapterLocked(chapterIdNum)) {
        // If the currently active item is locked, find the first unlocked chapter and open it.
        // Or, if none are unlocked (besides chapter 1), default to chapter 1 or undefined.
        const firstUnlockedChapter = allChaptersData.find(ch => !isChapterLocked(ch.id));
        setActiveAccordionItem(firstUnlockedChapter ? `chapter-${firstUnlockedChapter.id}` : undefined);
      }
    }
  }, [activeAccordionItem, isChapterLocked, allChaptersData]);


  // Conditional rendering: If a lesson is selected, render the LessonView.
  // Otherwise, render the main dashboard.
  if (selectedLesson) {
    // Find the details of the selected lesson to pass to LessonView.
    const lessonDetail = allLessonsData.find(l => l.id === selectedLesson);

    // Error handling: If the selected lesson ID doesn't correspond to any known lesson.
    // This could happen due to URL manipulation or data inconsistency.
    if (!lessonDetail) {
        // Log an error for developers and reset selection to prevent a broken state.
        console.error(`Error: Lesson with ID "${selectedLesson}" not found. Returning to dashboard.`);
        setSelectedLesson(null); 
        // Display a user-friendly error message.
        return <div className="p-8 text-center text-red-500 text-lg">Error: The requested lesson could not be found. Please try again.</div>;
    }
    // Render the LessonView component, passing necessary props for lesson display and navigation.
    return (
      <LessonView
        lessonId={selectedLesson}
        chapterId={lessonDetail.chapterId}
        onBack={() => setSelectedLesson(null)} // Callback to return to the dashboard
        setSelectedLesson={setSelectedLesson}   // Callback for next/prev lesson navigation within LessonView
      />
    );
  }

  // Main dashboard layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header Section: Contains application title and theme toggle. Sticky for easy access. */}
      <header className="border-b border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Application Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-green-500 rounded-lg">
                <Code className="h-6 w-6 text-white" /> {/* Icon representing coding */}
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                  Python Quest
                </h1>
                <p className="text-sm text-gray-400">Level up your coding skills</p>
              </div>
            </div>
            {/* Theme Toggle Component */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar Section: Displays overall user progress. */}
        <div className="mb-8">
          <ProgressBar /> {/* ProgressBar component now uses getOverallProgress from context */}
        </div>

        {/* Hero Section: Motivational message and platform features. */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Master Python Programming
          </h2>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Learn Python through interactive lessons, hands-on coding challenges, and gamified progress tracking.
          </p>
          {/* Feature Highlights: Uses icons for visual appeal. */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm">
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
              <span className="text-gray-300">Low Latency</span> {/* (PyScript execution) */}
            </div>
          </div>
        </div>

        {/* Chapters Accordion Section: Displays the curriculum organized by chapters. */}
        <div className="mb-12">
          <Accordion 
            type="single" // Allows only one accordion item to be open at a time
            collapsible // Allows closing the currently open item
            className="w-full space-y-4"
            value={activeAccordionItem} // Controlled component: current open item
            onValueChange={setActiveAccordionItem} // Handler to update the open item state
          >
            {allChaptersData.map((chapter) => {
              // Retrieve lessons for the current chapter.
              const chapterLessons = lessonsByChapter[chapter.id] || [];
              // Get progress details for the current chapter.
              const chapterProgress = getChapterProgress(chapter.id);
              // Determine if the current chapter is locked.
              const isCurrentChapterLocked = isChapterLocked(chapter.id);

              return (
                <AccordionItem 
                  value={`chapter-${chapter.id}`} // Unique value for each accordion item
                  key={chapter.id}
                  className="bg-gray-800/70 border border-cyan-500/30 rounded-lg overflow-hidden"
                >
                  {/* Accordion Trigger: Clickable header to expand/collapse chapter content. */}
                  <AccordionTrigger 
                    className={`px-6 py-4 hover:bg-cyan-500/10 transition-colors duration-200 ${isCurrentChapterLocked ? 'cursor-not-allowed opacity-70' : ''}`}
                    disabled={isCurrentChapterLocked} // Disable trigger if chapter is locked
                    // Custom click handler to manage accordion state for locked chapters
                    // and allow toggling of unlocked chapters.
                    onClick={() => {
                      if (!isCurrentChapterLocked) {
                        setActiveAccordionItem(prevItem => 
                          prevItem === `chapter-${chapter.id}` ? undefined : `chapter-${chapter.id}`
                        );
                      }
                      // If locked, the `disabled` prop should prevent interaction, but this is a fallback.
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      {/* Chapter Title and Description */}
                      <div className="text-left">
                        <h3 className={`text-xl font-semibold ${isCurrentChapterLocked ? 'text-gray-500' : 'text-cyan-400'}`}>
                          Chapter {chapter.id}: {chapter.title}
                        </h3>
                        <p className={`text-sm ${isCurrentChapterLocked ? 'text-gray-600' : 'text-gray-400'}`}>{chapter.description}</p>
                      </div>
                      {/* Chapter Status Icons and Progress */}
                      <div className="flex items-center gap-3">
                        {isCurrentChapterLocked && <Lock className="h-5 w-5 text-gray-500" />}
                        {!isCurrentChapterLocked && chapterLessons.length > 0 && ( // Only show progress if not locked and has lessons
                          <span className="text-xs text-gray-300">
                            {chapterProgress.completed}/{chapterProgress.total} Lessons
                          </span>
                        )}
                        {/* Chevron icon indicates open/closed state of accordion. */}
                        <ChevronDown 
                          className={`h-5 w-5 transition-transform duration-200 ${activeAccordionItem === `chapter-${chapter.id}` && !isCurrentChapterLocked ? 'rotate-180' : ''} ${isCurrentChapterLocked ? 'text-gray-600' : 'text-cyan-400'}`} 
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  {/* Accordion Content: Contains the list of lessons for the chapter. */}
                  <AccordionContent className="px-6 py-6 border-t border-cyan-500/20 bg-gray-900/30">
                    {isCurrentChapterLocked ? (
                      // Message displayed if the chapter is locked.
                      <p className="text-gray-500 text-center">Complete previous chapters to unlock.</p>
                    ) : chapterLessons.length > 0 ? (
                      // Grid layout for lesson cards. Responsive columns.
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapterLessons.map((lesson, index) => {
                          // Individual Lesson Locking Logic:
                          // A lesson is locked if it's not the first lesson in its chapter
                          // AND the immediately preceding lesson in the SAME chapter is not completed.
                          // This ensures sequential progression within a chapter.
                          const individualLessonIsLocked = index > 0 && !isLessonCompleted(chapterLessons[index - 1].id);
                          
                          return (
                            <LessonCard
                              key={lesson.id}
                              id={lesson.id}
                              title={lesson.title}
                              description={lesson.description}
                              difficulty={lesson.difficulty}
                              isLocked={individualLessonIsLocked} // Pass lock status to LessonCard
                              onClick={() => setSelectedLesson(lesson.id)} // Set selected lesson on click
                            />
                          );
                        })}
                      </div>
                    ) : (
                      // Message displayed if an unlocked chapter has no lessons defined yet.
                      <p className="text-gray-400 text-center">Lessons for this chapter are coming soon!</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* User Statistics Section: Displays key gamification metrics. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Lessons Completed Stat */}
          <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{completedLessons.size}/{TOTAL_LESSONS}</div>
            <div className="text-gray-300">Lessons Completed</div>
          </div>
          {/* XP Earned Stat */}
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{xp}</div>
            <div className="text-gray-300">XP Earned</div>
          </div>
          {/* Current Level Stat */}
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{level}</div>
            <div className="text-gray-300">Current Level</div>
          </div>
        </div>

        {/* Donations/Support Section: A call to action for supporting the platform. */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-8 max-w-md mx-auto">
            <Heart className="h-8 w-8 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-400 mb-2">Support Python Quest</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Help us keep this platform free and continue adding new lessons and features!
            </p>
            {/* Button links to an external donation page. */}
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

/**
 * @component Index
 * @description Root component for the dashboard page.
 * It wraps the `Dashboard` component with necessary context providers (`ThemeProvider` and `ProgressProvider`)
 * to ensure that theme and progress state are available throughout the application.
 * @returns {JSX.Element} The Dashboard component wrapped with context providers.
 */
const Index: React.FC = () => {
  return (
    // ThemeProvider manages dark/light mode.
    <ThemeProvider>
      {/* ProgressProvider manages all user progress data (lessons, XP, levels). */}
      <ProgressProvider>
        <Dashboard />
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default Index;
