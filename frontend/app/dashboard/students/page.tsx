"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Filter, Mail, Phone, TrendingUp, TrendingDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Student {
  id: string;
  name: string;
  email: string;
  batch: string;
  phone: string;
  attendance: number;
  marks: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  isActive: boolean;
  xp: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState<string>("all");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", batch: "", phone: "" });

  async function loadStudents() {
    setIsLoading(true);
    try {
      const json = await apiFetch<{ students: Student[] }>("/api/students");
      setStudents(json.students);
    } catch (err) {
      console.error("Students fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const batches = useMemo(
    () => Array.from(new Set(students.map((student) => student.batch).filter(Boolean))),
    [students]
  );

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = filterBatch === "all" || student.batch === filterBatch;
    const matchesRisk = filterRisk === "all" || student.riskLevel === filterRisk;
    return matchesSearch && matchesBatch && matchesRisk;
  });

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email) return;

    try {
      await apiFetch("/api/students", {
        method: "POST",
        body: JSON.stringify(newStudent),
      });
      setNewStudent({ name: "", email: "", batch: "", phone: "" });
      setIsAddModalOpen(false);
      loadStudents();
    } catch (err) {
      console.error("Add student error:", err);
    }
  };

  const getRiskBadge = (level: string) => {
    if (level === "critical") return <Badge variant="destructive" className="capitalize">{level}</Badge>;
    if (level === "high") return <Badge variant="outline" className="border-destructive text-destructive capitalize">{level}</Badge>;
    if (level === "medium") return <Badge variant="outline" className="border-yellow-500 text-yellow-600 capitalize">{level}</Badge>;
    return <Badge variant="outline" className="border-accent text-accent capitalize">{level}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage and monitor your students</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Default login password will be student123.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Input id="batch" value={newStudent.batch} onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Parent Phone</Label>
                <Input id="phone" value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} />
              </div>
              <Button onClick={handleAddStudent} className="w-full">Add Student</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Select value={filterBatch} onValueChange={setFilterBatch}>
                <SelectTrigger className="w-[140px]"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Batch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map((batch) => <SelectItem key={batch} value={batch}>{batch}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Risk Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">{filteredStudents.length} Students</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary">{student.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{student.name}</p>
                      {!student.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{student.email}</span>
                      {student.phone && <span className="hidden sm:flex items-center gap-1"><Phone className="w-3 h-3" />{student.phone}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{student.batch}</Badge>
                      {getRiskBadge(student.riskLevel)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                    <p className={`text-sm font-medium flex items-center justify-center gap-1 ${student.attendance >= 75 ? "text-accent" : "text-destructive"}`}>
                      {student.attendance >= 75 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {student.attendance}%
                    </p>
                  </div>
                  <div><p className="text-xs text-muted-foreground">Marks</p><p className="text-sm font-medium">{student.marks}%</p></div>
                  <div><p className="text-xs text-muted-foreground">XP</p><p className="text-sm font-medium text-primary">{student.xp}</p></div>
                </div>
              </div>
            ))}
            {filteredStudents.length === 0 && <div className="text-center py-12"><p className="text-muted-foreground">No students found</p></div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
