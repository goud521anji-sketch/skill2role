import api from './api';

const PROFILE_KEY = 'userProfile';

const profileService = {
    // Get profile from local storage or backend
    getProfile: () => {
        const localProfile = localStorage.getItem(PROFILE_KEY);
        return localProfile ? JSON.parse(localProfile) : null;
    },

    // Save profile step data
    saveProfileStep: (stepData) => {
        const currentProfile = profileService.getProfile() || {};
        const updatedProfile = { ...currentProfile, ...stepData };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
        return updatedProfile;
    },

    // Check if profile is complete (all required fields present)
    isProfileComplete: () => {
        const profile = profileService.getProfile();
        if (!profile) return false;

        // Check required sections
        const hasEducation = !!profile.education;
        const hasSkills = profile.skills && profile.skills.length > 0;
        const hasCommitment = !!profile.behavioral;

        return hasEducation && hasSkills && hasCommitment;
    },

    // Clear profile (e.g., on logout)
    clearProfile: () => {
        localStorage.removeItem(PROFILE_KEY);
    },

    // Sync with backend (optional for prototype)
    syncProfile: async () => {
        const profile = profileService.getProfile();
        if (profile) {
            try {
                await api.post('/api/user-profile', profile);
            } catch (err) {
                console.warn('Sync failed, using local profile', err);
            }
        }
    }
};

export default profileService;
