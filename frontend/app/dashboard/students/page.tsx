"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const initialStudents: Student[] = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@email.com",
    batch: "JEE 2025",
    phone: "9876543210",
    attendance: 92,
    marks: 85,
    riskLevel: "low",
    isActive: true,
    xp: 1250,
  },
  {
    id: "2",
    name: "Rahul Kumar",
    email: "rahul@email.com",
    batch: "NEET 2025",
    phone: "9876543211",
    attendance: 65,
    marks: 42,
    riskLevel: "high",
    isActive: true,
    xp: 450,
  },
  {
    id: "3",
    name: "Ananya Patel",
    email: "ananya@email.com",
    batch: "JEE 2025",
    phone: "9876543212",
    attendance: 75,
    marks: 68,
    riskLevel: "medium",
    isActive: true,
    xp: 820,
  },
  {
    id: "4",
    name: "Vikram Singh",
    email: "vikram@email.com",
    batch: "NEET 2025",
    phone: "9876543213",
    attendance: 88,
    marks: 78,
    riskLevel: "low",
    isActive: true,
    xp: 1100,
  },
  {
    id: "5",
    name: "Sneha Reddy",
    email: "sneha@email.com",
    batch: "JEE 2025",
    phone: "9876543214",
    attendance: 55,
    marks: 35,
    riskLevel: "critical",
    isActive: false,
    xp: 220,
  },
  {
    id: "6",
    name: "Arjun Nair",
    email: "arjun@email.com",
    batch: "NEET 2025",
    phone: "9876543215",
    attendance: 82,
    marks: 72,
    riskLevel: "low",
    isActive: true,
    xp: 980,
  },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState<string>("all");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    batch: "",
    phone: "",
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch =
      filterBatch === "all" || student.batch === filterBatch;
    const matchesRisk =
      filterRisk === "all" || student.riskLevel === filterRisk;
    return matchesSearch && matchesBatch && matchesRisk;
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.batch) return;

    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      email: newStudent.email,
      batch: newStudent.batch,
      phone: newStudent.phone,
      attendance: 100,
      marks: 0,
      riskLevel: "low",
      isActive: true,
      xp: 0,
    };

    setStudents([...students, student]);
    setNewStudent({ name: "", email: "", batch: "", phone: "" });
    setIsAddModalOpen(false);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "critical":
        return (
          <Badge variant="destructive" className="capitalize">
            {level}
          </Badge>
        );
      case "high":
        return (
          <Badge
            variant="outline"
            className="border-destructive text-destructive capitalize"
          >
            {level}
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-600 capitalize"
          >
            {level}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="border-accent text-accent capitalize"
          >
            {level}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">
            Manage and monitor your students
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the student details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter student name"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@email.com"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Select
                  value={newStudent.batch}
                  onValueChange={(value) =>
                    setNewStudent({ ...newStudent, batch: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JEE 2025">JEE 2025</SelectItem>
                    <SelectItem value="NEET 2025">NEET 2025</SelectItem>
                    <SelectItem value="JEE 2026">JEE 2026</SelectItem>
                    <SelectItem value="NEET 2026">NEET 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Parent Phone</Label>
                <Input
                  id="phone"
                  placeholder="9876543210"
                  value={newStudent.phone}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, phone: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddStudent} className="w-full">
                Add Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterBatch} onValueChange={setFilterBatch}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="JEE 2025">JEE 2025</SelectItem>
                  <SelectItem value="NEET 2025">NEET 2025</SelectItem>
                  <SelectItem value="JEE 2026">JEE 2026</SelectItem>
                  <SelectItem value="NEET 2026">NEET 2026</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
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

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {filteredStudents.length} Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:border-primary/20 transition-colors gap-4"
              >
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
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {student.name}
                      </p>
                      {!student.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {student.email}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {student.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {student.batch}
                      </Badge>
                      {getRiskBadge(student.riskLevel)}
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
                        className={`text-sm font-medium flex items-center justify-center gap-1 ${
                          student.attendance >= 75
                            ? "text-accent"
                            : "text-destructive"
                        }`}
                      >
                        {student.attendance >= 75 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {student.attendance}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Marks</p>
                      <p
                        className={`text-sm font-medium ${
                          student.marks >= 60
                            ? "text-foreground"
                            : "text-destructive"
                        }`}
                      >
                        {student.marks}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">XP</p>
                      <p className="text-sm font-medium text-primary">
                        {student.xp}
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
                      <DropdownMenuItem>Update Details</DropdownMenuItem>
                      <DropdownMenuItem>Calculate Risk</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
