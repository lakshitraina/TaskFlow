
import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "Productivity is being able to do things that you were never able to do before.", author: "Franz Kafka" }
];

const QuoteWidget = () => {
    const [quote, setQuote] = useState(quotes[0]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Random quote on mount
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    const refreshQuote = () => {
        setIsAnimating(true);
        setTimeout(() => {
            let newQuote;
            do {
                newQuote = quotes[Math.floor(Math.random() * quotes.length)];
            } while (newQuote === quote); // Ensure different quote
            setQuote(newQuote);
            setIsAnimating(false);
        }, 300); // Small delay for animation feel
    };

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={refreshQuote}
                    className={`p-2 rounded-full hover:bg-white/20 transition-all ${isAnimating ? 'animate-spin' : ''}`}
                >
                    <RefreshCw className="w-4 h-4 text-white/80" />
                </button>
            </div>

            <div className="relative z-10">
                <Quote className="w-8 h-8 text-white/30 mb-3" />
                <p className={`text-lg font-medium leading-relaxed mb-3 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                    "{quote.text}"
                </p>
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="h-px bg-white/30 w-8" />
                    <span className="text-sm text-white/80 font-medium">{quote.author}</span>
                </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute top-0 -left-4 w-32 h-32 bg-purple-500/30 rounded-full blur-xl" />
        </div>
    );
};

export default QuoteWidget;
