"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertTriangle,
  TrendingDown,
  BookOpen,
  Clock,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface RiskStudent {
  id: string;
  name: string;
  email: string;
  batch: string;
  attendance: number;
  marks: number;
  taskCompletion: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskFactors: string[];
  lastCalculated: Date;
}

const riskStudents: RiskStudent[] = [
  {
    id: "1",
    name: "Sneha Reddy",
    email: "sneha@email.com",
    batch: "JEE 2025",
    attendance: 55,
    marks: 35,
    taskCompletion: 40,
    riskLevel: "critical",
    riskFactors: ["low attendance", "low marks", "low task completion"],
    lastCalculated: new Date(),
  },
  {
    id: "2",
    name: "Rahul Kumar",
    email: "rahul@email.com",
    batch: "NEET 2025",
    attendance: 65,
    marks: 42,
    taskCompletion: 45,
    riskLevel: "high",
    riskFactors: ["low attendance", "low marks"],
    lastCalculated: new Date(),
  },
  {
    id: "3",
    name: "Ananya Patel",
    email: "ananya@email.com",
    batch: "JEE 2025",
    attendance: 75,
    marks: 68,
    taskCompletion: 70,
    riskLevel: "medium",
    riskFactors: ["borderline attendance"],
    lastCalculated: new Date(),
  },
  {
    id: "4",
    name: "Karan Mehta",
    email: "karan@email.com",
    batch: "NEET 2025",
    attendance: 70,
    marks: 55,
    taskCompletion: 50,
    riskLevel: "medium",
    riskFactors: ["low task completion"],
    lastCalculated: new Date(),
  },
];

export default function RiskPage() {
  const [students, setStudents] = useState<RiskStudent[]>(riskStudents);
  const [isCalculating, setIsCalculating] = useState<string | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-destructive/80 text-destructive-foreground";
      case "medium":
        return "bg-yellow-500 text-white";
      default:
        return "bg-accent text-accent-foreground";
    }
  };

  const getRiskBorderColor = (level: string) => {
    switch (level) {
      case "critical":
        return "border-l-destructive";
      case "high":
        return "border-l-destructive/70";
      case "medium":
        return "border-l-yellow-500";
      default:
        return "border-l-accent";
    }
  };

  const recalculateRisk = async (studentId: string) => {
    setIsCalculating(studentId);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStudents(
      students.map((s) =>
        s.id === studentId
          ? { ...s, lastCalculated: new Date() }
          : s
      )
    );
    setIsCalculating(null);
  };

  const stats = {
    critical: students.filter((s) => s.riskLevel === "critical").length,
    high: students.filter((s) => s.riskLevel === "high").length,
    medium: students.filter((s) => s.riskLevel === "medium").length,
    low: students.filter((s) => s.riskLevel === "low").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Risk Assessment</h1>
        <p className="text-muted-foreground">
          Identify and support at-risk students before it is too late
        </p>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stats.critical}
                </p>
                <p className="text-sm text-muted-foreground">Critical Risk</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive/70">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stats.high}
                </p>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="w-6 h-6 text-destructive/70" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stats.medium}
                </p>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stats.low}
                </p>
                <p className="text-sm text-muted-foreground">Low Risk</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Calculation Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <TrendingDown className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-sm text-foreground">
                  Low Attendance
                </p>
                <p className="text-xs text-muted-foreground">
                  Below 75% attendance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <BookOpen className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-sm text-foreground">Low Marks</p>
                <p className="text-xs text-muted-foreground">Below 40% marks</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-sm text-foreground">
                  Low Task Completion
                </p>
                <p className="text-xs text-muted-foreground">
                  Below 50% completion rate
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* At-Risk Students */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">At-Risk Students</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              students.forEach((s) => recalculateRisk(s.id));
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Recalculate All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students
              .sort((a, b) => {
                const order = { critical: 0, high: 1, medium: 2, low: 3 };
                return order[a.riskLevel] - order[b.riskLevel];
              })
              .map((student) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-lg border border-border border-l-4 ${getRiskBorderColor(
                    student.riskLevel
                  )} hover:bg-muted/30 transition-colors`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">
                            {student.name}
                          </p>
                          <Badge
                            className={`capitalize ${getRiskColor(
                              student.riskLevel
                            )}`}
                          >
                            {student.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {student.batch}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {student.riskFactors.map((factor, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Attendance
                          </p>
                          <p
                            className={`text-lg font-semibold ${
                              student.attendance >= 75
                                ? "text-foreground"
                                : "text-destructive"
                            }`}
                          >
                            {student.attendance}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Marks</p>
                          <p
                            className={`text-lg font-semibold ${
                              student.marks >= 40
                                ? "text-foreground"
                                : "text-destructive"
                            }`}
                          >
                            {student.marks}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Tasks</p>
                          <p
                            className={`text-lg font-semibold ${
                              student.taskCompletion >= 50
                                ? "text-foreground"
                                : "text-destructive"
                            }`}
                          >
                            {student.taskCompletion}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => recalculateRisk(student.id)}
                          disabled={isCalculating === student.id}
                        >
                          {isCalculating === student.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                        <Button size="sm">
                          Intervene
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
