'use client';

import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import api, { mockApi, isMockMode } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  createdAt: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      let response;
      if (isMockMode) {
        response = await mockApi.getProfile();
      } else {
        response = await api.get('/user/profile');
      }
      setUser(response.data);
      setFormData({
        name: response.data.name,
        bio: response.data.bio || '',
        avatar: response.data.avatar || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (isMockMode) {
        await mockApi.updateProfile(formData);
      } else {
        await api.put('/user/profile', formData);
      }
      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Navbar />
          <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60">Loading profile...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />
        
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="glass rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <p className="text-white/60 mt-1">Manage your account settings</p>
              </div>
              <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.includes('successfully') ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                <svg className={`w-5 h-5 flex-shrink-0 ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {message.includes('successfully') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span className={message.includes('successfully') ? 'text-green-300' : 'text-red-300'}>{message}</span>
              </div>
            )}

            {!editing ? (
              <div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-white">{user?.name}</p>
                    <p className="text-white/60">{user?.email}</p>
                    <p className="text-sm text-white/40 mt-2 flex items-center justify-center sm:justify-start gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {user?.bio && (
                  <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Bio
                    </h3>
                    <p className="text-white/70">{user.bio}</p>
                  </div>
                )}

                <button
                  onClick={() => setEditing(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="input-dark resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Avatar URL</label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-secondary py-3 px-6"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
