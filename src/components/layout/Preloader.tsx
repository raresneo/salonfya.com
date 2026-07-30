import React, { useEffect, useState } from 'react';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Faster loading simulation or remove artificial delay entirely
        const duration = 500; // 0.5 seconds max display
        const interval = 20;
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            setProgress(Math.min(100, (currentStep / steps) * 100));

            if (currentStep >= steps) {
                clearInterval(timer);
                setIsFadingOut(true);
                // Wait for fade out animation to finish before unmounting
                setTimeout(onComplete, 400);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center transition-all duration-800 ease-in-out
                ${isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}
            `}
        >
            <div className="overflow-hidden">
                <h1
                    className="font-serif italic text-6xl text-[var(--color-text)] tracking-wider translate-y-full animate-revealLogo"
                    style={{ animation: 'revealLogo 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                >
                    Fya
                </h1>
            </div>

            {/* Subtle Progress Line */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-[#E4E1DE] overflow-hidden">
                <div
                    className="h-full bg-[var(--color-text)] transition-all duration-[20ms] ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <style>{`
                @keyframes revealLogo {
                    0% { transform: translateY(100%); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
