"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, TrendingDown, BookOpen, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

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
  lastCalculated: string;
}

export default function RiskPage() {
  const [students, setStudents] = useState<RiskStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRisk() {
      try {
        const json = await apiFetch<{ students: RiskStudent[] }>("/api/risk");
        setStudents(json.students);
      } catch (err) {
        console.error("Risk fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRisk();
  }, []);

  const getRiskColor = (level: string) => {
    if (level === "critical") return "bg-destructive text-destructive-foreground";
    if (level === "high") return "bg-destructive/80 text-destructive-foreground";
    if (level === "medium") return "bg-yellow-500 text-white";
    return "bg-accent text-accent-foreground";
  };

  const getRiskBorderColor = (level: string) => {
    if (level === "critical") return "border-l-destructive";
    if (level === "high") return "border-l-destructive/70";
    if (level === "medium") return "border-l-yellow-500";
    return "border-l-accent";
  };

  const stats = {
    critical: students.filter((student) => student.riskLevel === "critical").length,
    high: students.filter((student) => student.riskLevel === "high").length,
    medium: students.filter((student) => student.riskLevel === "medium").length,
    low: students.filter((student) => student.riskLevel === "low").length,
  };

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-24 w-full" /><Skeleton className="h-80 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Risk Assessment</h1>
        <p className="text-muted-foreground">Identify and support at-risk students before it is too late</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-destructive"><CardContent className="pt-6"><p className="text-3xl font-bold">{stats.critical}</p><p className="text-sm text-muted-foreground">Critical Risk</p><AlertTriangle className="w-6 h-6 text-destructive mt-3" /></CardContent></Card>
        <Card className="border-l-4 border-l-destructive/70"><CardContent className="pt-6"><p className="text-3xl font-bold">{stats.high}</p><p className="text-sm text-muted-foreground">High Risk</p><AlertCircle className="w-6 h-6 text-destructive/70 mt-3" /></CardContent></Card>
        <Card className="border-l-4 border-l-yellow-500"><CardContent className="pt-6"><p className="text-3xl font-bold">{stats.medium}</p><p className="text-sm text-muted-foreground">Medium Risk</p><Clock className="w-6 h-6 text-yellow-600 mt-3" /></CardContent></Card>
        <Card className="border-l-4 border-l-accent"><CardContent className="pt-6"><p className="text-3xl font-bold">{stats.low}</p><p className="text-sm text-muted-foreground">Low Risk</p><CheckCircle className="w-6 h-6 text-accent mt-3" /></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Risk Calculation Factors</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><TrendingDown className="w-5 h-5 text-destructive" /><div><p className="font-medium text-sm">Low Attendance</p><p className="text-xs text-muted-foreground">Below 75% attendance</p></div></div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><BookOpen className="w-5 h-5 text-destructive" /><div><p className="font-medium text-sm">Low Marks</p><p className="text-xs text-muted-foreground">Below 40% marks</p></div></div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><Clock className="w-5 h-5 text-destructive" /><div><p className="font-medium text-sm">Low Task Completion</p><p className="text-xs text-muted-foreground">Below 50% completion rate</p></div></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">At-Risk Students</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.sort((a, b) => ({ critical: 0, high: 1, medium: 2, low: 3 }[a.riskLevel] - { critical: 0, high: 1, medium: 2, low: 3 }[b.riskLevel])).map((student) => (
              <div key={student.id} className={`p-4 rounded-lg border border-border border-l-4 ${getRiskBorderColor(student.riskLevel)}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12"><AvatarFallback className="bg-primary/10 text-primary">{student.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1"><p className="font-medium">{student.name}</p><Badge className={`capitalize ${getRiskColor(student.riskLevel)}`}>{student.riskLevel}</Badge></div>
                      <p className="text-sm text-muted-foreground">{student.batch}</p>
                      <div className="flex flex-wrap gap-2 mt-2">{student.riskFactors.map((factor) => <Badge key={factor} variant="outline" className="text-xs capitalize">{factor}</Badge>)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div><p className="text-xs text-muted-foreground">Attendance</p><p className={student.attendance >= 75 ? "text-lg font-semibold" : "text-lg font-semibold text-destructive"}>{student.attendance}%</p></div>
                    <div><p className="text-xs text-muted-foreground">Marks</p><p className={student.marks >= 40 ? "text-lg font-semibold" : "text-lg font-semibold text-destructive"}>{student.marks}%</p></div>
                    <div><p className="text-xs text-muted-foreground">Tasks</p><p className={student.taskCompletion >= 50 ? "text-lg font-semibold" : "text-lg font-semibold text-destructive"}>{student.taskCompletion}%</p></div>
                  </div>
                </div>
              </div>
            ))}
            {students.length === 0 && <div className="text-center py-12"><p className="text-muted-foreground">No students found</p></div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
