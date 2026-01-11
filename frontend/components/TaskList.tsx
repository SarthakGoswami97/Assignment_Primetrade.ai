'use client';

import api, { mockApi, isMockMode } from '@/lib/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (task) {
        if (isMockMode) {
          await mockApi.updateTask(taskId, { ...task, status: newStatus });
        } else {
          await api.put(`/tasks/${taskId}`, { ...task, status: newStatus });
        }
        onTaskUpdated();
      }
    } catch (error) {
      console.error('Failed to update task status');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      if (isMockMode) {
        await mockApi.deleteTask(taskId);
      } else {
        await api.delete(`/tasks/${taskId}`);
      }
      onTaskDeleted();
    } catch (error) {
      console.error('Failed to delete task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-600';
      case 'in-progress':
        return 'from-blue-500 to-cyan-600';
      case 'pending':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 glass rounded-xl">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-white/60 text-lg">No tasks yet</p>
        <p className="text-white/40 text-sm mt-1">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div key={task._id} className="card group hover:border-purple-500/30">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getStatusColor(task.status)} flex items-center justify-center flex-shrink-0`}>
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-white/60 text-sm mt-1 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-white/60 px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 sm:items-end">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
              >
                <option value="pending" className="bg-slate-800">Pending</option>
                <option value="in-progress" className="bg-slate-800">In Progress</option>
                <option value="completed" className="bg-slate-800">Completed</option>
              </select>
              <button
                onClick={() => handleDelete(task._id)}
                className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/20 transition-all text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
