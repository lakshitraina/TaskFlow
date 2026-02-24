import React, { useState } from 'react';
import { Menu, Bell, Search, LayoutDashboard, Clock, BarChart2, Users, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const location = useLocation();

    // Fetch user from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.name ? user.name.split(' ')[0] : 'User';
    const seedName = user.name ? user.name.replace(/ /g, '') : 'User';

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 },
        { name: 'Team', path: '/dashboard/team', icon: Users },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-pw-bg text-pw-text flex flex-col font-sans">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 w-full bg-white border-b border-pw-border/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo Area */}
                        <div className="flex items-center gap-3">
                            <Link to="/" className="flex items-center gap-2">
                                <span className="font-serif text-[26px] font-black tracking-[-1px] text-zinc-900">
                                    Task<span className="font-sans font-light text-[15px] align-text-bottom tracking-widest text-pw-muted ml-0.5">FLOW</span>
                                </span>
                            </Link>
                        </div>

                        {/* Center Navigation Pills */}
                        <nav className="hidden lg:flex items-center justify-center gap-1.5 p-1.5 bg-pw-pill-bg rounded-[20px]">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[14px] font-medium transition-all ${isActive
                                            ? 'bg-pw-green text-white shadow-sm'
                                            : 'text-pw-muted hover:text-pw-text hover:bg-white/50'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Area - Profile & Actions */}
                        <div className="flex flex-1 lg:flex-none justify-end items-center gap-4">
                            {/* Profile Pill */}
                            <div className="hidden md:flex items-center gap-3 bg-pw-pill-bg p-1.5 pr-4 rounded-full border border-pw-border/50">
                                <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 border border-white/20 shadow-sm">
                                    <img src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${seedName}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[14px] font-bold text-pw-text leading-tight">{firstName}</span>
                                    <span className="text-[10px] font-bold text-pw-muted tracking-wide uppercase leading-tight">{user.role || 'Premium'}</span>
                                </div>
                            </div>

                            {/* Icons Area */}
                            <div className="flex items-center gap-1.5 border-l border-pw-border pl-4 ml-2">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                        className="p-2.5 text-pw-text hover:bg-pw-pill-bg rounded-full relative transition-colors"
                                    >
                                        <Bell className="h-[18px] w-[18px] stroke-[2px]" />
                                        <span className="absolute top-[8px] right-[8px] h-2 w-2 bg-pw-red rounded-full border-2 border-white"></span>
                                    </button>

                                    {/* Notifications Dropdown (Simplified) */}
                                    {isNotificationsOpen && (
                                        <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-pw-border p-4 z-50">
                                            <h3 className="font-bold text-[15px] text-pw-text mb-3">Notifications</h3>
                                            <div className="text-sm text-pw-muted p-4 text-center bg-pw-bg rounded-xl">No new notifications</div>
                                        </div>
                                    )}
                                </div>
                                <button className="p-2.5 text-pw-text hover:bg-pw-pill-bg rounded-full transition-colors hidden sm:block">
                                    <Search className="h-[18px] w-[18px] stroke-[2px]" />
                                </button>
                            </div>

                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 text-pw-text hover:bg-pw-pill-bg rounded-xl"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
