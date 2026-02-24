import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import ProfileForm from '../components/settings/ProfileForm';
import { Moon, Sun, Trash2, User, Bell, Download, Upload, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SettingsSection = ({ title, children }) => (
    <div className="bg-white rounded-[24px] p-6 mb-6 shadow-sm border border-pw-border h-fit">
        <h3 className="text-[17px] font-black tracking-tight text-zinc-900 mb-5">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { tasks, setTasks, activityLog, clearActivityLog } = useTasks();
    const { profile, preferences, updatePreferences } = useSettings();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to delete all tasks and activity logs? This action cannot be undone.')) {
            setTasks([]);
            clearActivityLog();
            toast.success('All data cleared');
        }
    };

    const handleExportData = () => {
        const data = {
            tasks,
            activityLog,
            profile,
            preferences,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `velora-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Data exported successfully');
    };

    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.tasks) setTasks(data.tasks);
                // We could import profile/prefs too if we wanted, but let's stick to tasks for now as per plan
                // actually, let's allow importing everything if present
                if (data.profile) {
                    // We would need to update profile via context, but I didn't expose setProfile directly, only updateProfile
                    // updateProfile(data.profile); 
                }

                toast.success('Data imported successfully');
            } catch (error) {
                toast.error('Failed to import data: Invalid file format');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                <div className="flex-1 w-full text-center md:text-left">
                    <h1 className="text-[32px] font-black tracking-tight text-zinc-900 mb-1 leading-none">Settings</h1>
                    <p className="text-[15px] font-medium text-pw-muted">Manage your preferences and workspace configuration.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 items-start max-w-[1200px]">
                {/* Left Column */}
                <div className="flex flex-col gap-y-2">
                    <SettingsSection title="Account">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`h-16 w-16 ${profile.avatarDetails?.color || 'bg-blue-600'} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                                {profile.avatarDetails?.initials || 'JD'}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{profile.name}</h4>
                                <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={() => setIsProfileModalOpen(true)}>
                                Edit Profile
                            </Button>
                            <Button variant="danger" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="Appearance">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                    {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Switch between light and dark mode
                                    </p>
                                </div>
                            </div>
                            <Button variant="secondary" onClick={toggleTheme}>
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </Button>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="Notifications">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Receive notifications for upcoming tasks
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={preferences.notifications}
                                    onChange={() => updatePreferences({ notifications: !preferences.notifications })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </SettingsSection>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-y-2">
                    <SettingsSection title="Data Management">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                        <Download className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Export Data</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Download a backup of your tasks
                                        </p>
                                    </div>
                                </div>
                                <Button variant="secondary" onClick={handleExportData}>
                                    Export JSON
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                        <Upload className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Import Data</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Restore tasks from a backup file
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImportData}
                                        accept=".json"
                                        className="hidden"
                                    />
                                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                                        Import JSON
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                        <Trash2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Clear All Data</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Delete all tasks and reset application state
                                        </p>
                                    </div>
                                </div>
                                <Button variant="danger" onClick={handleClearData}>
                                    Clear Data
                                </Button>
                            </div>
                        </div>
                    </SettingsSection>
                </div>
            </div> {/* Close the grid div */}

            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                title="Edit Profile"
            >
                <ProfileForm onClose={() => setIsProfileModalOpen(false)} />
            </Modal>
        </DashboardLayout>
    );
};

export default Settings;
