'use client';

// Simplified background - static, no animations to reduce visual noise
export default function Background() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Static Gradient Background - soft and calm */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 50% at 20% 30%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 40% at 80% 70%, rgba(14, 165, 233, 0.04) 0%, transparent 50%)
                    `,
                }}
            />

            {/* Subtle Grid Pattern */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(148, 163, 184, 0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(148, 163, 184, 0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />
        </div>
    );
}
