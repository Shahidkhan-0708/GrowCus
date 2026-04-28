"use client";

import { useEffect } from "react";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Target,
  Award,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Demo analytics data
const overviewStats = [
  { label: "Total Students", value: "1,247", change: "+8%", trend: "up" },
  { label: "Active Teachers", value: "32", change: "+3", trend: "up" },
  { label: "Avg. Attendance", value: "82%", change: "+2%", trend: "up" },
  { label: "Task Completion", value: "78%", change: "-1%", trend: "down" },
];

const batchPerformance = [
  { batch: "JEE 2025 A", students: 45, avgScore: 78, attendance: 85, riskCount: 3 },
  { batch: "JEE 2025 B", students: 42, avgScore: 72, attendance: 80, riskCount: 5 },
  { batch: "NEET 2025 A", students: 50, avgScore: 75, attendance: 82, riskCount: 4 },
  { batch: "NEET 2025 B", students: 48, avgScore: 68, attendance: 78, riskCount: 7 },
  { batch: "JEE 2026", students: 38, avgScore: 70, attendance: 88, riskCount: 2 },
];

const subjectStats = [
  { subject: "Physics", avgScore: 72, improvement: "+5%", topPerformer: "Priya S." },
  { subject: "Chemistry", avgScore: 68, improvement: "+3%", topPerformer: "Rahul K." },
  { subject: "Mathematics", avgScore: 75, improvement: "+7%", topPerformer: "Ananya P." },
  { subject: "Biology", avgScore: 70, improvement: "+4%", topPerformer: "Vikram S." },
];

const monthlyTrend = [
  { month: "Jan", students: 980, completion: 72 },
  { month: "Feb", students: 1050, completion: 75 },
  { month: "Mar", students: 1120, completion: 78 },
  { month: "Apr", students: 1247, completion: 78 },
];

export default function AnalyticsPage() {
  const { isLoading, isAdmin } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of platform performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${
                      stat.trend === "up" ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  {stat.label.includes("Student") ? (
                    <Users className="w-5 h-5 text-primary" />
                  ) : stat.label.includes("Teacher") ? (
                    <BookOpen className="w-5 h-5 text-primary" />
                  ) : stat.label.includes("Attendance") ? (
                    <Target className="w-5 h-5 text-primary" />
                  ) : (
                    <Award className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Batch Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batchPerformance.map((batch) => (
                <div
                  key={batch.batch}
                  className="p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">{batch.batch}</p>
                      <p className="text-xs text-muted-foreground">
                        {batch.students} students
                      </p>
                    </div>
                    {batch.riskCount > 0 && (
                      <Badge
                        variant={batch.riskCount > 5 ? "destructive" : "secondary"}
                      >
                        {batch.riskCount} at risk
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg. Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${batch.avgScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{batch.avgScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${batch.attendance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{batch.attendance}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectStats.map((subject) => (
                <div
                  key={subject.subject}
                  className="p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{subject.subject}</p>
                    <Badge variant="outline" className="text-accent border-accent">
                      {subject.improvement}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold text-foreground">
                        {subject.avgScore}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Top Performer</p>
                      <p className="text-sm font-medium text-primary">
                        {subject.topPerformer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Monthly Growth Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {monthlyTrend.map((month, idx) => (
              <div
                key={month.month}
                className={`p-4 rounded-lg ${
                  idx === monthlyTrend.length - 1
                    ? "bg-primary/10 border-2 border-primary/20"
                    : "bg-muted/50"
                }`}
              >
                <p className="text-sm font-medium text-muted-foreground">
                  {month.month} 2026
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {month.students.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {month.completion}% task completion
                </p>
                {idx === monthlyTrend.length - 1 && (
                  <Badge className="mt-2" variant="default">
                    Current
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
