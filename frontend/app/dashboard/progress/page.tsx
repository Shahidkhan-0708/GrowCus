"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Trophy, Calendar, BookOpen, Award, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface ProgressData {
  overallProgress: number;
  topicsCompleted: number;
  xp: number;
  streak: number;
  
  subjectProgress: Array<{
    subject: string;
    progress: number;
    topics: number;
    completed: number;
    color: string;
  }>;
  recentAchievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
}

export default function ProgressPage() {
  const { isLoading: userLoading, isStudent } = useUser();
  const router = useRouter();
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !isStudent) router.push("/dashboard");
    if (userLoading || !isStudent) return;

    async function loadProgress() {
      try {
        const json = await apiFetch<ProgressData>("/api/progress");
        setData(json);
      } catch (err) {
        console.error("Progress fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProgress();
  }, [userLoading, isStudent, router]);

  if (userLoading || isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}</div>
      </div>
    );
  }

  if (!isStudent) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><Target className="w-5 h-5 text-primary mb-2" /><p className="text-2xl font-bold">{data.overallProgress}%</p><p className="text-xs text-muted-foreground">Overall Progress</p></CardContent></Card>
        <Card><CardContent className="pt-6"><CheckCircle2 className="w-5 h-5 text-accent mb-2" /><p className="text-2xl font-bold">{data.topicsCompleted}</p><p className="text-xs text-muted-foreground">Tasks Completed</p></CardContent></Card>
        <Card><CardContent className="pt-6"><Trophy className="w-5 h-5 text-yellow-600 mb-2" /><p className="text-2xl font-bold">{data.xp}</p><p className="text-xs text-muted-foreground">XP Points</p></CardContent></Card>
        <Card><CardContent className="pt-6"><Calendar className="w-5 h-5 text-primary mb-2" /><p className="text-2xl font-bold">{data.streak}</p><p className="text-xs text-muted-foreground">Day Streak</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" />Subject Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.subjectProgress.map((subject) => (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><span className="font-medium">{subject.subject}</span><Badge variant="secondary" className="text-xs">{subject.completed}/{subject.topics} tasks</Badge></div>
                  <span className="text-sm font-medium">{subject.progress}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${subject.color}`} style={{ width: `${subject.progress}%` }} /></div>
              </div>
            ))}
            {data.subjectProgress.length === 0 && <p className="text-sm text-muted-foreground">No assigned tasks yet</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Award className="w-5 h-5 text-primary" />Recent Achievements</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentAchievements.map((achievement) => (
              <div key={`${achievement.title}-${achievement.date}`} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center"><Award className="w-5 h-5 text-yellow-600" /></div>
                <div className="flex-1"><p className="font-medium text-sm">{achievement.title}</p><p className="text-xs text-muted-foreground">{achievement.description}</p></div>
                <span className="text-xs text-muted-foreground">{new Date(achievement.date).toLocaleDateString()}</span>
              </div>
            ))}
            {data.recentAchievements.length === 0 && <p className="text-sm text-muted-foreground">Complete tasks to earn achievements</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
