import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { loadProfile, saveProfile } from '../auth/profileStorage';
import { User, Mail, Phone, Briefcase, Building, Edit, Save, X, Loader2 } from 'lucide-react';

type UserProfile = {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  startupStage: 'Idea' | 'Pre-seed' | 'Seed' | 'Series A' | 'Growth';
  role: string;
  companyName: string;
  joinedDate: string;
  bio: string;
  avatarUrl?: string;
};

const UserProfile: React.FC = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      setIsLoading(false);
      setProfile(null);
      setEditedProfile(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: authUser.token ? { Authorization: `Bearer ${authUser.token}` } : {},
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication expired. Please log in again.');
          }
          throw new Error('Failed to fetch profile.');
        }

        const data: UserProfile = await response.json();
        setProfile(data);
        setEditedProfile(data);
        setAvatarPreview(data.avatarUrl);
        saveProfile(authUser.id, data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error.';
        setError(errorMessage);

        const stored = loadProfile(authUser.id) as UserProfile | null;
        if (stored) {
          setProfile(stored);
          setEditedProfile(stored);
          setAvatarPreview(stored.avatarUrl);
        } else {
          const mockProfile: UserProfile = {
            username: (authUser.name || 'dev_user').toLowerCase().replace(/ /g, '_'),
            fullName: authUser.name || 'Developer',
            email: authUser.email,
            phoneNumber: '+1 (123) 456-7890',
            startupStage: 'Seed',
            role: 'Founder',
            companyName: 'My Startup',
            joinedDate: new Date().toISOString(),
            bio: 'Mock data due to API error. Your edits will be stored locally.',
            avatarUrl: 'https://via.placeholder.com/150',
          };
          setProfile(mockProfile);
          setEditedProfile(mockProfile);
          setAvatarPreview(mockProfile.avatarUrl);
          saveProfile(authUser.id, mockProfile);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authUser, isAuthenticated]);

  // Handle avatar file selection and preview
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      if (editedProfile) {
        setEditedProfile({ ...editedProfile, avatarUrl: url });
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditedProfile(profile);
      setAvatarPreview(profile.avatarUrl);
      setAvatarFile(null);
    }
    setError(null);
  };

  const handleSave = async () => {
    if (!editedProfile || !authUser) {
      setError('Cannot save profile. Missing data.');
      return;
    }
    setIsSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      // If avatarFile exists, upload it first and get URL
      let avatarUrlToSave = editedProfile.avatarUrl;
      if (avatarFile) {
        // Simulate upload - replace with your actual upload logic
        // For example, upload to S3 or backend and get the URL
        // Here we just accept the preview URL (not permanent)
        avatarUrlToSave = avatarPreview;
      }

      const saveData = { ...editedProfile, avatarUrl: avatarUrlToSave };

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authUser.token ? { Authorization: `Bearer ${authUser.token}` } : {}),
        },
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Save failed.' }));
        const localMsg = errorData.message || 'Remote save failed.';
        saveProfile(authUser.id, saveData);
        setProfile(saveData);
        setEditedProfile(saveData);
        setIsEditing(false);
        setSaveMessage(`${localMsg} Changes saved locally.`);
        return;
      }

      const updatedProfile: UserProfile = await response.json();
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      saveProfile(authUser.id, updatedProfile);
      setIsEditing(false);
      setSaveMessage('Profile saved successfully.');
      setAvatarFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error.');
      console.error('Save failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#1c6ed0]" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">An Error Occurred</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile || !editedProfile) {
    return (
      <div className="flex items-center justify-center h-screen text-center bg-gray-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile not loaded</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Header with Avatar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={avatarPreview || 'https://via.placeholder.com/150'}
                alt={`${profile.fullName}'s avatar`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              {isEditing && (
                <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 bg-[#1c6ed0] p-2 rounded-full cursor-pointer border-2 border-white hover:bg-blue-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    id="avatarUpload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="ml-6">
              {isEditing ? (
                <>
                  <input
                    name="fullName"
                    value={editedProfile.fullName}
                    onChange={handleChange}
                    className="text-3xl font-bold text-gray-800 bg-gray-50 border rounded-lg p-2 mb-1 w-full"
                  />
                  <div className="flex items-baseline">
                    <span className="text-gray-500 text-lg mr-1">@</span>
                    <input
                      name="username"
                      value={editedProfile.username}
                      onChange={handleChange}
                      className="text-gray-500 bg-gray-50 border rounded-lg p-1 w-full"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-800">{profile.fullName}</h1>
                  <p className="text-gray-500">@{profile.username}</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 sm:mt-0">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-[#1c6ed0] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <Edit size={18} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {error && isEditing && <p className="text-red-600 text-center mb-4">{error}</p>}
        {saveMessage && !error && <p className="text-green-600 text-center mb-4">{saveMessage}</p>}

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Contact Information</h2>
            <div className="space-y-4">
              <InfoItem icon={<Mail size={20} className="text-gray-400" />} label="Email" value={profile.email} isEditing={false} />
              <InfoItem
                icon={<Phone size={20} className="text-gray-400" />}
                label="Phone Number"
                name="phoneNumber"
                value={editedProfile.phoneNumber}
                isEditing={isEditing}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Professional Details</h2>
            <div className="space-y-4">
              <InfoItem
                icon={<Building size={20} className="text-gray-400" />}
                label="Company"
                name="companyName"
                value={editedProfile.companyName}
                isEditing={isEditing}
                onChange={handleChange}
              />
              <InfoItem
                icon={<Briefcase size={20} className="text-gray-400" />}
                label="Role"
                name="role"
                value={editedProfile.role}
                isEditing={isEditing}
                onChange={handleChange}
              />
              <InfoItem
                icon={<User size={20} className="text-gray-400" />}
                label="Startup Stage"
                name="startupStage"
                value={editedProfile.startupStage}
                isEditing={isEditing}
                onChange={handleChange}
                type="select"
                options={['Idea', 'Pre-seed', 'Seed', 'Series A', 'Growth']}
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">About</h2>
          <div className="mt-4">
            {isEditing ? (
              <textarea
                name="bio"
                value={editedProfile.bio}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#1c6ed0] focus:outline-none"
                rows={4}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Member since: {new Date(profile.joinedDate).toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};


const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: 'text' | 'select';
  options?: string[];
}> = ({ icon, label, value, isEditing, name, onChange, type = 'text', options = [] }) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="ml-4 flex-grow">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {isEditing && name && onChange ? (
          type === 'select' ? (
            <select
              name={name}
              value={value}
              onChange={onChange}
              className="mt-1 w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#1c6ed0] focus:outline-none"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name={name}
              value={value}
              onChange={onChange}
              className="mt-1 w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#1c6ed0] focus:outline-none"
            />
          )
        ) : (
          <p className="text-base font-semibold text-gray-800">{value}</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
