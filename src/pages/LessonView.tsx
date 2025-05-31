
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, BookOpen, Code, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditor from '@/components/CodeEditor';
import { useProgress } from '@/contexts/ProgressContext';
import { lessons } from '@/data/lessons';

interface LessonViewProps {
  lessonId: string;
  onBack: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lessonId, onBack }) => {
  const { completeLesson, isLessonCompleted } = useProgress();
  const [showSolution, setShowSolution] = useState(false);
  const lesson = lessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    return <div className="text-white">Lesson not found</div>;
  }

  const isCompleted = isLessonCompleted(lessonId);

  const handleCompleteLesson = () => {
    completeLesson(lessonId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lessons
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">{lesson.title}</h1>
            <p className="text-gray-300">{lesson.description}</p>
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>Completed</span>
            </div>
          )}
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
                <p className="text-gray-300 leading-relaxed">{lesson.content.introduction}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Concept</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed mb-4">{lesson.content.concept}</p>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-cyan-500/30">
                  <h4 className="text-cyan-400 font-semibold mb-2">Example:</h4>
                  <CodeEditor 
                    initialCode={lesson.content.example.code}
                    expectedOutput={lesson.content.example.output}
                  />
                  <p className="text-gray-300 text-sm mt-3">{lesson.content.example.explanation}</p>
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
                <p className="text-gray-300 mb-4">{lesson.content.exercise.instruction}</p>
                
                <CodeEditor 
                  initialCode={lesson.content.exercise.starterCode}
                  expectedOutput={lesson.content.exercise.expectedOutput}
                />
                
                <div className="flex items-center justify-between mt-6">
                  <Button
                    onClick={() => setShowSolution(!showSolution)}
                    variant="outline"
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    {showSolution ? 'Hide' : 'Show'} Hint
                  </Button>
                  
                  <Button
                    onClick={handleCompleteLesson}
                    className={`
                      ${isCompleted 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600'
                      }
                    `}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    {isCompleted ? 'Lesson Completed!' : 'Mark as Complete'}
                  </Button>
                </div>
                
                {showSolution && (
                  <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      Expected output: <code className="bg-gray-800 px-2 py-1 rounded">{lesson.content.exercise.expectedOutput}</code>
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
