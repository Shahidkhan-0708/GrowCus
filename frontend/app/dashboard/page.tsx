"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, AlertTriangle, CheckSquare, TrendingUp, ArrowRight, Clock, BookOpen, Star, Calendar } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface DashboardData {
  stats: {
    totalStudents: number;
    activeTeachers: number;
    atRiskStudents: number;
    tasksCompleted: number;
    avgAttendance: number;
    xp: number;
    reports: number;
  };
  recentStudents: Array<{
    id: string;
    name: string;
    batch: string;
    riskLevel: string;
    attendance: number;
  }>;
  pendingTasks: Array<{
    id: string;
    title: string;
    assignedTo: string;
    dueDate: string;
    completionRate: number;
    subject: string;
    status: string;
  }>;
  teachers: Array<{
    id: string;
    name: string;
    subject: string;
    students: number;
    rating: number;
  }>;
}

export default function DashboardPage() {
  const { user, isLoading: userLoading, isStudent, isAdmin } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    async function loadDashboard() {
      try {
        const json = await apiFetch<DashboardData>("/api/dashboard");
        setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [userLoading]);

  const getRiskColor = (level: string) => {
    if (level === "critical" || level === "high") return "text-destructive bg-destructive/10";
    if (level === "medium") return "text-yellow-600 bg-yellow-50";
    return "text-accent bg-accent/10";
  };

  if (userLoading || isLoading || !data) {
    return (
      <div className="space-y-8">
        <div><Skeleton className="h-8 w-64 mb-2" /><Skeleton className="h-4 w-96" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}</div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const stats = isStudent
    ? [
        { title: "My Attendance", value: `${data.stats.avgAttendance}%`, icon: Calendar },
        { title: "Tasks Completed", value: `${data.stats.tasksCompleted}%`, icon: CheckSquare },
        { title: "XP Points", value: data.stats.xp.toString(), icon: Star },
        { title: "Pending Tasks", value: data.pendingTasks.length.toString(), icon: Clock },
      ]
    : isAdmin
    ? [
        { title: "Total Students", value: data.stats.totalStudents.toString(), icon: Users },
        { title: "Active Teachers", value: data.stats.activeTeachers.toString(), icon: BookOpen },
        { title: "At-Risk Students", value: data.stats.atRiskStudents.toString(), icon: AlertTriangle },
        { title: "Reports", value: data.stats.reports.toString(), icon: TrendingUp },
      ]
    : [
        { title: "Total Students", value: data.stats.totalStudents.toString(), icon: Users },
        { title: "At-Risk Students", value: data.stats.atRiskStudents.toString(), icon: AlertTriangle },
        { title: "Tasks Completed", value: `${data.stats.tasksCompleted}%`, icon: CheckSquare },
        { title: "Avg. Attendance", value: `${data.stats.avgAttendance}%`, icon: TrendingUp },
      ];

  const userName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {userName}</h1>
        <p className="text-muted-foreground mt-1">
          {isStudent ? "Track your progress and stay on top of your studies." : isAdmin ? "Overview of the entire platform performance." : "Here is what is happening with your students today."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary"><stat.icon className="w-5 h-5" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{isStudent ? "My Pending Tasks" : "Pending Tasks"}</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/dashboard/tasks">View all <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.pendingTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{isStudent ? task.subject : task.assignedTo}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{new Date(task.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${task.completionRate}%` }} /></div>
                </div>
              ))}
              {data.pendingTasks.length === 0 && <p className="text-sm text-muted-foreground">No pending tasks</p>}
            </div>
          </CardContent>
        </Card>

        {!isStudent && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{isAdmin ? "Recent Students" : "Your Students"}</CardTitle>
              <Button variant="ghost" size="sm" asChild><Link href="/dashboard/students">View all <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarFallback className="bg-primary/10 text-primary text-sm">{student.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                      <div><p className="font-medium text-sm">{student.name}</p><p className="text-xs text-muted-foreground">{student.batch}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{student.attendance}%</span>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${getRiskColor(student.riskLevel)}`}>{student.riskLevel}</span>
                    </div>
                  </div>
                ))}
                {data.recentStudents.length === 0 && <p className="text-sm text-muted-foreground">No students found</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Teacher Performance</CardTitle>
              <Button variant="ghost" size="sm" asChild><Link href="/dashboard/teachers">Manage <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.teachers.map((teacher) => (
                  <div key={teacher.id} className="p-4 rounded-xl border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar><AvatarFallback className="bg-primary/10 text-primary">{teacher.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                      <div><p className="font-medium text-sm">{teacher.name}</p><p className="text-xs text-muted-foreground">{teacher.subject}</p></div>
                    </div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">{teacher.students} students</span><span className="flex items-center gap-1 text-yellow-600"><Star className="w-3 h-3" />{teacher.rating || "N/A"}</span></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
