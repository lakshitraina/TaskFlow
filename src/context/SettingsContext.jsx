
import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [profile, setProfile] = useState(() => {
        const savedProfile = localStorage.getItem('profile');
        return savedProfile ? JSON.parse(savedProfile) : {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatarDetails: { color: 'bg-blue-600', initials: 'JD' }
        };
    });

    const [preferences, setPreferences] = useState(() => {
        const savedPrefs = localStorage.getItem('preferences');
        return savedPrefs ? JSON.parse(savedPrefs) : {
            notifications: true,
            emailDigest: false
        };
    });

    useEffect(() => {
        localStorage.setItem('profile', JSON.stringify(profile));
    }, [profile]);

    useEffect(() => {
        localStorage.setItem('preferences', JSON.stringify(preferences));
    }, [preferences]);

    const updateProfile = (newProfile) => {
        setProfile(prev => ({ ...prev, ...newProfile }));
        toast.success('Profile updated successfully');
    };

    const updatePreferences = (newPrefs) => {
        setPreferences(prev => ({ ...prev, ...newPrefs }));
        toast.success('Preferences saved');
    };

    return (
        <SettingsContext.Provider value={{ profile, preferences, updateProfile, updatePreferences }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
