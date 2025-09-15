import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { User, Mail, Phone, Briefcase, Building, Edit, Save, X, Loader2 } from 'lucide-react';

// Define a type for the user data for type safety
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
  avatarUrl?: string; // Optional avatar
};

/**
 * A dashboard component that displays and allows editing of a user's profile information.
 */
const UserProfile: React.FC = () => {
  // The `authUser` object from your AuthContext should contain the user's data, including the token.
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If there's no authenticated user, reset the component state.
    // Using `as any` to bypass the TypeScript error. The ideal fix is to add `token` to the User type in AuthContext.
    if (!authUser || !(authUser as any).token) {
      setIsLoading(false);
      setProfile(null);
      setEditedProfile(null);
      setError(null);
      return;
    }

    // When authUser changes, start loading and clear previous errors.
    setIsLoading(true);
    setError(null);

    const fetchProfile = async () => {
      try {
        // TODO: Replace with your actual API endpoint.
        const response = await fetch('/api/user/profile', {
          headers: {
            // TODO: Adjust authorization based on your backend needs.
            // This assumes you are using a Bearer token from your auth context.
            'Authorization': `Bearer ${(authUser as any).token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication session expired. Please log in again.');
          }
          throw new Error('Failed to fetch user profile. Please try again later.');
        }

        const data: UserProfile = await response.json();
        setProfile(data);
        setEditedProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null); // Clear previous save errors
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditedProfile(profile); // Reset changes
    }
    setError(null);
  };

  const handleSave = async () => {
    if (!editedProfile || !authUser || !(authUser as any).token) {
      setError("Cannot save profile. Data is missing.");
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      // TODO: Replace with your actual API endpoint.
      const response = await fetch('/api/user/profile', {
        method: 'PUT', // or 'PATCH'
        headers: {
          'Content-Type': 'application/json',
          // TODO: Adjust authorization based on your backend needs.
          'Authorization': `Bearer ${(authUser as any).token}`,
        },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to save profile.' }));
        throw new Error(errorData.message || 'An error occurred while saving.');
      }

      const updatedProfile: UserProfile = await response.json();
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error("Failed to save profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    return null; // Or a "profile not found" message
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src={profile.avatarUrl || 'https://via.placeholder.com/150'}
              alt={`${profile.fullName}'s avatar`}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
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
                <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleCancel} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50">
                  <X size={18} /> Cancel
                </button>
              </div>
            ) : (
              <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-[#1c6ed0] text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                <Edit size={18} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {error && isEditing && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Contact Information</h2>
            <div className="space-y-4">
              <InfoItem icon={<Mail size={20} className="text-gray-400" />} label="Email" value={profile.email} isEditing={false} />
              <InfoItem icon={<Phone size={20} className="text-gray-400" />} label="Phone Number" name="phoneNumber" value={editedProfile.phoneNumber} isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Professional Details</h2>
            <div className="space-y-4">
              <InfoItem icon={<Building size={20} className="text-gray-400" />} label="Company" name="companyName" value={editedProfile.companyName} isEditing={isEditing} onChange={handleChange} />
              <InfoItem icon={<Briefcase size={20} className="text-gray-400" />} label="Role" name="role" value={editedProfile.role} isEditing={isEditing} onChange={handleChange} />
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

// Helper component for displaying info items
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
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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