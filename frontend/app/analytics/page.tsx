'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });

  const [weeklyData] = useState([
    { day: 'Mon', completed: 3, created: 4 },
    { day: 'Tue', completed: 5, created: 2 },
    { day: 'Wed', completed: 2, created: 6 },
    { day: 'Thu', completed: 7, created: 3 },
    { day: 'Fri', completed: 4, created: 5 },
    { day: 'Sat', completed: 1, created: 1 },
    { day: 'Sun', completed: 2, created: 0 },
  ]);

  const loadStats = () => {
    // Load tasks from localStorage for stats
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    
    setStats({
      total: tasks.length,
      completed: tasks.filter((t: { status: string }) => t.status === 'completed').length,
      pending: tasks.filter((t: { status: string }) => t.status === 'pending').length,
      inProgress: tasks.filter((t: { status: string }) => t.status === 'in-progress').length,
      highPriority: tasks.filter((t: { priority: string }) => t.priority === 'high').length,
      mediumPriority: tasks.filter((t: { priority: string }) => t.priority === 'medium').length,
      lowPriority: tasks.filter((t: { priority: string }) => t.priority === 'low').length,
    });
  };

  useEffect(() => {
    loadStats();
    
    // Refresh stats when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadStats();
      }
    };
    
    // Listen for storage changes (when tasks are updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mockTasks') {
        loadStats();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const maxWeeklyValue = Math.max(...weeklyData.map(d => Math.max(d.completed, d.created)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-white/60">Track your productivity and task completion metrics</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-green-400 text-sm">+12%</span>
            </div>
            <h3 className="text-white/60 text-sm mb-1">Total Tasks</h3>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-green-400 text-sm">+8%</span>
            </div>
            <h3 className="text-white/60 text-sm mb-1">Completed</h3>
            <p className="text-3xl font-bold text-white">{stats.completed}</p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-yellow-400 text-sm">{stats.inProgress}</span>
            </div>
            <h3 className="text-white/60 text-sm mb-1">In Progress</h3>
            <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-purple-400 text-sm">{completionRate}%</span>
            </div>
            <h3 className="text-white/60 text-sm mb-1">Completion Rate</h3>
            <p className="text-3xl font-bold text-white">{completionRate}%</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-6">Weekly Activity</h3>
            <div className="flex items-end justify-between h-48 gap-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 h-40 items-end">
                    <div 
                      className="flex-1 bg-purple-500/60 rounded-t transition-all"
                      style={{ height: `${(day.completed / maxWeeklyValue) * 100}%` }}
                    ></div>
                    <div 
                      className="flex-1 bg-blue-500/60 rounded-t transition-all"
                      style={{ height: `${(day.created / maxWeeklyValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white/50 text-xs">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500/60 rounded"></div>
                <span className="text-white/60 text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500/60 rounded"></div>
                <span className="text-white/60 text-sm">Created</span>
              </div>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-6">Priority Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">High Priority</span>
                  <span className="text-red-400">{stats.highPriority} tasks</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Medium Priority</span>
                  <span className="text-yellow-400">{stats.mediumPriority} tasks</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.mediumPriority / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Low Priority</span>
                  <span className="text-green-400">{stats.lowPriority} tasks</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.lowPriority / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="flex items-center justify-center mt-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/10"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${completionRate * 3.52} 352`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{completionRate}%</span>
                  <span className="text-white/50 text-xs">Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-6">Task Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-yellow-400 mb-2">{stats.pending}</p>
              <p className="text-white/60">Pending Tasks</p>
            </div>

            <div className="text-center p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-blue-400 mb-2">{stats.inProgress}</p>
              <p className="text-white/60">In Progress</p>
            </div>

            <div className="text-center p-6 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-green-400 mb-2">{stats.completed}</p>
              <p className="text-white/60">Completed</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
