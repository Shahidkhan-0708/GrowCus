// Growcus Academic Intelligence Platform Mock Database

export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  xp?: number;
  level?: number;
  streak?: number;
  completionRate?: number;
  instituteName?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  batch: string;
  avatarUrl: string;
  xp: number;
  level: number;
  streak: number;
  attendance: number;
  completionRate: number;
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  weakSubjects: string[];
  recentScores: { subject: string; score: number; date: string }[];
  phone?: string;
  marks?: number;
  isActive?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  batches: string[];
  studentsCount: number;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  deadline: string;
  xpValue: number;
  studentId: string;
  studentName: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  createdAt: string;
  read: boolean;
}

// Current Logged-In Users Mock (For Role Toggle in UI)
export const mockUsers: Record<UserRole, UserProfile> = {
  admin: {
    id: 'u-admin-1',
    name: 'Administrator',
    email: 'admin@growcus.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  teacher: {
    id: 'u-teacher-1',
    name: 'Faculty Member',
    email: 'teacher@growcus.com',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  student: {
    id: 'u-student-1',
    name: 'Student Account',
    email: 'student@growcus.com',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    xp: 0,
    level: 1,
    streak: 0,
    completionRate: 0,
  },
};

export const mockStudents: Student[] = [];

// Rich Teacher Dataset
export const mockTeachers: Teacher[] = [];

// Tasks Kanban Board Dataset
export const mockTasks: Task[] = [];

// High-End Analytics Charts Datasets
export const performanceTrendData: any[] = [];

export const subjectPerformanceData: any[] = [];

export const riskTrendData: any[] = [];

export const attendanceTrendData: any[] = [];

export const weeklyXPData: any[] = [];

// System-Wide Notifications
export const mockNotifications: Notification[] = [];

// AI Suggested Chat Prompts & Responses
export const ariaChatPrompts = [
  "How can I boost my Physics score?",
  "Review my latest Chemistry mistakes",
  "Generate a 15-min Biology pop quiz",
  "Explain Bernoulli's principle simply",
  "Tell me a science joke to destress!"
];

export const ariaMotivationalQuotes = [
  "Aria's Insight: Don't stress! You're making great progress. Remember: Every master was once a beginner.",
  "Aria's Insight: Take a deep breath! You've got this. Consistency is more important than perfection.",
  "Aria's Insight: Why did the physics teacher break up with the biology teacher? There was no chemistry! Keep smiling and keep studying.",
  "Aria's Insight: Great work so far! Remember to stay hydrated and take short breaks. Your brain needs rest to grow.",
  "Aria's Insight: You're doing amazing! 'Success is the sum of small efforts, repeated day in and day out.'"
];

export const ariaResponses: Record<string, string> = {
  default: `Hello! I am Aria, your AI Academic Coach. I analyze your tasks, attendance, scores, and focus levels to keep you on the fastest path to JEE/NEET success.

Ask me any academic questions, or let me know if you want me to analyze your weak points!`,
  'chemistry kinetics': `**Chemistry Kinetics Reaction Rates Analysis:**
1. **Concept**: Kinetics is all about *how fast* a reaction happens.
2. **Key Equation**: $\\text{Rate} = k[A]^x[B]^y$ where $k$ is the rate constant, and $x, y$ are reaction orders.
3. **Weak Subject Note**: I notice you scored 72% in your last Chemistry test, specifically losing marks on the Arrhenius activation energy graphs.
4. **Aria\'s Recommendation**: Re-watch Batch A\'s lecture on catalysts or try solving 5 multi-step kinetics numericals today. (+50 XP potential)`,
  'physics score': `**Physics Score Boost Action Plan (From 62% to 80%):**
1. **Identify Weakness**: Your Mechanics logs show a drop on Rotational Dynamics (friction coefficients, torque vectors).
2. **Attendance Signal**: You missed 1 Physics tutorial last Thursday. Regular attendance is key to concepts.
3. **Execution Steps**:
   - Master Torque first before Angular Momentum.
   - Dedicate 30 mins to solving Chapter 8 exercises.
   - I can generate a 5-question micro-test for you right now. If you get 4/5, I will reward you with 100 XP!`,
  'calculus roadmap': `**2-Week Intensive Calculus Study Roadmap:**
* **Days 1-4: Limits & Continuity**
  Solve at least 20 L\'Hopital rules and continuity definitions.
* **Days 5-9: Differentiation Applications**
  Focus on Maxima/Minima and Tangent equations. Extremely high weighting in JEE!
* **Days 10-14: Definite Integrals & Areas**
  Practice Area under Curves using integration limits.
  *Reward: Completing this path yields +350 XP!*`,
  'risk level': `**Academic Risk Review:**
Your current risk level is **Low** (15/100).
- *Positives*: Attendance is excellent at 94% and Completion Rate is 88%.
- *Action Item*: Your score in Chemistry Kinetics was a bit low (72%). To maintain low risk, complete the \'Chemistry Kinetics Practical Logbook\' task due soon.`
};
