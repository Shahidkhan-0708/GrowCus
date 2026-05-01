"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, CheckCircle2, Circle, AlertCircle, Calendar, Users, BookOpen } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToId: string;
  subject: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  completionRate: number;
}

interface StudentOption {
  id: string;
  name: string;
  email: string;
}

export default function TasksPage() {
  const { isLoading: userLoading, isStudent, isTeacher, isAdmin } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newTask, setNewTask] = useState({ title: "", assignedTo: "", subject: "", dueDate: "", priority: "medium" });

  async function loadTasks() {
    setIsLoading(true);
    try {
      const [tasksJson, studentsJson] = await Promise.all([
        apiFetch<{ tasks: Task[] }>("/api/tasks"),
        isStudent ? Promise.resolve({ students: [] }) : apiFetch<{ students: StudentOption[] }>("/api/students"),
      ]);
      setTasks(tasksJson.tasks);
      setStudents(studentsJson.students);
    } catch (err) {
      console.error("Tasks fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!userLoading) loadTasks();
  }, [userLoading]);

  const filteredTasks = tasks.filter((task) => filterStatus === "all" || task.status === filterStatus);

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.subject || !newTask.assignedTo || !newTask.dueDate) return;

    try {
      await apiFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(newTask),
      });
      setNewTask({ title: "", assignedTo: "", subject: "", dueDate: "", priority: "medium" });
      setIsAddModalOpen(false);
      loadTasks();
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
    setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status, completionRate: status === "completed" ? 100 : task.completionRate } : task));
    try {
      await apiFetch(`/api/tasks/${taskId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error("Update task error:", err);
      loadTasks();
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="w-4 h-4 text-accent" />;
    if (status === "in-progress") return <Clock className="w-4 h-4 text-primary" />;
    return <Circle className="w-4 h-4 text-muted-foreground" />;
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };

  if (userLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isStudent ? "My Tasks" : "Tasks"}</h1>
          <p className="text-muted-foreground">{isStudent ? "Track and complete your assigned tasks" : "Create and manage student assignments"}</p>
        </div>
        {(isTeacher || isAdmin) && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Create Task</Button></DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Assign a task to a real student account.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2"><Label htmlFor="title">Task Title</Label><Input id="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}>
                      <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                      <SelectContent>{students.map((student) => <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={newTask.subject} onValueChange={(value) => setNewTask({ ...newTask, subject: value })}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
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
                  <div className="space-y-2"><Label htmlFor="priority">Priority</Label><Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><Label htmlFor="dueDate">Due Date</Label><Input id="dueDate" type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} /></div>
                </div>
                <Button onClick={handleAddTask} className="w-full">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><AlertCircle className="w-5 h-5 text-primary mb-2" /><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total Tasks</p></CardContent></Card>
        <Card><CardContent className="pt-6"><Circle className="w-5 h-5 text-muted-foreground mb-2" /><p className="text-2xl font-bold">{stats.pending}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="pt-6"><Clock className="w-5 h-5 text-primary mb-2" /><p className="text-2xl font-bold">{stats.inProgress}</p><p className="text-xs text-muted-foreground">In Progress</p></CardContent></Card>
        <Card><CardContent className="pt-6"><CheckCircle2 className="w-5 h-5 text-accent mb-2" /><p className="text-2xl font-bold">{stats.completed}</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "in-progress", "completed"].map((status) => (
          <Button key={status} variant={filterStatus === status ? "default" : "outline"} size="sm" onClick={() => setFilterStatus(status)} className="capitalize">{status.replace("-", " ")}</Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-4">
                  <button onClick={() => updateTaskStatus(task.id, task.status === "completed" ? "pending" : "completed")} className="mt-1">{getStatusIcon(task.status)}</button>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className={`font-medium ${task.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.title}</h3>
                      <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "outline" : "secondary"}>{task.priority}</Badge>
                      <Badge>{task.subject}</Badge>
                    </div>
                    {!isStudent && <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{task.assignedTo}</p>}
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2"><Calendar className="w-3 h-3" />Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="w-32">
                  <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span>{task.completionRate}%</span></div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${task.completionRate}%` }} /></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card><CardContent className="py-12 text-center"><BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No tasks found</p></CardContent></Card>
        )}
      </div>
    </div>
  );
}
