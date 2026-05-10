import React from 'react';

// Tag component for categories
const Tag = ({ children }: { children?: React.ReactNode }) => (
    <span className="inline-block px-4 py-1 bg-[var(--color-bg-secondary)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-secondary)] font-bold mb-2">
        {children}
    </span>
);

export default Tag;
