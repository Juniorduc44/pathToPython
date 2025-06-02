/**
 * @file Index.tsx
 * @version 1.3.0
 * @description Main entry point for Python Quest, handling authentication routing and dashboard display.
 * This component now orchestrates the display of either the LoginPage or the main Dashboard
 * based on the user's authentication state. It integrates the new AuthContext for
 * self-custody keystore authentication and guest mode.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date May 31, 2025
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Code, Gamepad2, Zap, Heart, ChevronDown, Lock, UserPlus, LogOut, ShieldAlert, KeyRound } from 'lucide-react';
import LessonCard from '@/components/LessonCard';
import ProgressBar from '@/components/ProgressBar';
import ThemeToggle from '@/components/ThemeToggle';
import LessonView from '@/pages/LessonView';
import LoginPage from '@/components/LoginPage'; // Import the LoginPage
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProgressProvider, useProgress } from '@/contexts/ProgressContext';
import { AuthProvider, useAuth, AuthMode } from '@/contexts/AuthContext'; // Import Auth context and hook
import { lessons as allLessonsData, chapters as allChaptersData, Lesson } from '@/data/lessons';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const TOTAL_LESSONS = allLessonsData.length;

/**
 * @component Dashboard
 * @description The core UI component for the main learning dashboard.
 * Displays chapters, lessons, user progress, and auth-specific header elements.
 */
