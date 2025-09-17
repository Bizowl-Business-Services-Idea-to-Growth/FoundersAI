// Local fallback storage for user profile data (demo mode)
// This allows editing/saving the profile without a backend.

export type StoredProfile = Record<string, any>;

const LS_PROFILE_PREFIX = 'fa_profile_';

export function loadProfile(userId: string): StoredProfile | null {
  try {
    const raw = localStorage.getItem(LS_PROFILE_PREFIX + userId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(userId: string, profile: StoredProfile) {
  try {
    localStorage.setItem(LS_PROFILE_PREFIX + userId, JSON.stringify(profile));
  } catch {
    // ignore write errors
  }
}
