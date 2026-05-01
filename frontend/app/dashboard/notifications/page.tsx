"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, AlertTriangle, CheckCircle, Info, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Notification {
  id: string;
  type: "alert" | "success" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadNotifications() {
    setIsLoading(true);
    try {
      const json = await apiFetch<{ notifications: Notification[] }>("/api/notifications");
      setNotifications(json.notifications);
    } catch (err) {
      console.error("Notifications fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const markAsRead = async (id: string) => {
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, isRead: true } : notification));
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: "PUT" });
    } catch (err) {
      console.error("Mark notification read error:", err);
      loadNotifications();
    }
  };

  const markAllAsRead = () => {
    notifications.filter((notification) => !notification.isRead).forEach((notification) => markAsRead(notification.id));
  };

  const getIcon = (type: string) => {
    if (type === "alert") return <AlertTriangle className="w-5 h-5 text-destructive" />;
    if (type === "warning") return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    if (type === "success") return <CheckCircle className="w-5 h-5 text-accent" />;
    return <Info className="w-5 h-5 text-primary" />;
  };

  const getTimeAgo = (value: string) => {
    const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-12 w-64" /><Skeleton className="h-80 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Bell className="w-5 h-5 text-primary" /></div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">{unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}</p>
          </div>
        </div>
        {unreadCount > 0 && <Button variant="outline" onClick={markAllAsRead}><Check className="w-4 h-4 mr-2" />Mark all as read</Button>}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg border ${notification.isRead ? "bg-background border-border" : "bg-primary/5 border-primary/20"}`}>
                  <div className="shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{notification.title}</p>
                      {!notification.isRead && <Badge className="text-xs">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{getTimeAgo(notification.timestamp)}</p>
                  </div>
                  {!notification.isRead && <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)} title="Mark as read"><Check className="w-4 h-4" /></Button>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12"><Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No notifications yet</p></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
