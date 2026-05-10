import React, { useRef, useState } from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon = null }: any) => {
    const baseStyle = "group relative px-10 py-5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 rounded-none overflow-hidden outline-none";

    const variants: any = {
        primary: "bg-[var(--color-text)] text-white",
        secondary: "bg-white text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-text)]",
        outline: "bg-transparent border-b border-[var(--color-text)] text-[var(--color-text)] px-0 py-2 gap-2 hover:opacity-50",
        ghost: "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]",
        danger: "bg-white text-red-800 border border-red-100 hover:bg-red-50"
    };

    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || !ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <button
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`${baseStyle} ${variants[variant]} ${className} active-scale`}
            disabled={disabled}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: position.x === 0 ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
            }}
        >
            {/* Sliding Background for Primary */}
            {variant === 'primary' && (
                <span className="absolute inset-0 bg-[#605F5F] transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 z-0"></span>
            )}

            <span
                className="relative z-10 flex items-center gap-3 transition-transform duration-300 pointer-events-none"
                style={{ transform: position.x !== 0 ? `translate(${position.x * 0.3}px, ${position.y * 0.3}px)` : 'none' }}
            >
                {icon && <span className="text-sm">{icon}</span>}
                {children}
            </span>

            {/* Decorative Border for Secondary */}
            {variant === 'secondary' && (
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--color-text)] transition-all duration-700 group-hover:w-full"></span>
            )}
        </button>
    );
};

export default Button;
