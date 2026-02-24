import React, { useState, useEffect } from 'react';
import { Sun, Sunset, Moon } from 'lucide-react';

const LiveGreeting = ({ userName }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hour = time.getHours();
    let greeting = 'Good Evening';
    let Icon = Moon;
    let iconColor = 'text-pw-purple';
    let bgColor = 'bg-[#f6f0ff]';

    if (hour >= 5 && hour < 12) {
        greeting = 'Good Morning';
        Icon = Sun;
        iconColor = 'text-pw-gold';
        bgColor = 'bg-[#fff7ed]';
    } else if (hour >= 12 && hour < 17) {
        greeting = 'Good Afternoon';
        Icon = Sun;
        iconColor = 'text-pw-blue';
        bgColor = 'bg-[#eef4ff]';
    } else if (hour >= 17 && hour < 20) {
        greeting = 'Good Evening';
        Icon = Sunset;
        iconColor = 'text-pw-red';
        bgColor = 'bg-[#fdeeee]';
    }

    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="bg-pw-card p-6 rounded-[32px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-pw-border/50 relative overflow-hidden flex flex-col justify-center min-h-[160px]">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Icon className={`w-32 h-32 ${iconColor} transform translate-x-8 -translate-y-8`} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2.5 rounded-2xl ${bgColor}`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-pw-muted tracking-widest uppercase">{dateString}</p>
                    </div>
                </div>

                <h2 className="text-[28px] font-black tracking-tight text-pw-text leading-tight mt-1">
                    {greeting},
                    <br />
                    {userName}
                </h2>

                <div className="mt-4 inline-block bg-pw-pill-bg px-4 py-1.5 rounded-full border border-pw-border">
                    <span className="text-[15px] font-bold text-pw-text flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${iconColor.replace('text-', 'bg-')}`}></span>
                        {timeString}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LiveGreeting;
