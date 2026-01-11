import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Demo credentials for testing (works without backend)
export const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123',
  name: 'Demo User',
};

// Mock user data
const mockUser = {
  _id: 'demo-user-123',
  name: 'Demo User',
  email: 'demo@example.com',
  bio: 'This is a demo account for testing the application.',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=3b82f6&color=fff',
  createdAt: new Date().toISOString(),
};

// Initial mock tasks data
const initialMockTasks = [
  {
    _id: 'task-1',
    title: 'Complete FSD Assignment',
    description: 'Build a full-stack web application with authentication',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-01-15',
    userId: 'demo-user-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'task-2',
    title: 'Review Documentation',
    description: 'Check all README files and API docs',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-01-12',
    userId: 'demo-user-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'task-3',
    title: 'Deploy to Production',
    description: 'Deploy frontend to Vercel and backend to Railway',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-01-20',
    userId: 'demo-user-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to get tasks from localStorage or use initial data
const getMockTasks = () => {
  if (typeof window === 'undefined') return initialMockTasks;
  const stored = localStorage.getItem('mockTasks');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('mockTasks', JSON.stringify(initialMockTasks));
  return initialMockTasks;
};

// Helper to save tasks to localStorage
const saveMockTasks = (tasks: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockTasks', JSON.stringify(tasks));
  }
};

// Check if we should use mock mode (backend not available)
const USE_MOCK = true; // Set to false when backend is running

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock API handlers
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      return {
        data: {
          message: 'Login successful',
          token: 'mock-jwt-token-demo-123',
          user: { id: mockUser._id, name: mockUser.name, email: mockUser.email },
        },
      };
    }
    throw { response: { data: { message: 'Invalid email or password' } } };
  },

  signup: async (name: string, email: string, password: string) => {
    return {
      data: {
        message: 'User registered successfully',
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 'new-user-' + Date.now(), name, email },
      },
    };
  },

  // User
  getProfile: async () => ({ data: mockUser }),
  updateProfile: async (data: any) => {
    Object.assign(mockUser, data);
    return { data: { message: 'Profile updated', user: mockUser } };
  },

  // Tasks
  getTasks: async () => {
    const tasks = getMockTasks();
    return { data: tasks };
  },
  createTask: async (task: any) => {
    const tasks = getMockTasks();
    const newTask = {
      _id: 'task-' + Date.now(),
      ...task,
      status: task.status || 'pending',
      userId: 'demo-user-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    saveMockTasks(tasks);
    return { data: { message: 'Task created', task: newTask } };
  },
  updateTask: async (id: string, data: any) => {
    const tasks = getMockTasks();
    const index = tasks.findIndex((t: any) => t._id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...data, updatedAt: new Date().toISOString() };
      saveMockTasks(tasks);
      return { data: { message: 'Task updated', task: tasks[index] } };
    }
    throw { response: { data: { message: 'Task not found' } } };
  },
  deleteTask: async (id: string) => {
    let tasks = getMockTasks();
    tasks = tasks.filter((t: any) => t._id !== id);
    saveMockTasks(tasks);
    return { data: { message: 'Task deleted' } };
  },
};

// Export mock mode flag
export const isMockMode = USE_MOCK;

export default api;
