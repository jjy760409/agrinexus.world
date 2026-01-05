'use client';

import { useEffect, useRef } from 'react';

export default function NeuralNetwork() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.offsetWidth;
                canvas.height = container.offsetHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        // Neural network configuration
        const layers = [4, 6, 8, 6, 4];
        const nodes: Array<{ x: number; y: number; layer: number; activation: number; pulsePhase: number }> = [];
        const connections: Array<{ from: number; to: number; weight: number; active: boolean }> = [];

        // Create nodes
        const createNodes = () => {
            nodes.length = 0;
            layers.forEach((count, layerIndex) => {
                const layerX = (canvas.width / (layers.length + 1)) * (layerIndex + 1);
                for (let i = 0; i < count; i++) {
                    const nodeY = (canvas.height / (count + 1)) * (i + 1);
                    nodes.push({
                        x: layerX,
                        y: nodeY,
                        layer: layerIndex,
                        activation: Math.random(),
                        pulsePhase: Math.random() * Math.PI * 2,
                    });
                }
            });

            // Create connections
            connections.length = 0;
            let nodeIndex = 0;
            for (let l = 0; l < layers.length - 1; l++) {
                const currentLayerStart = nodeIndex;
                const currentLayerEnd = nodeIndex + layers[l];
                const nextLayerStart = currentLayerEnd;
                const nextLayerEnd = nextLayerStart + layers[l + 1];

                for (let i = currentLayerStart; i < currentLayerEnd; i++) {
                    for (let j = nextLayerStart; j < nextLayerEnd; j++) {
                        connections.push({
                            from: i,
                            to: j,
                            weight: Math.random(),
                            active: false,
                        });
                    }
                }
                nodeIndex = currentLayerEnd;
            }
        };

        createNodes();

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update nodes
            nodes.forEach(node => {
                node.pulsePhase += 0.05;
                node.activation = 0.3 + Math.sin(node.pulsePhase) * 0.3 + Math.random() * 0.4;
            });

            // Draw connections
            connections.forEach(conn => {
                const from = nodes[conn.from];
                const to = nodes[conn.to];

                conn.active = Math.random() > 0.7;

                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);

                if (conn.active) {
                    ctx.strokeStyle = `rgba(0, 255, 136, ${0.3 + conn.weight * 0.5})`;
                    ctx.lineWidth = 2;
                } else {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx.lineWidth = 1;
                }
                ctx.stroke();
            });

            // Draw nodes
            nodes.forEach(node => {
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 12);
                gradient.addColorStop(0, `rgba(0, 255, 136, ${node.activation})`);
                gradient.addColorStop(0.5, `rgba(0, 212, 255, ${node.activation * 0.5})`);
                gradient.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + node.activation * 0.5})`;
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full rounded-xl"
        />
    );
}
