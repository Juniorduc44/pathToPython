import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, BookOpen, Code, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditor from '@/components/CodeEditor';
import { useProgress } from '@/contexts/ProgressContext';
import { lessons as allLessonsData, chapters as allChaptersData, Lesson, Chapter } from '@/data/lessons';

interface LessonViewProps {
  lessonId: string;
  chapterId: number;
  onBack: () => void; // Used to go back to the main dashboard (sets selectedLesson to null)
  setSelectedLesson: (lessonId: string | null) => void; // Used for next/previous lesson navigation
}

const LessonView: React.FC<LessonViewProps> = ({ lessonId, chapterId, onBack, setSelectedLesson }) => {
  const { completeLesson, isLessonCompleted } = useProgress();
  const [showSolution, setShowSolution] = useState(false);

  const currentLesson = useMemo(() => allLessonsData.find(l => l.id === lessonId), [lessonId]);
  const currentChapter = useMemo(() => allChaptersData.find(c => c.id === chapterId), [chapterId]);

  const lessonsInCurrentChapter = useMemo(() => {
    return allLessonsData.filter(l => l.chapterId === chapterId);
  }, [chapterId]);

  const currentLessonIndexInChapter = useMemo(() => {
    return lessonsInCurrentChapter.findIndex(l => l.id === lessonId);
  }, [lessonId, lessonsInCurrentChapter]);

  const globalLessonIndex = useMemo(() => {
    return allLessonsData.findIndex(l => l.id === lessonId);
  }, [lessonId]);

  const prevLessonId = useMemo(() => {
    return globalLessonIndex > 0 ? allLessonsData[globalLessonIndex - 1].id : null;
  }, [globalLessonIndex]);

  const nextLessonId = useMemo(() => {
    return globalLessonIndex < allLessonsData.length - 1 ? allLessonsData[globalLessonIndex + 1].id : null;
  }, [globalLessonIndex]);
  
  if (!currentLesson || !currentChapter) {
    return <div className="text-white p-8">Lesson or Chapter not found. Please go back.</div>;
  }

  const isCompleted = isLessonCompleted(lessonId);

  const handleCompleteLesson = () => {
    completeLesson(lessonId);
  };

  const handleNavigatePrev = () => {
    if (prevLessonId) {
      setSelectedLesson(prevLessonId);
    }
  };

  const handleNavigateNext = () => {
    if (nextLessonId) {
      setSelectedLesson(nextLessonId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <div className="mb-2 text-sm text-gray-400">
          <span onClick={onBack} className="cursor-pointer hover:text-cyan-400">Python Quest</span>
          {' / '}
          <span onClick={onBack} className="cursor-pointer hover:text-cyan-400">{currentChapter.title}</span>
          {' / '}
          <span className="text-white">{currentLesson.title}</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-cyan-400 mb-1">{currentLesson.title}</h1>
            <p className="text-gray-300 text-lg">Chapter {currentChapter.id}: {currentChapter.title}</p>
            <p className="text-sm text-gray-400 mt-1">{currentLesson.description}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
            {isCompleted && (
              <div className="flex items-center gap-2 text-green-400 self-start md:self-end">
                <CheckCircle className="h-5 w-5" />
                <span>Completed</span>
              </div>
            )}
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Navigation and Chapter Progress */}
        <div className="flex items-center justify-between mb-8 p-4 bg-gray-800/50 border border-cyan-500/20 rounded-lg">
          <Button onClick={handleNavigatePrev} disabled={!prevLessonId} variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
            <ChevronLeft className="h-4 w-4 mr-1 md:mr-2" /> <span className="hidden md:inline">Previous</span>
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-300">
              Lesson {currentLessonIndexInChapter + 1} of {lessonsInCurrentChapter.length} in this chapter
            </p>
            {lessonsInCurrentChapter.length > 0 && (
              <div className="w-24 md:w-32 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto mt-1">
                <div 
                  className="h-full bg-green-500 transition-all duration-300" 
                  style={{ width: `${((currentLessonIndexInChapter + 1) / lessonsInCurrentChapter.length) * 100}%` }}
                />
              </div>
            )}
          </div>
          <Button onClick={handleNavigateNext} disabled={!nextLessonId} variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
            <span className="hidden md:inline">Next</span> <ChevronRight className="h-4 w-4 ml-1 md:ml-2" />
          </Button>
        </div>

        <Tabs defaultValue="learn" className="space-y-6">
          <TabsList className="bg-gray-800 border border-cyan-500/30">
            <TabsTrigger value="learn" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="practice" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Code className="h-4 w-4 mr-2" />
              Practice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{currentLesson.content.introduction}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Concept</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed mb-4">{currentLesson.content.concept}</p>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-cyan-500/30">
                  <h4 className="text-cyan-400 font-semibold mb-2">Example:</h4>
                  <CodeEditor 
                    initialCode={currentLesson.content.example.code}
                    expectedOutput={currentLesson.content.example.output}
                  />
                  <p className="text-gray-300 text-sm mt-3">{currentLesson.content.example.explanation}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Your Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{currentLesson.content.exercise.instruction}</p>
                
                <CodeEditor 
                  initialCode={currentLesson.content.exercise.starterCode}
                  expectedOutput={currentLesson.content.exercise.expectedOutput}
                />
                
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                  <Button
                    onClick={() => setShowSolution(!showSolution)}
                    variant="outline"
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 w-full sm:w-auto"
                  >
                    {showSolution ? 'Hide' : 'Show'} Hint
                  </Button>
                  
                  <Button
                    onClick={handleCompleteLesson}
                    className={`
                      w-full sm:w-auto
                      ${isCompleted 
                        ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600'
                      }
                    `}
                    disabled={isCompleted}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    {isCompleted ? 'Lesson Completed!' : 'Mark as Complete'}
                  </Button>
                </div>
                
                {showSolution && (
                  <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      Expected output: <code className="bg-gray-800 px-2 py-1 rounded">{currentLesson.content.exercise.expectedOutput}</code>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LessonView;
