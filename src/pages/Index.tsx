import React, { useState, useMemo, useEffect } from 'react';
import { Code, Gamepad2, Zap, Heart, ChevronDown, Lock, UserPlus, LogOut } from 'lucide-react';
import LessonCard from '@/components/LessonCard';
import ProgressBar from '@/components/ProgressBar';
import ThemeToggle from '@/components/ThemeToggle';
import LessonView from '@/pages/LessonView';
import LoginPage from '@/components/LoginPage';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProgressProvider, useProgress } from '@/contexts/ProgressContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { lessons as allLessonsData, chapters as allChaptersData, Lesson } from '@/data/lessons';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TOTAL_LESSONS = allLessonsData.length;

const Dashboard: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const { completedLessons, xp, level, getChapterProgress, isLessonCompleted } = useProgress();
  const { user, profile, signOut, isAuthenticated } = useAuth();
  
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>(
    allChaptersData.length > 0 ? `chapter-${allChaptersData[0].id}` : undefined
  );

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
        <div className="container mx-auto px-4 py-4">
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
              {isAuthenticated && user && (
                <>
                  <span className="text-sm text-gray-400 hidden md:inline">
                    Welcome, {profile?.username || user.email}
                  </span>
                  <Button size="sm" variant="outline" onClick={signOut} className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

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
    </div>
  );
};

const AppContentRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <ProgressProvider>
      <Dashboard />
    </ProgressProvider>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContentRouter />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Index;