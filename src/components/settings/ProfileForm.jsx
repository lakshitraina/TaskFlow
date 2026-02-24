
import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ProfileForm = ({ onClose }) => {
    const { profile, updateProfile } = useSettings();
    const [formData, setFormData] = useState({
        name: profile.name,
        email: profile.email,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update initials based on new name
        const initials = formData.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        updateProfile({
            ...formData,
            avatarDetails: { ...profile.avatarDetails, initials }
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />
            <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default ProfileForm;
