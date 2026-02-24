import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { CheckSquare, Layout, Shield, ArrowRight, Zap } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 rounded-[32px] bg-pw-card border border-pw-border shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pw-pill-bg rounded-full opacity-50 blur-3xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
        <div className="mb-6 bg-pw-pill-bg p-4 w-fit rounded-2xl relative z-10">{icon}</div>
        <h3 className="text-2xl font-black mb-3 tracking-tight text-pw-text relative z-10">{title}</h3>
        <p className="text-[17px] text-pw-muted font-medium leading-relaxed relative z-10">{description}</p>
    </div>
);

const Home = () => {
    return (
        <div className="min-h-screen bg-pw-bg text-pw-text overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-40 px-6 text-center relative max-w-7xl mx-auto">
                {/* Decorative background blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#fbfeff] rounded-[100px] rotate-[-15deg] shadow-[0_4px_48px_rgba(0,0,0,0.02)] border border-pw-border/40 pointer-events-none -z-10"></div>
                <div className="absolute top-0 right-10 w-64 h-64 bg-pw-pill-bg rounded-full blur-3xl opacity-50 pointer-events-none -z-10"></div>
                <div className="absolute bottom-10 left-10 w-72 h-72 bg-pw-pill-bg rounded-full blur-3xl opacity-50 pointer-events-none -z-10"></div>

                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-pw-border shadow-sm mb-12">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pw-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-pw-green"></span>
                    </span>
                    <span className="text-[13px] font-bold tracking-widest uppercase text-pw-muted">TaskFlow v2.0 is Live</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-zinc-900 leading-[1.1] max-w-5xl mx-auto">
                    Manage work with <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pw-green to-[#068f63]">absolute precision.</span>
                </h1>

                <p className="text-xl md:text-2xl text-pw-muted mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                    Experience a radically organized workflow. Track, focus, and dominate your tasks with a platform designed for flow state.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-5">
                    <Link to="/login">
                        <button className="w-full sm:w-auto bg-pw-text text-white px-10 py-5 rounded-full font-bold text-[17px] flex items-center justify-center gap-3 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:-translate-y-1">
                            Start for free <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                    <Link to="/login">
                        <button className="w-full sm:w-auto bg-white border-2 border-pw-border/60 text-pw-text px-10 py-5 rounded-full font-bold text-[17px] flex items-center justify-center gap-3 transition-all hover:bg-pw-pill-bg">
                            View Live Demo
                        </button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 bg-white rounded-t-[80px] border-t border-pw-border relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6">Built for unstoppable teams.</h2>
                        <p className="text-xl text-pw-muted font-medium">Everything you need to orchestrate complex projects without the visual noise.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="h-10 w-10 text-pw-gold" strokeWidth={2.5} />}
                            title="Instant Focus"
                            description="Block distractions instantly with our built-in Pomodoro timer and single-task focus modes."
                        />
                        <FeatureCard
                            icon={<Layout className="h-10 w-10 text-pw-blue" strokeWidth={2.5} />}
                            title="Visual Clarity"
                            description="A stunning masonry dashboard built to give you the perfect bird's eye view instantly."
                        />
                        <FeatureCard
                            icon={<Shield className="h-10 w-10 text-pw-purple" strokeWidth={2.5} />}
                            title="Rock Solid"
                            description="Enterprise-grade architecture ensures your data is instantly synched and incredibly secure."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