const Dashboard: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const { completedLessons, xp, level, getChapterProgress, isLessonCompleted } = useProgress();
  const { authMode, currentUser, logout, createAccount: upgradeToKeystoreAccount, isLoading: isAuthLoading } = useAuth();
  
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>(
    allChaptersData.length > 0 ? `chapter-${allChaptersData[0].id}` : undefined
  );

  // State for guest-to-keystore upgrade modal
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradePassword, setUpgradePassword] = useState('');
  const [upgradeConfirmPassword, setUpgradeConfirmPassword] = useState('');
  const [upgradeError, setUpgradeError] = useState<string | null>(null);


  const lessonsByChapter = useMemo(() => {
    const grouped: { [key: number]: Lesson[] } = {};
    allLessonsData.forEach(lesson => {
      if (!grouped[lesson.chapterId]) {
        grouped[lesson.chapterId] = [];
      }
      grouped[lesson.chapterId].push(lesson);
    });
    return grouped;
  }, []);

  const isChapterLocked = (chapterId: number): boolean => {
    if (chapterId === 1) return false;
    const previousChapterId = chapterId - 1;
    const prevChapterData = allChaptersData.find(ch => ch.id === previousChapterId);
    if (!prevChapterData) return true;
    const prevChapterLessons = lessonsByChapter[previousChapterId] || [];
    if (prevChapterLessons.length === 0) return true;
    return !prevChapterLessons.every(lesson => isLessonCompleted(lesson.id));
  };

  useEffect(() => {
    if (activeAccordionItem) {
      const chapterIdStr = activeAccordionItem.replace('chapter-', '');
      const chapterIdNum = parseInt(chapterIdStr, 10);
      if (!isNaN(chapterIdNum) && isChapterLocked(chapterIdNum)) {
        const firstUnlockedChapter = allChaptersData.find(ch => !isChapterLocked(ch.id));
        setActiveAccordionItem(firstUnlockedChapter ? `chapter-${firstUnlockedChapter.id}` : undefined);
      }
    }
  }, [activeAccordionItem, isChapterLocked, allChaptersData]);


  const handleUpgradeAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeError(null);
    if (upgradePassword !== upgradeConfirmPassword) {
      setUpgradeError("Passwords do not match.");
      return;
    }
    if (upgradePassword.length < 8) {
      setUpgradeError("Password must be at least 8 characters long.");
      return;
    }
    try {
      await upgradeToKeystoreAccount(upgradePassword); // This will create account and download keystore
      setIsUpgradeModalOpen(false); // Close modal on success
      setUpgradePassword('');
      setUpgradeConfirmPassword('');
      // AuthContext handles mode change; progress is preserved via localStorage.
    } catch (err: any) {
      setUpgradeError(err.message || "Failed to create account.");
    }
  };


  if (selectedLesson) {
    const lessonDetail = allLessonsData.find(l => l.id === selectedLesson);
    if (!lessonDetail) {
      console.error(`Error: Lesson with ID "${selectedLesson}" not found. Returning to dashboard.`);
      setSelectedLesson(null);
      return <div className="p-8 text-center text-red-500 text-lg">Error: The requested lesson could not be found. Please try again.</div>;
    }
    return (
      <LessonView
        lessonId={selectedLesson}
        chapterId={lessonDetail.chapterId}
        onBack={() => setSelectedLesson(null)}
        setSelectedLesson={setSelectedLesson}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header className="border-b border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3"> {/* Reduced padding for header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-green-500 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                  Python Quest
                </h1>
                <p className="text-xs md:text-sm text-gray-400">Level up your coding skills</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {authMode === 'guest' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-green-500 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                  onClick={() => setIsUpgradeModalOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-1 md:mr-2" /> Create Account
                </Button>
              )}
              {authMode === 'keystore' && currentUser && (
                <>
                  <span className="text-xs text-gray-400 hidden md:inline">
                    ID: {currentUser.publicKeyHex.substring(0, 6)}...{currentUser.publicKeyHex.slice(-4)}
                  </span>
                  <Button size="sm" variant="outline" onClick={logout} className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    <LogOut className="h-4 w-4 mr-1 md:mr-2" /> Logout
                  </Button>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {authMode === 'guest' && (
         <Alert className="container mx-auto mt-4 max-w-3xl bg-purple-900/30 border-purple-500/50 text-purple-300">
            <ShieldAlert className="h-5 w-5 text-purple-400" />
            <AlertTitle className="font-semibold text-purple-300">You are in Guest Mode!</AlertTitle>
            <AlertDescription className="text-sm text-purple-400">
              Your progress is saved locally in this browser. To secure your progress permanently and access it anywhere, 
              <Button variant="link" className="p-0 h-auto text-green-400 hover:text-green-300 underline ml-1" onClick={() => setIsUpgradeModalOpen(true)}>
                create a free Keystore Account
              </Button>.
            </AlertDescription>
          </Alert>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ProgressBar />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Master Python Programming
          </h2>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Learn Python through interactive lessons, hands-on coding challenges, and gamified progress tracking.
          </p>
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
              <span className="text-gray-300">Low Latency</span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <Accordion 
            type="single" 
            collapsible 
            className="w-full space-y-4"
            value={activeAccordionItem}
            onValueChange={setActiveAccordionItem}
          >
            {allChaptersData.map((chapter) => {
              const chapterLessons = lessonsByChapter[chapter.id] || [];
              const chapterProgress = getChapterProgress(chapter.id);
              const isCurrentChapterLocked = isChapterLocked(chapter.id);

              return (
                <AccordionItem 
                  value={`chapter-${chapter.id}`} 
                  key={chapter.id}
                  className="bg-gray-800/70 border border-cyan-500/30 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger 
                    className={`px-6 py-4 hover:bg-cyan-500/10 transition-colors duration-200 ${isCurrentChapterLocked ? 'cursor-not-allowed opacity-70' : ''}`}
                    disabled={isCurrentChapterLocked}
                    onClick={() => {
                      if (!isCurrentChapterLocked) {
                        setActiveAccordionItem(prevItem => 
                          prevItem === `chapter-${chapter.id}` ? undefined : `chapter-${chapter.id}`
                        );
                      }
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="text-left">
                        <h3 className={`text-xl font-semibold ${isCurrentChapterLocked ? 'text-gray-500' : 'text-cyan-400'}`}>
                          Chapter {chapter.id}: {chapter.title}
                        </h3>
                        <p className={`text-sm ${isCurrentChapterLocked ? 'text-gray-600' : 'text-gray-400'}`}>{chapter.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {isCurrentChapterLocked && <Lock className="h-5 w-5 text-gray-500" />}
                        {!isCurrentChapterLocked && chapterLessons.length > 0 && (
                          <span className="text-xs text-gray-300">
                            {chapterProgress.completed}/{chapterProgress.total} Lessons
                          </span>
                        )}
                        <ChevronDown 
                          className={`h-5 w-5 transition-transform duration-200 ${activeAccordionItem === `chapter-${chapter.id}` && !isCurrentChapterLocked ? 'rotate-180' : ''} ${isCurrentChapterLocked ? 'text-gray-600' : 'text-cyan-400'}`} 
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-6 border-t border-cyan-500/20 bg-gray-900/30">
                    {isCurrentChapterLocked ? (
                      <p className="text-gray-500 text-center">Complete previous chapters to unlock.</p>
                    ) : chapterLessons.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapterLessons.map((lesson, index) => {
                          const individualLessonIsLocked = index > 0 && !isLessonCompleted(chapterLessons[index - 1].id);
                          return (
                            <LessonCard
                              key={lesson.id}
                              id={lesson.id}
                              title={lesson.title}
                              description={lesson.description}
                              difficulty={lesson.difficulty}
                              isLocked={individualLessonIsLocked}
                              onClick={() => setSelectedLesson(lesson.id)}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center">Lessons for this chapter are coming soon!</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{completedLessons.size}/{TOTAL_LESSONS}</div>
            <div className="text-gray-300">Lessons Completed</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{xp}</div>
            <div className="text-gray-300">XP Earned</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{level}</div>
            <div className="text-gray-300">Current Level</div>
          </div>
        </div>

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

      {/* Modal for Guest to Keystore Upgrade */}
      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent className="bg-gray-800 border-green-500/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-green-400 flex items-center">
              <KeyRound className="mr-2" /> Secure Your Progress
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a self-custody keystore account to save your current progress permanently. Choose a strong password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpgradeAccountSubmit} className="space-y-4 pt-4">
            <div>
              <label htmlFor="upgradePassword" className="text-sm font-medium text-gray-300">New Password</label>
              <Input
                id="upgradePassword"
                type="password"
                value={upgradePassword}
                onChange={(e) => setUpgradePassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                disabled={isAuthLoading}
              />
            </div>
            <div>
              <label htmlFor="upgradeConfirmPassword" className="text-sm font-medium text-gray-300">Confirm Password</label>
              <Input
                id="upgradeConfirmPassword"
                type="password"
                value={upgradeConfirmPassword}
                onChange={(e) => setUpgradeConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                disabled={isAuthLoading}
              />
            </div>
            {upgradeError && <p className="text-sm text-red-400 flex items-center"><ShieldAlert size={16} className="mr-1" />{upgradeError}</p>}
            <DialogFooter className="sm:justify-start pt-2">
              <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white" disabled={isAuthLoading}>
                {isAuthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Create Account & Download Keystore
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full mt-2 sm:mt-0 border-gray-600 text-gray-300 hover:bg-gray-700" disabled={isAuthLoading}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/**
 * @component AppContentRouter
 * @description Handles routing based on authentication state.
 * Renders LoginPage if unauthenticated, otherwise renders the DashboardWrapper.
 */
const AppContentRouter: React.FC = () => {
  const { authMode, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (authMode === 'unauthenticated') {
    return <LoginPage />;
  }

  // If guest or keystore, show the main dashboard content
  // ProgressProvider is specific to the learning content, so it wraps the Dashboard
  return (
    <ProgressProvider>
      <Dashboard />
    </ProgressProvider>
  );
};

/**
 * @component Index
 * @description Root component for the Python Quest application.
 * Sets up all necessary context providers (Auth, Theme) and renders the AppContentRouter.
 */
const Index: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="python-quest-ui-theme">
        <AppContentRouter />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Index;
