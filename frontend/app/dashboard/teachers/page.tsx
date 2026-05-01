"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Mail, Phone, Users, Star, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  batches: string[];
  studentsCount: number;
  rating: number;
  isActive: boolean;
}

export default function TeachersPage() {
  const { isLoading: userLoading, isAdmin } = useUser();
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", phone: "", subject: "" });

  async function loadTeachers() {
    setIsLoading(true);
    try {
      const json = await apiFetch<{ teachers: Teacher[] }>("/api/teachers");
      setTeachers(json.teachers);
    } catch (err) {
      console.error("Teachers fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!userLoading && !isAdmin) router.push("/dashboard");
    if (!userLoading && isAdmin) loadTeachers();
  }, [userLoading, isAdmin, router]);

  const subjects = useMemo(
    () => Array.from(new Set(teachers.map((teacher) => teacher.subject).filter(Boolean))),
    [teachers]
  );

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "all" || teacher.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subject) return;

    try {
      await apiFetch("/api/teachers", {
        method: "POST",
        body: JSON.stringify(newTeacher),
      });
      setNewTeacher({ name: "", email: "", phone: "", subject: "" });
      setIsAddModalOpen(false);
      loadTeachers();
    } catch (err) {
      console.error("Add teacher error:", err);
    }
  };

  const stats = {
    total: teachers.length,
    active: teachers.filter((teacher) => teacher.isActive).length,
    totalStudents: teachers.reduce((sum, teacher) => sum + teacher.studentsCount, 0),
    avgRating: teachers.length ? (teachers.reduce((sum, teacher) => sum + teacher.rating, 0) / teachers.length).toFixed(1) : "0.0",
  };

  if (userLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">Manage and monitor all teachers</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Teacher</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>Default login password will be teacher123.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={newTeacher.name} onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={newTeacher.email} onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={newTeacher.phone} onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })} /></div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={newTeacher.subject} onValueChange={(value) => setNewTeacher({ ...newTeacher, subject: value })}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTeacher} className="w-full">Add Teacher</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total Teachers</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-accent" /><div><p className="text-2xl font-bold">{stats.active}</p><p className="text-xs text-muted-foreground">Active</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold">{stats.totalStudents}</p><p className="text-xs text-muted-foreground">Total Students</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Star className="w-5 h-5 text-yellow-600" /><div><p className="text-2xl font-bold">{stats.avgRating}</p><p className="text-xs text-muted-foreground">Avg. Rating</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search teachers..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">{filteredTeachers.length} Teachers</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12"><AvatarFallback className="bg-primary/10 text-primary">{teacher.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                  <div>
                    <div className="flex items-center gap-2"><p className="font-medium">{teacher.name}</p>{!teacher.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}</div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{teacher.email}</span>
                      {teacher.phone && <span className="hidden sm:flex items-center gap-1"><Phone className="w-3 h-3" />{teacher.phone}</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className="text-xs">{teacher.subject}</Badge>
                      {teacher.batches.map((batch) => <Badge key={batch} variant="outline" className="text-xs">{batch}</Badge>)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div><p className="text-xs text-muted-foreground">Students</p><p className="text-sm font-medium">{teacher.studentsCount}</p></div>
                  <div><p className="text-xs text-muted-foreground">Rating</p><p className="text-sm font-medium text-yellow-600">{teacher.rating || "N/A"}</p></div>
                </div>
              </div>
            ))}
            {filteredTeachers.length === 0 && <div className="text-center py-12"><p className="text-muted-foreground">No teachers found</p></div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
