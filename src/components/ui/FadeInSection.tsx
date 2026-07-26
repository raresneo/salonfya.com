import React, { useState, useRef, useEffect } from 'react';

interface FadeInSectionProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, delay = 0, className = '' }) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            });
        }, { threshold: 0, rootMargin: '50px' });

        const currentRef = domRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <div
            className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
            ref={domRef}
        >
            {children}
        </div>
    );
};

export default FadeInSection;
