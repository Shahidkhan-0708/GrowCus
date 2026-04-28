"use client";

import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  BookOpen,
  Award,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Demo data for student progress
const subjectProgress = [
  { subject: "Physics", progress: 72, topics: 18, completed: 13, color: "bg-blue-500" },
  { subject: "Chemistry", progress: 65, topics: 22, completed: 14, color: "bg-green-500" },
  { subject: "Mathematics", progress: 80, topics: 20, completed: 16, color: "bg-purple-500" },
  { subject: "Biology", progress: 58, topics: 25, completed: 15, color: "bg-orange-500" },
];

const recentAchievements = [
  { title: "First Mock Test", description: "Completed your first mock test", date: "2 days ago", icon: Award },
  { title: "Streak Master", description: "7-day learning streak", date: "1 week ago", icon: Star },
  { title: "Physics Pro", description: "Scored 90%+ in Physics chapter test", date: "2 weeks ago", icon: Trophy },
];

const weeklyActivity = [
  { day: "Mon", hours: 4 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 5 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 6 },
  { day: "Sun", hours: 3 },
];

export default function ProgressPage() {
  const { user, isLoading, isStudent } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isStudent) {
      router.push("/dashboard");
    }
  }, [isLoading, isStudent, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!isStudent) return null;

  const totalHours = weeklyActivity.reduce((sum, day) => sum + day.hours, 0);
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">68%</p>
                <p className="text-xs text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">58</p>
                <p className="text-xs text-muted-foreground">Topics Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1,250</p>
                <p className="text-xs text-muted-foreground">XP Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Subject Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjectProgress.map((subject) => (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{subject.subject}</span>
                    <Badge variant="secondary" className="text-xs">
                      {subject.completed}/{subject.topics} topics
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-foreground">{subject.progress}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${subject.color}`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Weekly Activity
              </span>
              <Badge variant="outline">{totalHours} hrs total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyActivity.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30"
                    style={{ height: `${(day.hours / maxHours) * 100}%` }}
                  >
                    <div
                      className="w-full bg-primary rounded-t-lg"
                      style={{ height: `${(day.hours / maxHours) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <achievement.icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{achievement.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rank Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Batch Rank: #23</h3>
                <p className="text-muted-foreground">Out of 120 students in {user?.batch || "JEE 2025"}</p>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">+5</p>
                <p className="text-xs text-muted-foreground">Positions gained</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">Top 20%</p>
                <p className="text-xs text-muted-foreground">Percentile</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
