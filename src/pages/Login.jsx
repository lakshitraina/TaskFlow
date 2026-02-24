import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { CheckSquare } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        loginId: '',
        password: '',
        rememberMe: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (formData.loginId && formData.password) {
            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        loginId: formData.loginId,
                        password: formData.password
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed');
                }

                const userData = await response.json();

                // Save user session
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify(userData));

                toast.success(`Welcome back, ${userData.name}!`);
                navigate('/dashboard');
            } catch (error) {
                toast.error(error.message || 'Please enter valid credentials');
            }
        } else {
            toast.error('Please enter both Login ID and Password');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-pw-bg text-pw-text">
            {/* Left Brand/Visual Side */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden bg-zinc-900 border-r border-pw-border/20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pw-green rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pw-blue rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

                <div className="relative z-10 max-w-lg text-left text-white">
                    <div className="bg-white/5 p-4 rounded-3xl inline-block mb-10 border border-white/10 shadow-2xl backdrop-blur-md">
                        <CheckSquare className="h-12 w-12 text-pw-green" strokeWidth={2.5} />
                    </div>

                    <h1 className="text-5xl font-black tracking-tight mb-6 leading-[1.1]">
                        The missing layer for <br /><span className="text-pw-green">your productivity.</span>
                    </h1>

                    <p className="text-xl text-zinc-400 mb-12 font-medium leading-relaxed max-w-md">
                        Welcome to a sanctuary designed strictly for execution. Track tasks, respect deadlines, and block the noise.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <h3 className="font-bold text-lg mb-1 tracking-tight text-white">Radical Flow</h3>
                            <p className="text-zinc-400 text-[14px] font-medium">Protect your attention.</p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <h3 className="font-bold text-lg mb-1 tracking-tight text-white">Zero Clutter</h3>
                            <p className="text-zinc-400 text-[14px] font-medium">Focus on the execution.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-pw-bg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pw-pill-bg rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-[36px] font-black tracking-tight text-zinc-900 mb-2">Welcome Back</h2>
                        <p className="text-[15px] font-medium text-pw-muted">
                            Don't have an account?{' '}
                            <Link to="#" className="text-pw-blue hover:text-blue-500 font-bold transition-colors">
                                Request Access
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="Login ID"
                            type="text"
                            value={formData.loginId}
                            onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
                            placeholder="username"
                            required
                            className="bg-white border-pw-border/80 shadow-sm rounded-xl py-3 px-4 font-medium"
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="bg-white border-pw-border/80 shadow-sm rounded-xl py-3 px-4 font-medium"
                        />

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center group cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="h-4 w-4 text-pw-green focus:ring-pw-green border-pw-border rounded transition-all cursor-pointer"
                                />
                                <span className="ml-2 text-[14px] font-bold text-pw-muted group-hover:text-pw-text transition-colors">Remember me</span>
                            </label>

                            <Link to="#" className="text-[14px] font-bold text-pw-muted hover:text-pw-text transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-4 text-[16px] font-bold bg-pw-green text-white hover:bg-[#0da672] rounded-2xl shadow-[0_4px_16px_rgba(14,183,129,0.25)] hover:shadow-[0_8px_24px_rgba(14,183,129,0.35)] transition-all transform hover:-translate-y-0.5 mt-4 border-none"
                            isLoading={isLoading}
                        >
                            Sign In to Dashboard
                        </Button>
                    </form>

                    <p className="text-center text-[13px] font-medium text-pw-muted mt-8">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
