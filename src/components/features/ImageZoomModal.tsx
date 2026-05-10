import React, { useState, useRef, useEffect } from 'react';

const ImageZoomModal = ({ isOpen, onClose, imageUrl }: { isOpen: boolean, onClose: () => void, imageUrl: string | null }) => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset position when opening
    useEffect(() => {
        if (isOpen) {
            setPosition({ x: 50, y: 50 });
        }
    }, [isOpen]);

    if (!isOpen || !imageUrl) return null;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setPosition({ x, y });
    };

    return (
        <div
            className="fixed inset-0 z-[150] bg-[var(--color-bg-secondary)] flex items-center justify-center p-0 cursor-zoom-out animate-fadeIn"
            onClick={onClose}
        >
            <div
                ref={containerRef}
                className="relative w-full h-full overflow-hidden bg-white"
                onMouseMove={handleMouseMove}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="w-full h-full cursor-zoom-out"
                    style={{
                        backgroundImage: `url("${imageUrl}")`,
                        backgroundPosition: `${position.x}% ${position.y}%`,
                        backgroundSize: '200%', // Reduced from 250% to prevent pixelation
                        backgroundRepeat: 'no-repeat',
                        transition: 'background-position 0.1s ease-out'
                    }}
                />

                {/* Logo Mask overlay for Alma */}
                {imageUrl.includes('alma') && (
                    <div className="absolute bottom-4 right-4 w-12 h-6 bg-white/95 backdrop-blur-md rounded-full" />
                )}

                <div className="absolute top-10 left-10 pointer-events-none">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-text)]/30">Mod Detalii / Mișcă mouse-ul pentru a explora</span>
                </div>
            </div>

            <button
                onClick={onClose}
                className="absolute top-10 right-10 text-[var(--color-text)] hover:scale-110 transition-transform z-[160] p-4 bg-white/50 backdrop-blur-sm rounded-full"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ImageZoomModal;
