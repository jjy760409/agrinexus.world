'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    left: string;
    top: string;
    delay: number;
    duration: number;
}

export default function Background() {
    const particlesRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Generate particles only on client side to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        const generatedParticles = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: Math.random() * 10,
            duration: 8 + Math.random() * 8,
        }));
        setParticles(generatedParticles);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Gradient Background */}
            <motion.div
                className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
                style={{
                    background: `
            radial-gradient(ellipse at 20% 20%, rgba(0, 255, 136, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(123, 47, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 60%)
          `,
                }}
                animate={{
                    x: [0, -50, -100, 50, 0],
                    y: [0, -50, 50, -50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Floating Particles - Only render after mount */}
            {isMounted && (
                <div ref={particlesRef} className="absolute inset-0">
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="particle"
                            style={{
                                left: particle.left,
                                top: particle.top,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0.6, 0.3, 0.6],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: particle.duration,
                                delay: particle.delay,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Ambient Light Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[var(--primary-green)]/10 to-transparent blur-[100px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-to-t from-[var(--primary-purple)]/10 to-transparent blur-[80px] rounded-full" />
        </div>
    );
}
