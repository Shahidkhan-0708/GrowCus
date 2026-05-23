'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CheckSquare, 
  BarChart3, 
  BrainCircuit, 
  MessageSquareCode, 
  Bell, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // All available tabs with role checks
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
    { id: 'students', name: 'Students', icon: GraduationCap, roles: ['admin', 'teacher'] },
    { id: 'teachers', name: 'Teachers', icon: Users, roles: ['admin'] },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare, roles: ['admin', 'teacher', 'student'] },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, roles: ['admin', 'teacher', 'student'] },
    { id: 'risk', name: 'Risk Intelligence', icon: BrainCircuit, roles: ['admin', 'teacher'] },
    { id: 'aria', name: 'Aria AI', icon: MessageSquareCode, roles: ['admin', 'teacher', 'student'], highlight: true },
    { id: 'notifications', name: 'Notifications', icon: Bell, roles: ['admin', 'teacher', 'student'] },
    { id: 'settings', name: 'Settings', icon: Settings, roles: ['admin', 'teacher', 'student'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside 
      className={`bg-white border-r border-brand-border h-screen flex flex-col justify-between transition-all duration-500 ease-in-out relative z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-brand-border rounded-full p-1 text-gray-400 hover:text-brand-primary cursor-pointer z-30 transition-colors shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div>
        {/* Brand Logo */}
        <div className={`p-6 flex items-center gap-3 border-b border-brand-border/60 ${isCollapsed ? 'justify-center' : ''}`}>
          <img src="/logo.png" alt="Growcus" className="w-8 h-8 rounded-lg shadow-sm object-cover logo-hover" />
          {!isCollapsed && (
            <span className="font-semibold text-lg tracking-tight text-gray-800">
              Grow<span className="text-brand-primary font-bold">cus</span>
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-brand-light text-brand-primary font-medium shadow-sm border-l-2 border-brand-primary' 
                    : item.highlight
                      ? 'text-brand-secondary hover:bg-brand-light/50'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <div className={`relative ${isActive ? 'text-brand-primary' : ''}`}>
                  <Icon size={18} className="shrink-0 transition-transform group-hover:scale-105" />
                  {item.highlight && (
                    <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  )}
                </div>
                
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-16 bg-white border border-brand-border text-gray-800 text-xs px-2.5 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className={`p-4 border-t border-brand-border/60 ${isCollapsed ? 'items-center' : ''}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-8 h-8 rounded-full border border-brand-border object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center text-xs font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            {!isCollapsed && (
              <div className="max-w-[120px]">
                <h4 className="text-xs font-medium text-gray-800 truncate">{user.name}</h4>
                <p className="text-[10px] text-gray-400 capitalize truncate">{user.role}</p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <button 
              onClick={logout}
              className="text-gray-400 hover:text-brand-danger cursor-pointer transition-colors p-1.5 rounded-lg hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
