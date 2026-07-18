'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { MetricCard, AriaInsightWidget, AnalyticsCard, MetricCardSkeleton, AnalyticsCardSkeleton } from '@/components/DashboardWidgets';
import confetti from 'canvas-confetti';
import { 
  mockStudents, 
  mockTeachers, 
  mockTasks, 
  performanceTrendData, 
  subjectPerformanceData, 
  riskTrendData, 
  attendanceTrendData, 
  weeklyXPData, 
  ariaChatPrompts, 
  ariaResponses,
  ariaMotivationalQuotes,
  Student,
  Task
} from '@/lib/mockData';
import { 
  Sparkles, 
  Plus, 
  BrainCircuit, 
  TrendingUp, 
  Clock, 
  UserCheck, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Search,
  MessageSquare,
  FileSpreadsheet,
  Zap,
  BookOpen,
  Trash2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-brand-border rounded-xl p-3 shadow-xl max-w-xs transition-all duration-200">
        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-gray-500 font-medium">{entry.name || entry.dataKey}:</span>
              </div>
              <span className="font-semibold text-gray-800">{entry.value}{entry.unit || '%'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const router = useRouter();
  const { 
    currentRole, 
    user, 
    isLoggedIn, 
    students, 
    teachers, 
    tasks, 
    notifications, 
    dashboardData,
    progressData,
    riskData,
    updateTaskStatus, 
    addNewTask, 
    addNewStudent,
    markNotificationRead,
    updateStudent,
    addNewTeacher,
    deleteTask
  } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  // Modals & States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  
  // New Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskSubject, setTaskSubject] = useState('Mathematics');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskStudentId, setTaskStudentId] = useState('');
  const [taskXp, setTaskXp] = useState(100);

  // New Student Form
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentBatch, setStudentBatch] = useState('Batch A - JEE 2026');
  const [studentAttendance, setStudentAttendance] = useState(90);

  // New Teacher Form
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('Mathematics');

  // Edit Student Form
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [editAttendance, setEditAttendance] = useState(85);
  const [editMarks, setEditMarks] = useState(75);

  // Aria Chat States
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'aria'; text: string }[]>([
    { sender: 'aria', text: ariaResponses.default }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [typing, setTyping] = useState(false);

  // Dynamically calculate System-Wide Average XP across all actual students
  const systemWideAvgXP = React.useMemo(() => {
    if (!students || students.length === 0) return '3,120 XP';
    const totalXP = students.reduce((sum, s) => sum + (s.xp || 0), 0);
    const avg = Math.round(totalXP / students.length);
    return `${avg.toLocaleString()} XP`;
  }, [students]);

  // Dynamically compute subject performance averages from the real live students collection
  const dynamicSubjectPerformance = React.useMemo(() => {
    if (!students || students.length === 0) return [];
    const subjectMap: Record<string, { total: number; count: number; max: number }> = {};
    students.forEach(student => {
      if (student.recentScores) {
        student.recentScores.forEach(scoreObj => {
          const sub = scoreObj.subject || 'Unassigned';
          const score = scoreObj.score;
          if (!subjectMap[sub]) {
            subjectMap[sub] = { total: 0, count: 0, max: 0 };
          }
          subjectMap[sub].total += score;
          subjectMap[sub].count += 1;
          if (score > subjectMap[sub].max) {
            subjectMap[sub].max = score;
          }
        });
      }
    });

    const results = Object.keys(subjectMap).map(sub => ({
      subject: sub,
      Averages: Math.round(subjectMap[sub].total / subjectMap[sub].count),
      Max: subjectMap[sub].max
    }));

    return results.length > 0 ? results : [];
  }, [students]);

  // Dynamic performance trends scaled from real student scores
  const dynamicPerformanceTrend = React.useMemo(() => {
    if (!students || students.length === 0) return [];
    const batchAScores = students.filter(s => s.batch === 'Batch A - JEE 2026').flatMap(s => s.recentScores || []);
    const batchBScores = students.filter(s => s.batch === 'Batch B - NEET 2026').flatMap(s => s.recentScores || []);
    
    const avgA = batchAScores.length ? Math.round(batchAScores.reduce((sum, score) => sum + score.score, 0) / batchAScores.length) : 75;
    const avgB = batchBScores.length ? Math.round(batchBScores.reduce((sum, score) => sum + score.score, 0) / batchBScores.length) : 70;

    return [
      { name: 'W1', BatchA: Math.max(0, Math.min(100, avgA - 4)), BatchB: Math.max(0, Math.min(100, avgB - 2)) },
      { name: 'W2', BatchA: Math.max(0, Math.min(100, avgA - 1)), BatchB: Math.max(0, Math.min(100, avgB - 3)) },
      { name: 'W3', BatchA: Math.max(0, Math.min(100, avgA - 3)), BatchB: Math.max(0, Math.min(100, avgB + 1)) },
      { name: 'W4', BatchA: avgA, BatchB: avgB },
    ];
  }, [students]);

  // Dynamic attendance trend scaling centered around the live student database average
  const dynamicAttendanceTrend = React.useMemo(() => {
    if (!students || students.length === 0) return attendanceTrendData;
    const avg = Math.round(students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length);
    return [
      { date: 'Mon', average: Math.max(0, Math.min(100, avg - 2)) },
      { date: 'Tue', average: Math.max(0, Math.min(100, avg + 1)) },
      { date: 'Wed', average: Math.max(0, Math.min(100, avg - 3)) },
      { date: 'Thu', average: Math.max(0, Math.min(100, avg + 2)) },
      { date: 'Fri', average: avg },
    ];
  }, [students]);

  // Dynamic Weekly XP scaling proportional to the current student's actual XP
  const dynamicWeeklyXP = React.useMemo(() => {
    const studentXp = user.xp || 3420;
    const dailyBase = Math.round(studentXp / 10);
    return [
      { day: 'Mon', XP: Math.round(dailyBase * 0.8) },
      { day: 'Tue', XP: Math.round(dailyBase * 1.2) },
      { day: 'Wed', XP: Math.round(dailyBase * 0.5) },
      { day: 'Thu', XP: Math.round(dailyBase * 1.5) },
      { day: 'Fri', XP: Math.round(dailyBase * 1.0) },
      { day: 'Sat', XP: Math.round(dailyBase * 2.0) },
      { day: 'Sun', XP: Math.round(dailyBase * 1.6) },
    ];
  }, [user.xp]);

  // Find actual logged-in user's attendance dynamically
  const currentUserAttendanceVal = React.useMemo(() => {
    const found = students.find(s => s.email === user.email);
    return found ? `${found.attendance}%` : '94%';
  }, [students, user.email]);

  // Sync route checks
  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn]);

  // Set default student select in task forms
  useEffect(() => {
    if (students.length > 0) {
      setTaskStudentId(students[0].id);
    }
  }, [students]);

  if (!mounted || !isLoggedIn) {
    return (
      <div className="flex h-screen overflow-hidden bg-brand-bg">
        <div className="w-64 bg-white border-r border-brand-border h-screen flex flex-col p-6 space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="space-y-3 flex-1 pt-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b border-brand-border/60 bg-white px-6 flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse" />
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-2 w-1/3">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <MetricCardSkeleton key={i} />)}
            </div>
            <div className="h-32 bg-white border border-brand-border rounded-xl p-5 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalyticsCardSkeleton />
              </div>
              <div>
                <AnalyticsCardSkeleton />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Handle Aria Message Submission
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setChatInput('');
    setTyping(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/aria/message-aria`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
      });
      
      if (!response.ok) throw new Error('API Error');
      const resData = await response.json();
      if (resData?.data?.reply) {
        setChatMessages(prev => [...prev, { sender: 'aria', text: resData.data.reply }]);
      } else {
        throw new Error('Malformed reply');
      }
    } catch (err) {
      console.warn("Backend Aria assistant failed, utilizing simulated response engine:", err);
      // Beautiful mock responses fallback
      const lowerText = text.toLowerCase();
      let reply = ariaResponses.default;
      
      if (lowerText.includes('kinetic') || lowerText.includes('chemistry')) {
        reply = ariaResponses['chemistry kinetics'];
      } else if (lowerText.includes('physics') || lowerText.includes('score') || lowerText.includes('boost')) {
        reply = ariaResponses['physics score'];
      } else if (lowerText.includes('calculus') || lowerText.includes('roadmap')) {
        reply = ariaResponses['calculus roadmap'];
      } else if (lowerText.includes('risk') || lowerText.includes('level')) {
        reply = ariaResponses['risk level'];
      }

      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'aria', text: reply }]);
      }, 1000);
    } finally {
      setTyping(false);
    }
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewTask({
      title: taskTitle,
      description: taskDesc,
      subject: taskSubject,
      priority: taskPriority,
      status: 'todo',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      xpValue: taskXp,
      studentId: taskStudentId
    });
    // Reset
    setTaskTitle('');
    setTaskDesc('');
    setTaskXp(100);
    setShowTaskModal(false);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewStudent({
      name: studentName,
      email: studentEmail,
      batch: studentBatch,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      attendance: studentAttendance,
      completionRate: 50,
      weakSubjects: []
    });
    // Reset
    setStudentName('');
    setStudentEmail('');
    setShowStudentModal(false);
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNewTeacher({
      name: teacherName,
      email: teacherEmail,
      subject: teacherSubject,
    });
    // Reset
    setTeacherName('');
    setTeacherEmail('');
    setTeacherSubject('Mathematics');
    setShowTeacherModal(false);
  };

  const handleEditStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForEdit) return;

    await updateStudent(selectedStudentForEdit.id, {
      attendance: editAttendance,
      marks: editMarks,
    });

    setShowEditModal(false);
    setSelectedStudentForEdit(null);
  };

  // Color mappings
  const COLORS = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f43f5e',
    critical: '#881337',
  };

  // Drag and drop task logic (simplified with quick buttons for perfect cross-platform stability)
  const taskColumns: { id: Task['status']; name: string; border: string }[] = [
    { id: 'todo', name: 'To Do', border: 'border-t-zinc-600' },
    { id: 'in-progress', name: 'In Progress', border: 'border-t-brand-primary' },
    { id: 'review', name: 'In Review', border: 'border-t-brand-secondary' },
    { id: 'completed', name: 'Completed', border: 'border-t-brand-success' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg">
      {/* 1. Sidebar Nav */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Decorative background glows */}
        <div className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-brand-primary/5 filter blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[100px] w-[350px] h-[350px] rounded-full bg-brand-secondary/5 filter blur-[90px] pointer-events-none" />

        {/* 2. Top Navbar */}
        <Navbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNotificationClick={() => setActiveTab('notifications')}
        />

        {/* 3. Core Scrollable View Router */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + currentRole}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              
              {/* ======================================================== */}
              {/* VIEW: DASHBOARD - Renders specific roles dynamically */}
              {/* ======================================================== */}
              {activeTab === 'dashboard' && (
                <>
                  {/* Title Welcome Bar */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 data-testid="dashboard-welcome" className="text-xl font-bold tracking-tight text-gray-800">Welcome back, {user.name}</h2>
                      <p className="text-xs text-gray-500">
                        Here is your academic intelligence overview for today.
                      </p>
                    </div>
                    {currentRole === 'teacher' && (
                      <button 
                        data-testid="assign-task-btn"
                        onClick={() => setShowTaskModal(true)}
                        className="bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-brand-primary/20 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Assign Task</span>
                      </button>
                    )}
                    {currentRole === 'admin' && (
                      <button 
                        data-testid="enroll-student-btn"
                        onClick={() => setShowStudentModal(true)}
                        className="bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-brand-primary/20 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Enroll Student</span>
                      </button>
                    )}
                  </div>

                  {/* ---------------------------------------------------- */}
                  {/* ADMIN DASHBOARD SUB-VIEW */}
                  {/* ---------------------------------------------------- */}
                  {currentRole === 'admin' && (
                    <div className="space-y-8">
                      {/* Metric cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard 
                          title="Total Active Students" 
                          value={dashboardData?.stats?.totalStudents ?? students.length} 
                          change={12} 
                          trend="up" 
                          description="vs last semester" 
                          icon={<UserCheck size={18} />} 
                          theme="blue"
                        />
                        <MetricCard 
                          title="Faculty Strength" 
                          value={dashboardData?.stats?.activeTeachers ?? teachers.length} 
                          change={4} 
                          trend="up" 
                          description="tutors enrolled" 
                          icon={<BookOpen size={18} />} 
                          theme="blue"
                        />
                        <MetricCard 
                          title="At-Risk Alerts" 
                          value={dashboardData?.stats?.atRiskStudents ?? students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length} 
                          change={-15} 
                          trend="up" 
                          description="decline in critical risk" 
                          icon={<AlertTriangle size={18} />} 
                          theme="danger"
                        />
                        <MetricCard 
                          title="System-Wide Avg XP" 
                          value={systemWideAvgXP} 
                          change={8} 
                          trend="up" 
                          description="active gamification" 
                          icon={<Award size={18} />} 
                          theme="purple"
                        />
                      </div>

                      {/* Aria recommendation */}
                      <AriaInsightWidget 
                        recommendation="Aria's Intelligence Alert: 14 students in Batch B have low attendance. Rohan Mehra & Ananya Iyer have attendance values below 75%; trigger early academic support outreach." 
                        actionText="View Weak Subject Logs"
                        onActionClick={() => setActiveTab('risk')}
                      />

                      {/* Visual charts */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Performance trends */}
                        <div className="lg:col-span-2">
                          <AnalyticsCard title="Institute Academic Performance trends" subtitle="Average test percentages by batch">
                            <div className="h-72">
                              {dynamicPerformanceTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={dynamicPerformanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                      <linearGradient id="colorBatchA" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorBatchB" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#15803D" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#15803D" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="BatchA" name="JEE Batch A" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#colorBatchA)" />
                                    <Area type="monotone" dataKey="BatchB" name="NEET Batch B" stroke="#15803D" strokeWidth={2} fillOpacity={1} fill="url(#colorBatchB)" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                                  <TrendingUp size={32} className="text-gray-400" />
                                  <p className="text-sm text-gray-500 font-medium">No performance data yet</p>
                                  <p className="text-xs text-gray-400">Charts will populate automatically once students have recorded scores.</p>
                                </div>
                              )}
                            </div>
                          </AnalyticsCard>
                        </div>

                        {/* Risk distribution donut chart */}
                        <AnalyticsCard title="Risk Distribution Profile" subtitle="Student counts across safety indices">
                          <div className="h-72 flex flex-col justify-between items-center">
                            {students.length > 0 ? (
                              <>
                                <ResponsiveContainer width="100%" height="80%">
                                  <PieChart>
                                    <Pie
                                      data={[
                                        { name: 'Low Risk', value: students.filter(s => s.riskLevel === 'low').length },
                                        { name: 'Medium Risk', value: students.filter(s => s.riskLevel === 'medium').length },
                                        { name: 'High Risk', value: students.filter(s => s.riskLevel === 'high').length },
                                        { name: 'Critical Risk', value: students.filter(s => s.riskLevel === 'critical').length },
                                      ]}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={4}
                                      dataKey="value"
                                    >
                                      <Cell fill={COLORS.low} />
                                      <Cell fill={COLORS.medium} />
                                      <Cell fill={COLORS.high} />
                                      <Cell fill={COLORS.critical} />
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                  </PieChart>
                                </ResponsiveContainer>
                                <div className="flex gap-4 text-[10px] text-gray-500">
                                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low</span>
                                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium</span>
                                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High</span>
                                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" /> Critical</span>
                                </div>
                              </>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center gap-3 text-center w-full">
                                <AlertTriangle size={32} className="text-gray-400" />
                                <p className="text-sm text-gray-500 font-medium">No risk data yet</p>
                                <p className="text-xs text-gray-400">Risk profiles will be generated when students are enrolled.</p>
                              </div>
                            )}
                          </div>
                        </AnalyticsCard>
                      </div>
                    </div>
                  )}

                  {/* ---------------------------------------------------- */}
                  {/* TEACHER DASHBOARD SUB-VIEW */}
                  {/* ---------------------------------------------------- */}
                  {currentRole === 'teacher' && (
                    <div className="space-y-8">
                      {/* Metric Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard 
                          title="Assigned Batches" 
                          value="2 Batches" 
                          description="JEE A & NEET B" 
                          icon={<BookOpen size={18} />} 
                          theme="blue"
                        />
                        <MetricCard 
                          title="Pending Review Logs" 
                          value={tasks.filter(t => t.status === 'review').length} 
                          description="awaiting approval" 
                          icon={<Clock size={18} />} 
                          theme="purple"
                        />
                        <MetricCard 
                          title="At-Risk Alerts" 
                          value={students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length} 
                          description="needs attention" 
                          icon={<AlertTriangle size={18} />} 
                          theme="danger"
                        />
                      </div>

                      {/* Performance Trend chart */}
                      <AnalyticsCard title="Assigned Batches Progress velocity" subtitle="Weekly consistency indicators">
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dynamicSubjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <XAxis dataKey="subject" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="Averages" name="Batch Average %" fill="#16A34A" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="Max" name="Topper Score %" fill="#15803D" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </AnalyticsCard>

                      {/* Quick assignment list */}
                      <div className="bg-white border border-brand-border rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-gray-800 tracking-tight pb-4 border-b border-brand-border/40">My Students Academic Roster</h3>
                        <div className="overflow-x-auto">
                          <table className="custom-table mt-4">
                            <thead>
                              <tr>
                                <th>Student</th>
                                <th>Batch</th>
                                <th>Attendance</th>
                                <th>Completion Rate</th>
                                <th>Risk Indicator</th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.map((student) => (
                                <tr key={student.id}>
                                  <td className="font-medium text-gray-800">{student.name}</td>
                                  <td className="text-gray-500">{student.batch}</td>
                                  <td>
                                    <span className={student.attendance < 75 ? 'text-brand-danger font-semibold' : 'text-gray-600'}>
                                      {student.attendance}%
                                    </span>
                                  </td>
                                  <td>{student.completionRate}%</td>
                                  <td>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                                      student.riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-500' :
                                      student.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                      student.riskLevel === 'high' ? 'bg-rose-500/10 text-rose-500' :
                                      'bg-red-950/20 text-red-500 border border-red-900/40'
                                    }`}>
                                      {student.riskLevel}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ---------------------------------------------------- */}
                  {/* STUDENT DASHBOARD SUB-VIEW */}
                  {/* ---------------------------------------------------- */}
                  {currentRole === 'student' && (
                    <div className="space-y-8">
                      {/* Metric cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <MetricCard 
                          title="Active Streak" 
                          value={`${progressData?.streak ?? user.streak ?? 12} Days`} 
                          description="Daily consistency log" 
                          icon={<Zap size={18} className="text-amber-500" />} 
                          theme="amber"
                        />
                        <MetricCard 
                          title="Level Progress" 
                          value={`Level ${user.level || 4}`} 
                          description="80 XP until Level 5" 
                          icon={<Award size={18} />} 
                          theme="purple"
                        />
                        <MetricCard 
                          title="Assignments Completed" 
                          value={`${progressData?.overallProgress ?? user.completionRate ?? 88}%`} 
                          description="Homework completion index" 
                          icon={<CheckCircle2 size={18} />} 
                          theme="blue"
                        />
                        <MetricCard 
                          title="Attendance index" 
                          value={currentUserAttendanceVal} 
                          description="Tutorial compliance" 
                          icon={<UserCheck size={18} />} 
                          theme="emerald"
                        />
                      </div>

                      {/* Aria's tip banner */}
                      <AriaInsightWidget 
                        recommendation={React.useMemo(() => ariaMotivationalQuotes[Math.floor(Math.random() * ariaMotivationalQuotes.length)], [])} 
                        actionText="Consult Aria Assistant"
                        onActionClick={() => setActiveTab('aria')}
                      />

                      {/* Study Trends and Streaks */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Weekly XP growth chart */}
                        <div className="lg:col-span-2">
                          <AnalyticsCard title="My Weekly XP Gain Velocity" subtitle="XP rewards earned per day">
                            <div className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dynamicWeeklyXP} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                  <defs>
                                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#15803D" stopOpacity={0.2}/>
                                      <stop offset="95%" stopColor="#15803D" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Area type="monotone" dataKey="XP" stroke="#15803D" strokeWidth={2.5} fillOpacity={1} fill="url(#colorXp)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </AnalyticsCard>
                        </div>

                        {/* Subject Progress vector */}
                        <AnalyticsCard title="Subject Mastery tracker" subtitle="Concept completion metrics">
                          <div className="space-y-5">
                            {progressData?.subjectProgress && progressData.subjectProgress.length > 0 ? (
                              progressData.subjectProgress.map((subProg: any) => (
                                <div key={subProg.subject}>
                                  <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-500">{subProg.subject} ({subProg.completed}/{subProg.topics} topics)</span>
                                    <span className="text-gray-800 font-semibold">{subProg.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${subProg.color || 'bg-brand-primary'}`} style={{ width: `${subProg.progress}%` }} />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <>
                                <div>
                                  <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-500">Mathematics (Calculus)</span>
                                    <span className="text-gray-800 font-semibold">92%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div className="bg-brand-primary h-full rounded-full" style={{ width: '92%' }} />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-500">Physics (Fluid Dynamics)</span>
                                    <span className="text-gray-800 font-semibold">85%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div className="bg-brand-secondary h-full rounded-full" style={{ width: '85%' }} />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-500">Chemistry (Kinetics)</span>
                                    <span className="text-gray-800 font-semibold">70%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div className="bg-brand-warning h-full rounded-full" style={{ width: '70%' }} />
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Badges list */}
                            <div className="pt-4 border-t border-brand-border/40">
                              <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Acquired Badges</h4>
                              <div className="flex gap-2 mt-2">
                                <span className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                                  <Zap size={10} /> Streak Master
                                </span>
                                <span className="bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                                  <Award size={10} /> Formula Wiz
                                </span>
                              </div>
                            </div>
                          </div>
                        </AnalyticsCard>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ======================================================== */}
              {/* VIEW: STUDENTS REGISTRY */}
              {/* ======================================================== */}
              {activeTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Student Enrollment Registry</h2>
                      <p className="text-xs text-gray-500">Manage enrolled student rosters, batches, risk values, and analytical trackers.</p>
                    </div>
                    <button 
                      onClick={() => setShowStudentModal(true)}
                      className="bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-brand-primary/20 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Enroll New Student</span>
                    </button>
                  </div>

                  <div className="bg-white border border-brand-border rounded-xl overflow-hidden p-5">
                    <div className="overflow-x-auto">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Email Address</th>
                            <th>Batch Section</th>
                            <th>XP points</th>
                            <th>Level</th>
                            <th>Attendance</th>
                            <th>Risk Score</th>
                            <th>Risk Level</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td className="font-semibold text-gray-800 flex items-center gap-2">
                                <img src={student.avatarUrl} className="w-6 h-6 rounded-full object-cover border border-brand-border" alt="" />
                                <span>{student.name}</span>
                              </td>
                              <td className="text-gray-500 text-xs">{student.email}</td>
                              <td className="text-gray-600 font-light">{student.batch}</td>
                              <td>{student.xp} XP</td>
                              <td>Level {student.level}</td>
                              <td>
                                <span className={student.attendance < 75 ? 'text-brand-danger font-semibold' : 'text-gray-600'}>
                                  {student.attendance}%
                                </span>
                              </td>
                              <td>{student.riskScore}/100</td>
                              <td>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                                  student.riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-500' :
                                  student.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                  student.riskLevel === 'high' ? 'bg-rose-500/10 text-rose-500' :
                                  'bg-red-950/20 text-red-500 border border-red-900/40 animate-pulse'
                                }`}>
                                  {student.riskLevel}
                                </span>
                              </td>
                              <td>
                                {(currentRole === 'teacher' || currentRole === 'admin') && (
                                  <button
                                    onClick={() => {
                                      setSelectedStudentForEdit(student);
                                      setEditAttendance(student.attendance);
                                      setEditMarks(student.marks || 75);
                                      setShowEditModal(true);
                                    }}
                                    className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-[10px] px-2.5 py-1 rounded transition-colors cursor-pointer border border-brand-primary/20 font-medium"
                                  >
                                    Update Metrics
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW: TEACHERS FACULTY HUB */}
              {/* ======================================================== */}
              {activeTab === 'teachers' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Faculty Registry</h2>
                      <p className="text-xs text-gray-500">View active teachers, assigned subjects, batch coverage, and analytical summaries.</p>
                    </div>
                    {currentRole === 'admin' && (
                      <button 
                        onClick={() => setShowTeacherModal(true)}
                        className="bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-brand-primary/20 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Enroll Faculty</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {teachers.map((teacher) => (
                      <div key={teacher.id} className="bg-white border border-brand-border rounded-xl p-5 hover:border-brand-border transition-all">
                        <div className="flex items-center gap-3">
                          <img src={teacher.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-brand-border" />
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800">{teacher.name}</h3>
                            <p className="text-[10px] text-gray-500">{teacher.email}</p>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3 pt-4 border-t border-brand-border/40 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Subjects:</span>
                            <span className="text-gray-800 font-medium">{teacher.subjects.join(', ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Assigned Batches:</span>
                            <span className="text-gray-800 font-medium">{teacher.batches.length} Batches</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Covered Students:</span>
                            <span className="text-brand-primary font-semibold">{teacher.studentsCount} Students</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW: INTERACTIVE TASK KANBAN WORKSPACE */}
              {/* ======================================================== */}
              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Tasks Kanban Board Workspace</h2>
                      <p className="text-xs text-gray-500">Track and update assigned homework velocity. Click column action buttons to shift task states.</p>
                    </div>
                    {currentRole !== 'student' && (
                      <button 
                        onClick={() => setShowTaskModal(true)}
                        className="bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-brand-primary/20 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Assign Task</span>
                      </button>
                    )}
                  </div>

                  {/* Kanban Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
                    {taskColumns.map((col) => {
                      // Filter tasks by column
                      const filteredTasks = tasks.filter(t => {
                        // Student only sees their own tasks
                        if (currentRole === 'student' && t.studentId !== user.id) return false;
                        return t.status === col.id;
                      });

                      return (
                        <div key={col.id} className="min-w-[250px] bg-gray-50 rounded-xl p-4 border border-brand-border flex flex-col h-[600px]">
                          {/* Column header */}
                          <div className="flex justify-between items-center pb-3 border-b border-brand-border/40 mb-4">
                            <span className="text-xs font-semibold text-gray-800 tracking-wider uppercase">{col.name}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                              {filteredTasks.length}
                            </span>
                          </div>

                          {/* Task Cards list */}
                          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                            {filteredTasks.length === 0 ? (
                              <div className="border border-dashed border-brand-border rounded-lg p-6 text-center text-gray-400 text-xs my-auto">
                                No tasks
                              </div>
                            ) : (
                              filteredTasks.map((task) => (
                                <div 
                                  key={task.id} 
                                  className={`bg-white border border-brand-border/60 hover:border-brand-border p-4 rounded-lg space-y-3 shadow transition-all duration-200 group relative`}
                                >
                                  <div>
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="text-[10px] text-brand-primary font-semibold uppercase">{task.subject}</span>
                                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                        task.priority === 'high' ? 'bg-rose-500/10 text-rose-500' :
                                        task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-emerald-500/10 text-emerald-500'
                                      }`}>
                                        {task.priority}
                                      </span>
                                    </div>
                                    <h4 className="text-xs font-semibold text-gray-800 tracking-tight mt-1">{task.title}</h4>
                                    <p className="text-[10px] text-gray-500 leading-normal line-clamp-2 mt-1">{task.description}</p>
                                  </div>

                                  <div className="flex justify-between items-center pt-2 border-t border-brand-border/40 text-[9px] text-gray-500">
                                    <span>Assigned to: <strong className="text-gray-700">{task.studentName}</strong></span>
                                    <span className="bg-brand-secondary/10 text-brand-secondary font-medium px-1 py-0.5 rounded">+{task.xpValue} XP</span>
                                  </div>

                                  {/* Quick Action status cycles */}
                                  <div className="flex gap-1 justify-end pt-2">
                                    {col.id !== 'todo' && (
                                      <button 
                                        onClick={() => updateTaskStatus(task.id, col.id === 'in-progress' ? 'todo' : col.id === 'review' ? 'in-progress' : 'review')}
                                        className="text-[8px] bg-gray-50 border border-brand-border text-gray-500 hover:text-brand-primary px-2 py-0.5 rounded cursor-pointer transition-colors"
                                      >
                                        ◀ Back
                                      </button>
                                    )}
                                    {col.id !== 'completed' && (
                                      <button 
                                        onClick={() => {
                                          const nextStatus = col.id === 'todo' ? 'in-progress' : col.id === 'in-progress' ? 'review' : 'completed';
                                          updateTaskStatus(task.id, nextStatus);
                                          if (nextStatus === 'completed') {
                                            confetti({
                                              particleCount: 120,
                                              spread: 70,
                                              origin: { y: 0.6 },
                                              colors: ['#16A34A', '#15803D', '#4ADE80', '#FFFFFF']
                                            });
                                          }
                                        }}
                                        className="text-[8px] bg-brand-primary hover:bg-brand-primary/90 text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
                                      >
                                        Next ▶
                                      </button>
                                    )}
                                    {currentRole !== 'student' && (
                                      <button 
                                        onClick={() => deleteTask(task.id)}
                                        className="text-[8px] bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-brand-primary p-1 rounded cursor-pointer transition-colors ml-1"
                                        title="Delete Task"
                                      >
                                        <Trash2 size={10} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW: DETAILED ANALYTICS MODULE */}
              {/* ======================================================== */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Platform Performance Analytics</h2>
                    <p className="text-xs text-gray-500">Detailed line matrices, comparative benchmarks, and syllabus milestones.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Subject Performance Bar Chart */}
                    <AnalyticsCard title="Subject Score Averages" subtitle="Average marks per subject across all enrolled students">
                      <div className="h-72">
                        {dynamicSubjectPerformance.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dynamicSubjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <XAxis dataKey="subject" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} domain={[0, 100]} />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Bar dataKey="Averages" name="Class Average" fill="#16A34A" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="Max" name="Top Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                            <FileSpreadsheet size={32} className="text-gray-400" />
                            <p className="text-sm text-gray-500 font-medium">No performance data yet</p>
                            <p className="text-xs text-gray-400">Charts will populate automatically once students have recorded scores.</p>
                          </div>
                        )}
                      </div>
                    </AnalyticsCard>

                    {/* Attendance Overview */}
                    <AnalyticsCard title="Attendance Overview" subtitle="Average attendance rate of all students">
                      <div className="h-72">
                        {dynamicAttendanceTrend.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dynamicAttendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} domain={[0, 100]} />
                              <Tooltip content={<CustomTooltip />} />
                              <Area type="monotone" dataKey="average" name="Avg Attendance %" stroke="#16A34A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAtt)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                            <TrendingUp size={32} className="text-gray-400" />
                            <p className="text-sm text-gray-500 font-medium">No attendance data yet</p>
                            <p className="text-xs text-gray-400">Charts will appear once students are enrolled and attendance is recorded.</p>
                          </div>
                        )}
                      </div>
                    </AnalyticsCard>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW: RISK INTELLIGENCE FORECAST */}
              {/* ======================================================== */}
              {activeTab === 'risk' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Risk Intelligence AI Dashboard</h2>
                    <p className="text-xs text-gray-500">Stripe-style analytics forecasting student retention and predicting weak topics.</p>
                  </div>

                  {/* Warning grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Metric 1 */}
                    <div className="bg-white border border-brand-border rounded-xl p-5 relative overflow-hidden">
                      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
                        <span className="text-xs font-semibold text-gray-500">High Risk Clusters</span>
                        <span className="text-[10px] text-gray-500">2 Batches analysed</span>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Weak Syllabus Index:</span>
                          <span className="text-brand-danger font-semibold">Organic Chemistry</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-normal">
                          4 students scored under 60% on reactions modules. Remedial tests are recommended.
                        </p>
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-white border border-brand-border rounded-xl p-5 relative overflow-hidden">
                      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
                        <span className="text-xs font-semibold text-gray-500">Attendance Flag Drops</span>
                        <span className="text-[10px] text-brand-danger bg-brand-danger/10 px-1.5 py-0.5 rounded font-medium">Critical</span>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Critical Student Threshold:</span>
                          <span className="text-gray-800 font-semibold">Ananya Iyer (65%)</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-normal">
                          Attendance is 15% below the system margin. Send automated alert vectors immediately.
                        </p>
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="aria-glow bg-white border border-brand-border rounded-xl p-5 relative overflow-hidden">
                      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
                        <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                          <BrainCircuit size={12} className="text-brand-secondary shrink-0" /> Aria Predictive Insights
                        </span>
                        <span className="text-[10px] text-brand-secondary font-semibold">Active</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-light mt-4">
                        "Enrolling this student in Chemistry Kinetics drills today has a 94% probability of boosting their score from 72% to 85% by next week."
                      </p>
                    </div>
                  </div>

                  {/* List of at-risk students */}
                  <div className="bg-white border border-brand-border rounded-xl overflow-hidden p-5">
                    <h3 className="text-sm font-semibold text-gray-800 tracking-tight pb-4 border-b border-brand-border/40">AI Academic Risk Vectors</h3>
                    <div className="overflow-x-auto mt-4">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Batch</th>
                            <th>Attendance</th>
                            <th>Completion Rate</th>
                            <th>Weak Concept Clusters</th>
                            <th>Risk Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td className="font-semibold text-gray-800 flex items-center gap-2">
                                <img src={student.avatarUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
                                <span>{student.name}</span>
                              </td>
                              <td className="text-gray-500">{student.batch}</td>
                              <td>{student.attendance}%</td>
                              <td>{student.completionRate}%</td>
                              <td>
                                <div className="flex flex-wrap gap-1">
                                  {student.weakSubjects.length === 0 ? (
                                    <span className="text-[10px] text-gray-500">None detected</span>
                                  ) : (
                                    student.weakSubjects.map((sub, i) => (
                                      <span key={i} className="text-[9px] bg-gray-100 border border-brand-border px-1.5 py-0.5 rounded text-gray-600">
                                        {sub}
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  student.riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-500' :
                                  student.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                  student.riskLevel === 'high' ? 'bg-rose-500/10 text-rose-500' :
                                  'bg-red-950/20 text-red-500 border border-red-900/40 animate-pulse'
                                }`}>
                                  {student.riskLevel}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW: ARIA AI MENTOR CHAT INTERFACE */}
              {/* ======================================================== */}
              {activeTab === 'aria' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Sparkles className="text-brand-secondary shrink-0" /> Aria AI Academic Coach
                    </h2>
                    <p className="text-xs text-gray-500">Intelligent mentor assisting students with curriculum paths, numerical feedback, and concept reviews.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[550px]">
                    {/* Prompts shortcuts panel (1 col) */}
                    <div className="lg:col-span-1 bg-gray-50 rounded-xl p-4 border border-brand-border flex flex-col gap-3 justify-start overflow-y-auto">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Suggested Queries</h4>
                      {ariaChatPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(prompt)}
                          className="w-full text-left bg-white border border-brand-border/60 hover:border-brand-border px-3 py-2 rounded-lg text-xs text-gray-600 hover:text-brand-primary transition-all cursor-pointer leading-normal flex items-start gap-1.5 group"
                        >
                          <ChevronRight size={12} className="shrink-0 text-brand-secondary group-hover:translate-x-0.5 transition-transform mt-0.5" />
                          <span>{prompt}</span>
                        </button>
                      ))}
                    </div>

                    {/* Chat Bubble terminal (3 cols) */}
                    <div className="lg:col-span-3 bg-gray-50 rounded-xl p-5 border border-brand-border flex flex-col justify-between h-full relative">
                      {/* Messages scrollarea */}
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                        {chatMessages.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-brand-primary text-white ml-12 rounded-tr-none'
                                : 'bg-white text-gray-600 border border-brand-border mr-12 rounded-tl-none font-light'
                            }`}>
                              <span className="block font-semibold text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
                                {msg.sender === 'user' ? `${user.name} (${currentRole})` : 'Aria Academic Mentor'}
                              </span>
                              <div className="whitespace-pre-line">{msg.text}</div>
                            </div>
                          </div>
                        ))}
                        {typing && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-brand-border rounded-xl p-3 mr-12 text-sm text-gray-500 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-brand-secondary animate-bounce" />
                              <span className="w-2 h-2 rounded-full bg-brand-secondary animate-bounce delay-100" />
                              <span className="w-2 h-2 rounded-full bg-brand-secondary animate-bounce delay-200" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Text Input footer */}
                      <div className="flex gap-2">
                        <input
                          data-testid="aria-chat-input"
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage(chatInput);
                          }}
                          placeholder="Ask Aria... e.g., Chemistry kinetics orders or boost my physics score"
                          className="flex-1 bg-gray-50 border border-brand-border focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-colors outline-none"
                        />
                        <button
                          data-testid="aria-send-btn"
                          onClick={() => handleSendMessage(chatInput)}
                          className="bg-brand-secondary hover:bg-brand-secondary/95 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW: NOTIFICATIONS */}
              {/* ======================================================== */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">System Notification Center</h2>
                    <p className="text-xs text-gray-500">Critical alerts, trigger actions, and student completion signals.</p>
                  </div>

                  <div className="bg-white border border-brand-border rounded-xl overflow-hidden max-w-3xl">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-5 border-b border-brand-border last:border-b-0 hover:bg-gray-50 transition-colors flex justify-between items-start gap-4 ${
                          !notif.read ? 'bg-brand-primary/5' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              notif.type === 'alert' ? 'bg-brand-danger animate-pulse' :
                              notif.type === 'warning' ? 'bg-brand-warning' :
                              notif.type === 'success' ? 'bg-brand-success' : 'bg-brand-primary'
                            }`} />
                            <h4 className="text-sm font-semibold text-gray-800">{notif.title}</h4>
                            <span className="text-[10px] text-gray-500 font-light ml-2">{notif.createdAt}</span>
                          </div>
                          <p className="text-xs text-gray-500 pl-4">{notif.message}</p>
                        </div>
                        
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            className="text-[10px] text-brand-primary hover:underline font-medium cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VIEW: SETTINGS — Real Account Settings */}
              {/* ======================================================== */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
                    <p className="text-xs text-gray-500">Manage your profile information and account preferences.</p>
                  </div>

                  {/* Profile Card */}
                  <div className="bg-white border border-brand-border rounded-xl p-6 space-y-5">
                    <h3 className="text-sm font-semibold text-gray-800 pb-3 border-b border-brand-border/40">Profile Information</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-lg font-bold shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                          currentRole === 'admin' ? 'bg-blue-500/15 text-blue-400' :
                          currentRole === 'teacher' ? 'bg-emerald-500/15 text-emerald-400' :
                          'bg-purple-500/15 text-purple-400'
                        }`}>{currentRole}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-gray-500 font-semibold block">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          readOnly
                          className="w-full bg-gray-50 border border-brand-border rounded-lg px-3 py-2 text-gray-600 outline-none cursor-not-allowed opacity-70"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-gray-500 font-semibold block">Email Address</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          readOnly
                          className="w-full bg-gray-50 border border-brand-border rounded-lg px-3 py-2 text-gray-600 outline-none cursor-not-allowed opacity-70"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-gray-500 font-semibold block">Role</label>
                        <input
                          type="text"
                          defaultValue={currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                          readOnly
                          className="w-full bg-gray-50 border border-brand-border rounded-lg px-3 py-2 text-gray-600 outline-none cursor-not-allowed opacity-70"
                        />
                      </div>
                      {(user as any).batch && (
                        <div className="space-y-1.5">
                          <label className="text-gray-500 font-semibold block">Batch</label>
                          <input
                            type="text"
                            defaultValue={(user as any).batch}
                            readOnly
                            className="w-full bg-gray-50 border border-brand-border rounded-lg px-3 py-2 text-gray-600 outline-none cursor-not-allowed opacity-70"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="bg-white border border-brand-border rounded-xl p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800 pb-3 border-b border-brand-border/40">Platform Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-gray-500 block">Backend Status</span>
                        <span className="text-brand-success font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse inline-block" />
                          Connected
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-500 block">AI Assistant</span>
                        <span className="text-brand-secondary font-semibold">Groq LLM (Active)</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-500 block">Risk Model</span>
                        <span className="text-gray-800 font-semibold">Attendance + Task Velocity v3</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-500 block">Auth Method</span>
                        <span className="text-gray-800 font-semibold">HTTP-Only Cookie JWT</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ======================================================== */}
      {/* DIALOG MODAL: ASSIGN TASK (Teacher/Admin) */}
      {/* ======================================================== */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-brand-border rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-brand-border/40 bg-gray-50 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-800 tracking-wide uppercase">Assign New Homework Module</span>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="text-gray-500 hover:text-brand-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-500 font-semibold">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Physics homework - Fluid mechanics drills"
                  className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-500 font-semibold">Detailed Instructions</label>
                <textarea
                  required
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="e.g. Solve Q1-Q15 regarding Bernoulli Equation coefficients."
                  className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 placeholder-gray-400 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-500 font-semibold">Subject Category</label>
                  <select
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 font-semibold">Priority Index</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-500 font-semibold">Select Student</label>
                  <select
                    value={taskStudentId}
                    onChange={(e) => setTaskStudentId(e.target.value)}
                    className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 outline-none cursor-pointer"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.batch.split(' ')[0]})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 font-semibold">XP Reward Potential</label>
                  <input
                    type="number"
                    value={taskXp}
                    onChange={(e) => setTaskXp(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-brand-border/40">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="bg-gray-100 border border-brand-border text-gray-600 hover:text-gray-800 px-4 py-2 rounded font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white px-5 py-2 rounded font-semibold cursor-pointer shadow-md shadow-brand-primary/10"
                >
                  Assign Module
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIALOG MODAL: ENROLL STUDENT (Admin Only) */}
      {/* ======================================================== */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-brand-border rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-brand-border/40 bg-gray-50 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-800 tracking-wide uppercase">Enroll New Student Registry</span>
              <button 
                onClick={() => setShowStudentModal(false)}
                className="text-gray-500 hover:text-brand-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-500 font-semibold">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Neil Sengupta"
                  className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-500 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="neil.sengupta@student.com"
                  className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-500 font-semibold">Batch Assignment</label>
                  <select
                    value={studentBatch}
                    onChange={(e) => setStudentBatch(e.target.value)}
                    className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="Batch A - JEE 2026">JEE Batch A</option>
                    <option value="Batch B - NEET 2026">NEET Batch B</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 font-semibold">Initial Attendance %</label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    value={studentAttendance}
                    onChange={(e) => setStudentAttendance(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-brand-border/40">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="bg-gray-100 border border-brand-border text-gray-600 hover:text-gray-800 px-4 py-2 rounded font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white px-5 py-2 rounded font-semibold cursor-pointer shadow-md shadow-brand-primary/10"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIALOG MODAL: ENROLL TEACHER (Admin Only) */}
      {/* ======================================================== */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-brand-border rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-brand-border/40 bg-gray-50 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-800 tracking-wide uppercase">Enroll New Faculty Registry</span>
              <button 
                onClick={() => setShowTeacherModal(false)}
                className="text-gray-500 hover:text-brand-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTeacherSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-500 font-semibold">Teacher Full Name</label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Kumar"
                  className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-500 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  placeholder="ramesh.kumar@growcus.com"
                  className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-500 font-semibold">Subject Specialization</label>
                <select
                  value={teacherSubject}
                  onChange={(e) => setTeacherSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 outline-none cursor-pointer"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-brand-border/40">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="bg-gray-100 border border-brand-border text-gray-600 hover:text-gray-800 px-4 py-2 rounded font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white px-5 py-2 rounded font-semibold cursor-pointer shadow-md shadow-brand-primary/10"
                >
                  Enroll Faculty
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIALOG MODAL: UPDATE STUDENT METRICS (Teacher/Admin) */}
      {/* ======================================================== */}
      {showEditModal && selectedStudentForEdit && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-brand-border rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-brand-border/40 bg-gray-50 flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-gray-800 tracking-wide uppercase block">Update Academic Metrics</span>
                <span className="text-[10px] text-gray-500 font-light block mt-0.5">Editing: {selectedStudentForEdit.name}</span>
              </div>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedStudentForEdit(null);
                }}
                className="text-gray-500 hover:text-brand-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditStudentSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-500 font-semibold">Attendance Percentage (%)</label>
                <input
                  type="number"
                  max={100}
                  min={0}
                  required
                  value={editAttendance}
                  onChange={(e) => setEditAttendance(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-500 font-semibold">Academic Score / Marks (%)</label>
                <input
                  type="number"
                  max={100}
                  min={0}
                  required
                  value={editMarks}
                  onChange={(e) => setEditMarks(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-brand-border focus:border-brand-primary rounded px-3 py-2 text-gray-800 outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-brand-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStudentForEdit(null);
                  }}
                  className="bg-gray-100 border border-brand-border text-gray-600 hover:text-gray-800 px-4 py-2 rounded font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white px-5 py-2 rounded font-semibold cursor-pointer shadow-md shadow-brand-primary/10"
                >
                  Save Metrics
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
