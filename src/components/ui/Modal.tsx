import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, children, title, fullScreen = false }: any) => {
    // Prevent body scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // prevent pull-to-refresh
            document.body.style.overscrollBehaviorY = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.overscrollBehaviorY = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.overscrollBehaviorY = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-0">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-[var(--color-bg-secondary)]/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Content Container (Bottom Sheet on Mobile, Modal on Desktop) */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                                onClose();
                            }
                        }}
                        className={`
                            relative bg-[var(--color-bg-secondary)] w-full flex flex-col will-change-transform
                            h-[90vh] md:h-auto rounded-t-3xl md:rounded-none
                            ${fullScreen ? 'md:h-full pt-4 md:pt-0' : 'md:max-h-[95vh] md:max-w-7xl pt-4 md:pt-0 border border-[var(--color-border)] md:shadow-[0_40px_100px_rgba(0,0,0,0.1)]'} 
                        `}
                    >
                        {/* Mobile Pull Indicator */}
                        <div className="md:hidden w-full flex justify-center pb-2 cursor-grab active:cursor-grabbing">
                            <div className="w-12 h-1.5 bg-[#E4E1DE] rounded-full"></div>
                        </div>

                        {/* Header */}
                        <div className="px-6 md:px-16 pb-4 pt-2 md:py-10 flex justify-between items-center bg-[var(--color-bg-secondary)] z-20 md:border-b border-[var(--color-border)]">
                            <div className="flex flex-col">
                                <span className="hidden md:block text-[10px] uppercase tracking-wider text-[var(--color-secondary)] font-bold mb-2">Fya Haute Couture</span>
                                <h3 className="font-serif text-3xl md:text-5xl text-[var(--color-text)] italic leading-tight">{title}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="group relative w-10 h-10 md:w-16 md:h-16 flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-text)] transition-all rounded-full active-scale"
                                aria-label="Close"
                            >
                                <span className="absolute inset-0 bg-[var(--color-text)] scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full hidden md:block"></span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="relative z-10 group-hover:text-white group-hover:rotate-90 transition-all duration-500"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Inner Content */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide bg-[var(--color-bg-secondary)] safe-pb">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
