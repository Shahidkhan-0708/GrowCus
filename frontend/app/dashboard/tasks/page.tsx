"use client";

import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreVertical,
  Calendar,
  Users,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  subject: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  completionRate: number;
}

// Tasks for teachers/admin
const teacherTasks: Task[] = [
  {
    id: "1",
    title: "Physics Chapter 5 - Mechanics Problems",
    description: "Complete all numerical problems from HC Verma",
    assignedTo: "JEE Batch A",
    subject: "Physics",
    dueDate: "2026-04-26",
    status: "in-progress",
    priority: "high",
    completionRate: 45,
  },
  {
    id: "2",
    title: "Chemistry Mock Test - Organic",
    description: "Full length mock test covering organic chemistry",
    assignedTo: "NEET Batch B",
    subject: "Chemistry",
    dueDate: "2026-04-27",
    status: "pending",
    priority: "high",
    completionRate: 30,
  },
  {
    id: "3",
    title: "Biology Revision Notes",
    description: "Prepare revision notes for Human Physiology",
    assignedTo: "NEET Batch A",
    subject: "Biology",
    dueDate: "2026-04-28",
    status: "in-progress",
    priority: "medium",
    completionRate: 60,
  },
  {
    id: "4",
    title: "Mathematics - Calculus Practice",
    description: "Solve integration problems from RD Sharma",
    assignedTo: "JEE Batch B",
    subject: "Mathematics",
    dueDate: "2026-04-25",
    status: "completed",
    priority: "medium",
    completionRate: 100,
  },
  {
    id: "5",
    title: "Physics Previous Year Questions",
    description: "Solve last 5 years JEE Mains Physics questions",
    assignedTo: "JEE Batch A",
    subject: "Physics",
    dueDate: "2026-04-30",
    status: "pending",
    priority: "low",
    completionRate: 15,
  },
];

// Tasks for students (personal)
const studentTasks: Task[] = [
  {
    id: "s1",
    title: "Physics Chapter 5 - Mechanics Problems",
    description: "Complete all numerical problems from HC Verma",
    assignedTo: "Me",
    subject: "Physics",
    dueDate: "2026-04-26",
    status: "in-progress",
    priority: "high",
    completionRate: 60,
  },
  {
    id: "s2",
    title: "Chemistry Mock Test - Organic",
    description: "Full length mock test covering organic chemistry",
    assignedTo: "Me",
    subject: "Chemistry",
    dueDate: "2026-04-27",
    status: "pending",
    priority: "high",
    completionRate: 0,
  },
  {
    id: "s3",
    title: "Mathematics - Calculus Practice",
    description: "Solve integration problems from RD Sharma",
    assignedTo: "Me",
    subject: "Mathematics",
    dueDate: "2026-04-28",
    status: "in-progress",
    priority: "medium",
    completionRate: 40,
  },
  {
    id: "s4",
    title: "Physics Previous Year Questions",
    description: "Solve last 5 years JEE Mains Physics questions",
    assignedTo: "Me",
    subject: "Physics",
    dueDate: "2026-04-30",
    status: "pending",
    priority: "low",
    completionRate: 0,
  },
  {
    id: "s5",
    title: "Chemistry Chapter 3 Summary",
    description: "Write summary notes for Electrochemistry",
    assignedTo: "Me",
    subject: "Chemistry",
    dueDate: "2026-04-24",
    status: "completed",
    priority: "medium",
    completionRate: 100,
  },
];

export default function TasksPage() {
  const { isLoading, isStudent, isTeacher, isAdmin } = useUser();
  const [tasks, setTasks] = useState<Task[]>(isStudent ? studentTasks : teacherTasks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    subject: "",
    dueDate: "",
    priority: "medium",
  });

  // Update tasks when user role changes
  useState(() => {
    setTasks(isStudent ? studentTasks : teacherTasks);
  });

  const filteredTasks = tasks.filter((task) => {
    return filterStatus === "all" || task.status === filterStatus;
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) return;
    if ((isTeacher || isAdmin) && !newTask.assignedTo) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: isStudent ? "Me" : newTask.assignedTo,
      subject: newTask.subject,
      dueDate: newTask.dueDate,
      status: "pending",
      priority: newTask.priority as "low" | "medium" | "high",
      completionRate: 0,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      subject: "",
      dueDate: "",
      priority: "medium",
    });
    setIsAddModalOpen(false);
  };

  const updateTaskStatus = (
    taskId: string,
    status: "pending" | "in-progress" | "completed"
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              completionRate: status === "completed" ? 100 : task.completionRate,
            }
          : task
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-accent" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-primary" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Medium
          </Badge>
        );
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Physics":
        return "bg-blue-100 text-blue-700";
      case "Chemistry":
        return "bg-green-100 text-green-700";
      case "Mathematics":
        return "bg-purple-100 text-purple-700";
      case "Biology":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isStudent ? "My Tasks" : "Tasks"}
          </h1>
          <p className="text-muted-foreground">
            {isStudent
              ? "Track and complete your assigned tasks"
              : "Create and manage student assignments"}
          </p>
        </div>
        {(isTeacher || isAdmin) && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Assign a new task to your students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <Select
                      value={newTask.assignedTo}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, assignedTo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JEE Batch A">JEE Batch A</SelectItem>
                        <SelectItem value="JEE Batch B">JEE Batch B</SelectItem>
                        <SelectItem value="NEET Batch A">NEET Batch A</SelectItem>
                        <SelectItem value="NEET Batch B">NEET Batch B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={newTask.subject}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, subject: value })
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleAddTask} className="w-full">
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Circle className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.pending}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.inProgress}
                </p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.completed}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("all")}
        >
          All
        </Button>
        <Button
          variant={filterStatus === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("pending")}
        >
          Pending
        </Button>
        <Button
          variant={filterStatus === "in-progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("in-progress")}
        >
          In Progress
        </Button>
        <Button
          variant={filterStatus === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("completed")}
        >
          Completed
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      updateTaskStatus(
                        task.id,
                        task.status === "completed" ? "pending" : "completed"
                      )
                    }
                    className="mt-1"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3
                        className={`font-medium ${
                          task.status === "completed"
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {getPriorityBadge(task.priority)}
                      {task.subject && (
                        <Badge className={getSubjectColor(task.subject)}>
                          {task.subject}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      {!isStudent && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {task.assignedTo}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {isStudent ? "My Progress" : "Completion"}
                      </span>
                      <span className="font-medium text-foreground">
                        {task.completionRate}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          task.completionRate === 100
                            ? "bg-accent"
                            : "bg-primary"
                        }`}
                        style={{ width: `${task.completionRate}%` }}
                      />
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => updateTaskStatus(task.id, "pending")}
                      >
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateTaskStatus(task.id, "in-progress")}
                      >
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateTaskStatus(task.id, "completed")}
                      >
                        Mark as Completed
                      </DropdownMenuItem>
                      {(isTeacher || isAdmin) && (
                        <DropdownMenuItem className="text-destructive">
                          Delete Task
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tasks found</p>
              {isStudent && (
                <p className="text-sm text-muted-foreground mt-1">
                  Great job! You&apos;re all caught up.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
