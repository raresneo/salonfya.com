import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorText, setCursorText] = useState('');
    const [isMobile, setIsMobile] = useState(true);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Enforce custom cursor only on devices with fine pointers and no touch support
        const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
        const hasTouch = window.matchMedia("(any-pointer: coarse)").matches;

        // If it has fine pointer and DOES NOT have touch (or is explicitly desktop)
        if (hasFinePointer && !hasTouch) {
            setIsMobile(false);
        }

        const moveCursor = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            if (cursorRef.current) {
                // Smooth hardware-accelerated translation
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }

            const target = e.target as HTMLElement;

            // Check if we are hovering over an element that should trigger the expanded cursor
            const interactable = target.closest('a, button, [role="button"], input, select, textarea');
            // Check if we are hovering over an element that specifically requests text inside the cursor
            const customTextEl = target.closest('[data-cursor-text]') as HTMLElement;

            if (customTextEl) {
                setIsHovering(true);
                setCursorText(customTextEl.getAttribute('data-cursor-text') || '');
            } else if (interactable) {
                setIsHovering(true);
                setCursorText('');
            } else {
                setIsHovering(false);
                setCursorText('');
            }
        };

        const handleScroll = () => {
            setIsHovering(false);
            setCursorText('');
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (isMobile) return null;

    return (
        <div
            ref={cursorRef}
            className={`fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center rounded-full transition-[width,height,background-color] duration-300 ease-out
                ${isHovering && !cursorText ? 'w-16 h-16 bg-white/20 backdrop-blur-sm -ml-8 -mt-8' :
                    isHovering && cursorText ? 'w-24 h-24 bg-white text-black -ml-12 -mt-12' :
                        'w-3 h-3 bg-white -ml-[6px] -mt-[6px]'}
            `}
            style={{
                willChange: 'transform',
            }}
        >
            {cursorText && (
                <span className="text-[10px] uppercase tracking-wider font-bold whitespace-nowrap opacity-100 animate-fadeIn">
                    {cursorText}
                </span>
            )}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
