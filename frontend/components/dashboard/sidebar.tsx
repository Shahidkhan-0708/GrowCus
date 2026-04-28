"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/user-context";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CheckSquare,
  AlertTriangle,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  X,
  BookOpen,
  BarChart3,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Navigation items with role-based access
const navigationConfig = {
  student: [
    { name: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "My Progress", href: "/dashboard/progress", icon: BarChart3 },
    { name: "Aria AI Coach", href: "/dashboard/aria", icon: MessageSquare },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ],
  teacher: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Students", href: "/dashboard/students", icon: Users },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Risk Assessment", href: "/dashboard/risk", icon: AlertTriangle },
    { name: "Aria AI", href: "/dashboard/aria", icon: MessageSquare },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Students", href: "/dashboard/students", icon: Users },
    { name: "Teachers", href: "/dashboard/teachers", icon: UserCog },
    { name: "All Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Risk Overview", href: "/dashboard/risk", icon: AlertTriangle },
    { name: "Aria AI", href: "/dashboard/aria", icon: MessageSquare },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ],
};

const roleLabels = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

const roleColors = {
  student: "bg-blue-100 text-blue-700",
  teacher: "bg-green-100 text-green-700",
  admin: "bg-purple-100 text-purple-700",
};

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useUser();

  const navigation = user ? navigationConfig[user.role] : navigationConfig.teacher;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              GrowCus
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Badge */}
        <div className="px-4 py-3 border-b border-border">
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs font-medium", roleColors[user.role])}>
                {roleLabels[user.role]}
              </Badge>
              {user.role === "student" && user.batch && (
                <Badge variant="outline" className="text-xs">
                  {user.batch}
                </Badge>
              )}
            </div>
          ) : null}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-border space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            Log out
          </Button>
        </div>
      </div>
    </aside>
  );
}
