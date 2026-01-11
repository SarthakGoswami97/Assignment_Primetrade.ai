'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { mockApi } from '@/lib/api';


interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const loadTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    setTasks(storedTasks);
  };

  useEffect(() => {
    loadTasks();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadTasks();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate.split('T')[0] === dateStr;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getWeekDates = () => {
    const dates: Date[] = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      await mockApi.createTask({
        ...newTask,
        dueDate: newTask.dueDate || (selectedDate ? selectedDate.toISOString().split('T')[0] : ''),
      });
      loadTasks();
      setShowAddModal(false);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    
    try {
      await mockApi.updateTask(editingTask._id, editingTask);
      loadTasks();
      setShowEditModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await mockApi.deleteTask(taskId);
      loadTasks();
      setShowEditModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await mockApi.updateTask(taskId, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const openAddModal = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setNewTask(prev => ({ ...prev, dueDate: date.toISOString().split('T')[0] }));
    }
    setShowAddModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask({ ...task });
    setShowEditModal(true);
  };

  // Get overdue tasks count
  const overdueTasks = tasks.filter(t => 
    t.dueDate && 
    new Date(t.dueDate) < new Date() && 
    t.status !== 'completed'
  );

  // Get tasks for this week
  const weekDates = getWeekDates();
  const thisWeekTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    const taskDate = new Date(t.dueDate);
    return taskDate >= weekDates[0] && taskDate <= weekDates[6];
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
            <p className="text-white/60">View and manage your tasks by date</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded text-sm transition-all ${
                  viewMode === 'month' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded text-sm transition-all ${
                  viewMode === 'week' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                Week
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-white/5 text-white/70 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
            >
              Today
            </button>
            <button
              onClick={() => openAddModal()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-xs">This Week</p>
                <p className="text-white font-semibold">{thisWeekTasks.length} tasks</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-xs">Overdue</p>
                <p className="text-white font-semibold">{overdueTasks.length} tasks</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-xs">Pending</p>
                <p className="text-white font-semibold">{tasks.filter(t => t.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-xs">Completed</p>
                <p className="text-white font-semibold">{tasks.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 glass rounded-xl p-6 border border-white/10">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={viewMode === 'month' ? previousMonth : previousWeek}
                className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-white">
                {viewMode === 'month' 
                  ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : `Week of ${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                }
              </h2>
              <button
                onClick={viewMode === 'month' ? nextMonth : nextWeek}
                className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {viewMode === 'month' ? (
              <>
                {/* Day Names */}
                <div className="grid grid-cols-7 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-white/50 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square"></div>
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dayTasks = getTasksForDate(date);
                    
                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        onDoubleClick={() => openAddModal(date)}
                        className={`aspect-square p-1 rounded-lg transition-all relative group cursor-pointer ${
                          isToday(date)
                            ? 'bg-purple-500/30 border border-purple-500'
                            : isSelected(date)
                            ? 'bg-white/10 border border-white/30'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className={`text-sm ${isToday(date) ? 'text-purple-300 font-semibold' : 'text-white/70'}`}>
                          {day}
                        </span>
                        {dayTasks.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            {dayTasks.slice(0, 3).map((task, i) => (
                              <div 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}
                              ></div>
                            ))}
                            {dayTasks.length > 3 && (
                              <span className="text-white/50 text-xs ml-0.5">+{dayTasks.length - 3}</span>
                            )}
                          </div>
                        )}
                        {/* Quick add button on hover */}
                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); openAddModal(date); }}
                            className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-purple-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Week View */
              <div className="space-y-4">
                {weekDates.map((date, index) => {
                  const dayTasks = getTasksForDate(date);
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border transition-all ${
                        isToday(date)
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isToday(date) ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70'
                          }`}>
                            <span className="text-sm font-semibold">{date.getDate()}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{dayNames[date.getDay()]}</p>
                            <p className="text-white/50 text-sm">
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => openAddModal(date)}
                          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      {dayTasks.length > 0 ? (
                        <div className="space-y-2 ml-13">
                          {dayTasks.map(task => (
                            <div 
                              key={task._id}
                              onClick={() => openEditModal(task)}
                              className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                              <span className={`flex-1 text-sm ${task.status === 'completed' ? 'text-white/50 line-through' : 'text-white/90'}`}>
                                {task.title}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs border ${getStatusBadge(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/40 text-sm ml-13">No tasks</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            {viewMode === 'month' && (
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-white/60 text-sm">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-white/60 text-sm">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white/60 text-sm">Low</span>
                </div>
                <span className="text-white/40 text-sm">| Double-click to add task</span>
              </div>
            )}
          </div>

          {/* Selected Date Tasks */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                {selectedDate 
                  ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                  : 'Select a date'}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => openAddModal(selectedDate)}
                  className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
            </div>
            
            {selectedDate ? (
              selectedDateTasks.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateTasks.map(task => (
                    <div 
                      key={task._id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleStatusChange(task._id, task.status === 'completed' ? 'pending' : 'completed')}
                          className={`w-5 h-5 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                            task.status === 'completed'
                              ? 'bg-green-500 border-green-500'
                              : 'border-white/30 hover:border-purple-500'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-white font-medium ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-white/50 text-sm mt-1 truncate">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            <span className="text-white/40 text-xs capitalize">{task.priority}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-1 text-white/40 hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white/50 mb-4">No tasks for this date</p>
                  <button
                    onClick={() => openAddModal(selectedDate)}
                    className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors text-sm"
                  >
                    Add a task
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <p className="text-white/50">Click on a date to view tasks</p>
              </div>
            )}

            {/* Upcoming Deadlines */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-white/70 text-sm font-medium mb-3">Upcoming Deadlines</h4>
              <div className="space-y-2">
                {tasks
                  .filter(t => t.dueDate && new Date(t.dueDate) >= new Date() && t.status !== 'completed')
                  .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                  .slice(0, 5)
                  .map(task => (
                    <div 
                      key={task._id} 
                      onClick={() => openEditModal(task)}
                      className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className="text-white/70 truncate flex-1">{task.title}</span>
                      <span className="text-white/40 text-xs">
                        {new Date(task.dueDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                {tasks.filter(t => t.dueDate && new Date(t.dueDate) >= new Date() && t.status !== 'completed').length === 0 && (
                  <p className="text-white/40 text-sm">No upcoming deadlines</p>
                )}
              </div>
            </div>

            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-red-500/20">
                <h4 className="text-red-400 text-sm font-medium mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Overdue
                </h4>
                <div className="space-y-2">
                  {overdueTasks.slice(0, 3).map(task => (
                    <div 
                      key={task._id}
                      onClick={() => openEditModal(task)}
                      className="flex items-center gap-3 text-sm p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 cursor-pointer transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className="text-white/70 truncate flex-1">{task.title}</span>
                      <span className="text-red-400/70 text-xs">
                        {new Date(task.dueDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl border border-white/10 w-full max-w-md">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Add New Task</h3>
              <p className="text-white/50 text-sm mt-1">
                {selectedDate 
                  ? `For ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                  : 'Create a new task'}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Task title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Task description"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low" className="bg-slate-800">Low</option>
                    <option value="medium" className="bg-slate-800">Medium</option>
                    <option value="high" className="bg-slate-800">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => { setShowAddModal(false); setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' }); }}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={!newTask.title.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl border border-white/10 w-full max-w-md">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Edit Task</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Title *</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="Task title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Description</label>
                <textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Task description"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask(prev => prev ? { ...prev, status: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="pending" className="bg-slate-800">Pending</option>
                    <option value="in-progress" className="bg-slate-800">In Progress</option>
                    <option value="completed" className="bg-slate-800">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask(prev => prev ? { ...prev, priority: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low" className="bg-slate-800">Low</option>
                    <option value="medium" className="bg-slate-800">Medium</option>
                    <option value="high" className="bg-slate-800">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Due Date</label>
                <input
                  type="date"
                  value={editingTask.dueDate?.split('T')[0] || ''}
                  onChange={(e) => setEditingTask(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-between">
              <button
                onClick={() => handleDeleteTask(editingTask._id)}
                className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Delete
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowEditModal(false); setEditingTask(null); }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTask}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}