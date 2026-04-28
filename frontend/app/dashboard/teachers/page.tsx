"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Users,
  Star,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

const initialTeachers: Teacher[] = [
  {
    id: "1",
    name: "Mr. Rajesh Sharma",
    email: "rajesh@growcus.com",
    phone: "9876543210",
    subject: "Physics",
    batches: ["JEE 2025 A", "JEE 2025 B"],
    studentsCount: 85,
    rating: 4.8,
    isActive: true,
  },
  {
    id: "2",
    name: "Mrs. Priya Patel",
    email: "priya@growcus.com",
    phone: "9876543211",
    subject: "Chemistry",
    batches: ["NEET 2025 A", "JEE 2025 A"],
    studentsCount: 72,
    rating: 4.6,
    isActive: true,
  },
  {
    id: "3",
    name: "Mr. Amit Kumar",
    email: "amit@growcus.com",
    phone: "9876543212",
    subject: "Mathematics",
    batches: ["JEE 2025 A", "JEE 2025 B", "JEE 2026"],
    studentsCount: 90,
    rating: 4.9,
    isActive: true,
  },
  {
    id: "4",
    name: "Dr. Neha Singh",
    email: "neha@growcus.com",
    phone: "9876543213",
    subject: "Biology",
    batches: ["NEET 2025 A", "NEET 2025 B"],
    studentsCount: 68,
    rating: 4.7,
    isActive: true,
  },
  {
    id: "5",
    name: "Mr. Vikram Reddy",
    email: "vikram@growcus.com",
    phone: "9876543214",
    subject: "Physics",
    batches: ["NEET 2025 B"],
    studentsCount: 45,
    rating: 4.5,
    isActive: false,
  },
];

export default function TeachersPage() {
  const { isLoading, isAdmin } = useUser();
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      filterSubject === "all" || teacher.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subject) return;

    const teacher: Teacher = {
      id: Date.now().toString(),
      name: newTeacher.name,
      email: newTeacher.email,
      phone: newTeacher.phone,
      subject: newTeacher.subject,
      batches: [],
      studentsCount: 0,
      rating: 0,
      isActive: true,
    };

    setTeachers([...teachers, teacher]);
    setNewTeacher({ name: "", email: "", phone: "", subject: "" });
    setIsAddModalOpen(false);
  };

  const stats = {
    total: teachers.length,
    active: teachers.filter((t) => t.isActive).length,
    totalStudents: teachers.reduce((sum, t) => sum + t.studentsCount, 0),
    avgRating: (
      teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length
    ).toFixed(1),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">
            Manage and monitor all teachers
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Enter the teacher details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter teacher name"
                  value={newTeacher.name}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@growcus.com"
                  value={newTeacher.email}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="9876543210"
                  value={newTeacher.phone}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={newTeacher.subject}
                  onValueChange={(value) =>
                    setNewTeacher({ ...newTeacher, subject: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTeacher} className="w-full">
                Add Teacher
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgRating}</p>
                <p className="text-xs text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {filteredTeachers.length} Teachers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:border-primary/20 transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {teacher.name
                        .split(" ")
                        .slice(1)
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {teacher.name}
                      </p>
                      {!teacher.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {teacher.email}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {teacher.phone}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="default" className="text-xs">
                        {teacher.subject}
                      </Badge>
                      {teacher.batches.slice(0, 2).map((batch) => (
                        <Badge key={batch} variant="outline" className="text-xs">
                          {batch}
                        </Badge>
                      ))}
                      {teacher.batches.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{teacher.batches.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Students</p>
                      <p className="text-sm font-medium text-foreground">
                        {teacher.studentsCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-sm font-medium flex items-center justify-center gap-1 text-yellow-600">
                        <Star className="w-3 h-3 fill-current" />
                        {teacher.rating || "N/A"}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Assign Batches</DropdownMenuItem>
                      <DropdownMenuItem>View Performance</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove Teacher
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No teachers found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
