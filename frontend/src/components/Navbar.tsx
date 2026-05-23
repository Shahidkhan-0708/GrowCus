'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Bell, Sparkles, ShieldCheck, BookOpen, User, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNotificationClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onNotificationClick }) => {
  const { currentRole, user, notifications, students, tasks } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Academic Intelligence';
      case 'students': return 'Student Registry';
      case 'teachers': return 'Faculty Hub';
      case 'tasks': return 'Assignment Workspace';
      case 'analytics': return 'Performance Analytics';
      case 'risk': return 'Risk Intelligence AI';
      case 'aria': return 'Aria Academic Mentor';
      case 'notifications': return 'System Alerts';
      case 'settings': return 'Account Settings';
      default: return 'Growcus Platform';
    }
  };

  const roleConfig = {
    admin: { icon: ShieldCheck, label: 'Administrator', color: 'text-brand-primary bg-brand-light border-brand-primary/20' },
    teacher: { icon: BookOpen, label: 'Teacher', color: 'text-brand-primary bg-brand-light border-brand-primary/20' },
    student: { icon: User, label: 'Student', color: 'text-brand-primary bg-brand-light border-brand-primary/20' },
  };
  const rc = roleConfig[currentRole];
  const RoleIcon = rc.icon;

  const unreadNotifs = notifications.filter(n => !n.read);

  // Search results
  const searchResults = searchQuery.trim().length > 1 ? [
    ...students.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4).map(s => ({ type: 'student', label: s.name, sub: s.email, action: () => { setActiveTab('students'); setShowSearch(false); setSearchQuery(''); } })),
    ...tasks.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3).map(t => ({ type: 'task', label: t.title, sub: t.subject, action: () => { setActiveTab('tasks'); setShowSearch(false); setSearchQuery(''); } })),
  ] : [];

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-brand-border/60 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
        {/* Tab Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-gray-800 tracking-tight">{getTitle()}</h1>
          <span className="text-xs bg-brand-light text-brand-primary px-2 py-0.5 rounded border border-brand-primary/15 font-medium">
            v1.2
          </span>
        </div>

        {/* Center: Role Badge (NOT a toggle — role comes from login) */}
        <div className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-full text-xs font-medium select-none ${rc.color}`}>
          <RoleIcon size={12} />
          <span>{rc.label}</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            onClick={() => setShowSearch(true)}
            className="hidden md:flex items-center gap-2 bg-gray-50 border border-brand-border rounded-lg px-3 py-1.5 text-xs text-gray-400 cursor-pointer hover:border-brand-primary/30 hover:bg-brand-light/30 transition-colors max-w-xs"
          >
            <Search size={14} className="text-gray-400" />
            <span className="text-gray-400">Search platform...</span>
            <kbd className="bg-white text-[10px] text-gray-400 border border-brand-border px-1 py-0.5 rounded font-mono ml-4 select-none">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (onNotificationClick) onNotificationClick();
              }}
              className="text-gray-400 hover:text-brand-primary p-2 rounded-lg hover:bg-brand-light/50 cursor-pointer relative transition-colors"
            >
              <Bell size={18} />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-danger animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-brand-border rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-3 border-b border-brand-border bg-gray-50 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-800">Recent Alerts</span>
                  <span className="text-[10px] text-brand-primary bg-brand-light px-1.5 py-0.5 rounded font-medium">
                    {unreadNotifs.length} Unread
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-gray-400">No alerts found</p>
                  ) : (
                    notifications.slice(0, 4).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 border-b border-brand-border/40 hover:bg-brand-light/30 transition-colors ${
                          !notif.read ? 'bg-brand-light/20' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs font-medium text-gray-800 block">{notif.title}</span>
                          <span className="text-[9px] text-gray-400 shrink-0">{notif.createdAt}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveTab('notifications');
                  }}
                  className="w-full text-center py-2 text-xs text-gray-500 hover:text-brand-primary bg-gray-50 border-t border-brand-border hover:bg-brand-light/30 transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>

          {/* XP display for students */}
          {currentRole === 'student' && user.xp && (
            <div className="flex items-center gap-1 bg-brand-light border border-brand-primary/20 px-3 py-1 rounded-full text-xs font-medium text-brand-primary select-none">
              <Sparkles size={12} className="animate-spin-slow" />
              <span>{user.xp} XP</span>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && (
        <div
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4"
          onClick={() => { setShowSearch(false); setSearchQuery(''); }}
        >
          <div
            className="w-full max-w-xl bg-white border border-brand-border rounded-xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-border">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search students, tasks, teachers..."
                className="flex-1 bg-transparent text-gray-800 text-sm placeholder-gray-400 outline-none"
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-gray-400 hover:text-gray-800 cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {searchQuery.trim().length <= 1 && (
                <div className="p-6 text-center text-xs text-gray-400">
                  Type to search students, tasks, and more...
                </div>
              )}
              {searchResults.length === 0 && searchQuery.trim().length > 1 && (
                <div className="p-6 text-center text-xs text-gray-400">
                  No results found for &quot;{searchQuery}&quot;
                </div>
              )}
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={result.action}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-light/30 transition-colors text-left border-b border-brand-border/40 last:border-b-0 cursor-pointer"
                >
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    result.type === 'student' ? 'bg-brand-light text-brand-primary' : 'bg-brand-light text-brand-secondary'
                  }`}>{result.type}</span>
                  <div>
                    <p className="text-xs font-medium text-gray-800">{result.label}</p>
                    <p className="text-[10px] text-gray-400">{result.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
