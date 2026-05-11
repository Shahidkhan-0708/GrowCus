"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, Target, Award, PieChart } from "lucide-react";
import { useRouter } from "next/navigation";

// Match exactly what your backend sends
type OverviewStat = {
  label: string;
  value: number;
};

type Subject = {
  subject: string;
  avgScore: number;
};

type AnalyticsData = {
  overview: OverviewStat[];
  subjects: Subject[];

};

export default function AnalyticsPage() {
  const { isLoading, isAdmin } = useUser();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true); // ✅ separate loading for fetch

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics`,
          { credentials: "include" }
        );
        const json = await res.json();
        console.log("API response:", json); // ✅ check this in browser console
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setFetchLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading || fetchLoading) {
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

      {/* Overview Stats — matches your backend overview array */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.overview?.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {stat.value}
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

      {/* Subject Performance — matches your backend subjects array */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Subject Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.subjects?.map((subject) => (
              <div
                key={subject.subject}
                className="p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{subject.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${subject.avgScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{subject.avgScore}%</span>
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
