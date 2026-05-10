import React, { useState, useEffect } from 'react';

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Phases: 
        // 0 - Writing "Fya"
        // 1 - Fade in subtext
        // 2 - Fade out whole screen
        const t0 = setTimeout(() => setPhase(1), 1800);
        const t1 = setTimeout(() => setPhase(2), 3500);
        const t2 = setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, 4500);

        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-[var(--color-bg-secondary)] flex items-center justify-center transition-opacity duration-1000 ${phase === 2 ? 'opacity-0' : 'opacity-100'}`}>
            <style>{`
                .cursive-reveal {
                    font-family: 'Alex Brush', cursive;
                    font-size: clamp(6rem, 15vw, 12rem);
                    color: #212121;
                    position: relative;
                    display: inline-block;
                }
                .cursive-reveal::after {
                    content: '';
                    position: absolute;
                    top: -10%;
                    right: 0;
                    bottom: -10%;
                    width: 100%;
                    background-color: #EBE7E0;
                    animation: revealText 2s ease-in-out forwards;
                }
                @keyframes revealText {
                    0% { width: 100%; }
                    100% { width: 0%; }
                }
            `}</style>

            <div className="flex flex-col items-center">
                {/* Handwritten Cursive "Fya" */}
                <div className="cursive-reveal pr-4 pl-2 leading-none">
                    Fya
                </div>

                <span className={`font-serif tracking-wider text-[var(--color-text)] uppercase text-[10px] md:text-xs transition-opacity duration-1000 mt-2 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    Fancy, Young & Admired
                </span>
            </div>
        </div>
    );
};

export default IntroAnimation;
