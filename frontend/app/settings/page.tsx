'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';

export default function SettingsPage() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyDigest: true,
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60">Manage your account preferences and notifications</p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400">Settings saved successfully!</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Email Address</p>
                  <p className="text-white/50 text-sm">{user.email || 'Not set'}</p>
                </div>
                <button className="px-4 py-2 text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Password</p>
                  <p className="text-white/50 text-sm">Last changed 30 days ago</p>
                </div>
                <button className="px-4 py-2 text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Update
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-white/50 text-sm">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 text-sm transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-white/50 text-sm">Receive updates via email</p>
                </div>
                <button 
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-white/50 text-sm">Get notified on your browser</p>
                </div>
                <button 
                  onClick={() => handleToggle('pushNotifications')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.pushNotifications ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Task Reminders</p>
                  <p className="text-white/50 text-sm">Get reminded before due dates</p>
                </div>
                <button 
                  onClick={() => handleToggle('taskReminders')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.taskReminders ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.taskReminders ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Weekly Digest</p>
                  <p className="text-white/50 text-sm">Summary of your weekly progress</p>
                </div>
                <button 
                  onClick={() => handleToggle('weeklyDigest')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.weeklyDigest ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.weeklyDigest ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Preferences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <label className="block text-white font-medium mb-2">Theme</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="dark" className="bg-slate-800">Dark</option>
                  <option value="light" className="bg-slate-800">Light</option>
                  <option value="system" className="bg-slate-800">System</option>
                </select>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <label className="block text-white font-medium mb-2">Language</label>
                <select 
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="en" className="bg-slate-800">English</option>
                  <option value="es" className="bg-slate-800">Spanish</option>
                  <option value="fr" className="bg-slate-800">French</option>
                  <option value="de" className="bg-slate-800">German</option>
                </select>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg md:col-span-2">
                <label className="block text-white font-medium mb-2">Timezone</label>
                <select 
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="UTC" className="bg-slate-800">UTC (Coordinated Universal Time)</option>
                  <option value="EST" className="bg-slate-800">EST (Eastern Standard Time)</option>
                  <option value="PST" className="bg-slate-800">PST (Pacific Standard Time)</option>
                  <option value="IST" className="bg-slate-800">IST (Indian Standard Time)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass rounded-xl p-6 border border-red-500/30">
            <h2 className="text-xl font-semibold text-red-400 mb-6 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Danger Zone
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <div>
                  <p className="text-white font-medium">Export Data</p>
                  <p className="text-white/50 text-sm">Download all your data</p>
                </div>
                <button className="px-4 py-2 text-white/70 hover:text-white border border-white/20 rounded-lg hover:bg-white/5 text-sm transition-colors">
                  Export
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <div>
                  <p className="text-white font-medium">Delete Account</p>
                  <p className="text-white/50 text-sm">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 text-sm transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
