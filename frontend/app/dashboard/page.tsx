"use client";

import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  AlertTriangle,
  CheckSquare,
  TrendingUp,
  ArrowRight,
  Clock,
  BookOpen,
  Trophy,
  Target,
  Calendar,
  Star,
} from "lucide-react";
import Link from "next/link";

// Demo data for different roles
const teacherStats = [
  {
    title: "Total Students",
    value: "247",
    change: "+12",
    changeLabel: "this week",
    icon: Users,
    trend: "up",
  },
  {
    title: "At-Risk Students",
    value: "18",
    change: "7.3%",
    changeLabel: "of total",
    icon: AlertTriangle,
    trend: "warning",
  },
  {
    title: "Tasks Completed",
    value: "89%",
    change: "+5%",
    changeLabel: "from last week",
    icon: CheckSquare,
    trend: "up",
  },
  {
    title: "Avg. Attendance",
    value: "78%",
    change: "-2%",
    changeLabel: "from last week",
    icon: TrendingUp,
    trend: "down",
  },
];

const adminStats = [
  {
    title: "Total Students",
    value: "1,247",
    change: "+45",
    changeLabel: "this month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Teachers",
    value: "32",
    change: "+3",
    changeLabel: "this month",
    icon: BookOpen,
    trend: "up",
  },
  {
    title: "At-Risk Students",
    value: "78",
    change: "6.2%",
    changeLabel: "of total",
    icon: AlertTriangle,
    trend: "warning",
  },
  {
    title: "Platform Score",
    value: "94%",
    change: "+2%",
    changeLabel: "improvement",
    icon: TrendingUp,
    trend: "up",
  },
];

const studentStats = [
  {
    title: "My Attendance",
    value: "85%",
    change: "+3%",
    changeLabel: "this month",
    icon: Calendar,
    trend: "up",
  },
  {
    title: "Tasks Completed",
    value: "12/15",
    change: "80%",
    changeLabel: "completion",
    icon: CheckSquare,
    trend: "up",
  },
  {
    title: "Current Rank",
    value: "#23",
    change: "+5",
    changeLabel: "positions up",
    icon: Trophy,
    trend: "up",
  },
  {
    title: "XP Points",
    value: "1,250",
    change: "+150",
    changeLabel: "this week",
    icon: Star,
    trend: "up",
  },
];

const recentStudents = [
  {
    name: "Priya Sharma",
    email: "priya@email.com",
    batch: "JEE 2025",
    riskLevel: "low",
    attendance: 92,
  },
  {
    name: "Rahul Kumar",
    email: "rahul@email.com",
    batch: "NEET 2025",
    riskLevel: "high",
    attendance: 65,
  },
  {
    name: "Ananya Patel",
    email: "ananya@email.com",
    batch: "JEE 2025",
    riskLevel: "medium",
    attendance: 75,
  },
  {
    name: "Vikram Singh",
    email: "vikram@email.com",
    batch: "NEET 2025",
    riskLevel: "low",
    attendance: 88,
  },
];

const pendingTasks = [
  {
    title: "Physics Chapter 5 Problems",
    assignedTo: "JEE Batch A",
    dueDate: "Tomorrow",
    completion: 45,
  },
  {
    title: "Chemistry Mock Test",
    assignedTo: "NEET Batch B",
    dueDate: "In 2 days",
    completion: 30,
  },
  {
    title: "Biology Revision Notes",
    assignedTo: "NEET Batch A",
    dueDate: "In 3 days",
    completion: 60,
  },
];

const studentTasks = [
  {
    title: "Physics Chapter 5 - Mechanics",
    subject: "Physics",
    dueDate: "Tomorrow",
    status: "in-progress",
    priority: "high",
  },
  {
    title: "Chemistry Mock Test",
    subject: "Chemistry",
    dueDate: "In 2 days",
    status: "pending",
    priority: "high",
  },
  {
    title: "Math Practice Set 12",
    subject: "Mathematics",
    dueDate: "In 3 days",
    status: "pending",
    priority: "medium",
  },
];

const upcomingClasses = [
  { subject: "Physics", topic: "Mechanics", time: "10:00 AM", teacher: "Mr. Sharma" },
  { subject: "Chemistry", topic: "Organic Chemistry", time: "12:00 PM", teacher: "Mrs. Patel" },
  { subject: "Mathematics", topic: "Calculus", time: "2:00 PM", teacher: "Mr. Kumar" },
];

export default function DashboardPage() {
  const { user, isLoading, isStudent, isTeacher, isAdmin } = useUser();

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-destructive bg-destructive/10";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-accent bg-accent/10";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = isAdmin ? adminStats : isStudent ? studentStats : teacherStats;
  const userName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isStudent
            ? "Track your progress and stay on top of your studies."
            : isAdmin
            ? "Overview of the entire platform performance."
            : "Here's what's happening with your students today."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      stat.trend === "up"
                        ? "text-accent"
                        : stat.trend === "warning"
                        ? "text-yellow-600"
                        : "text-destructive"
                    }`}
                  >
                    {stat.change} {stat.changeLabel}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${
                    stat.trend === "warning"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid - Role-specific */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student View */}
        {isStudent && (
          <>
            {/* My Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">My Pending Tasks</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/tasks">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentTasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === "high" ? "bg-destructive" : "bg-yellow-500"
                        }`} />
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.subject}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={task.status === "in-progress" ? "default" : "secondary"}>
                          {task.status === "in-progress" ? "In Progress" : "Pending"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Today&apos;s Classes</CardTitle>
                <Badge variant="outline">{new Date().toLocaleDateString()}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingClasses.map((cls, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {cls.subject}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cls.topic} - {cls.teacher}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {cls.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions for Students */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Link href="/dashboard/aria">
                    <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium text-sm text-foreground">Ask Aria</p>
                      <p className="text-xs text-muted-foreground">Get AI Help</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/tasks">
                    <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <CheckSquare className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium text-sm text-foreground">My Tasks</p>
                      <p className="text-xs text-muted-foreground">View assignments</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/progress">
                    <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium text-sm text-foreground">Progress</p>
                      <p className="text-xs text-muted-foreground">Track growth</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/notifications">
                    <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium text-sm text-foreground">Schedule</p>
                      <p className="text-xs text-muted-foreground">View calendar</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Teacher/Admin View */}
        {(isTeacher || isAdmin) && (
          <>
            {/* Recent Students */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  {isAdmin ? "Recent Students (All)" : "Your Students"}
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/students">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div
                      key={student.email}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.batch}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {student.attendance}%
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full capitalize ${getRiskColor(
                            student.riskLevel
                          )}`}
                        >
                          {student.riskLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Pending Tasks</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/tasks">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.title}
                      className="p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {task.assignedTo}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {task.dueDate}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Completion</span>
                          <span className="font-medium text-foreground">
                            {task.completion}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${task.completion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin-specific: Teacher Overview */}
            {isAdmin && (
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Teacher Performance</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/teachers">
                      Manage <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "Mr. Sharma", subject: "Physics", students: 85, rating: 4.8 },
                      { name: "Mrs. Patel", subject: "Chemistry", students: 72, rating: 4.6 },
                      { name: "Mr. Kumar", subject: "Mathematics", students: 90, rating: 4.9 },
                    ].map((teacher) => (
                      <div
                        key={teacher.name}
                        className="p-4 rounded-xl border border-border hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {teacher.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground text-sm">{teacher.name}</p>
                            <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{teacher.students} students</span>
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Star className="w-3 h-3 fill-current" />
                            {teacher.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
