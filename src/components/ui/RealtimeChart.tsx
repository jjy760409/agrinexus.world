'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

interface RealtimeChartProps {
    data: number[];
}

export default function RealtimeChart({ data }: RealtimeChartProps) {
    const chartData = useMemo(() => {
        return data.map((value, index) => ({
            time: index,
            value: value,
        }));
    }, [data]);

    const average = useMemo(() => {
        if (data.length === 0) return 0;
        return data.reduce((a, b) => a + b, 0) / data.length;
    }, [data]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00ff88" />
                        <stop offset="50%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#7b2fff" />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={false}
                />
                <YAxis
                    domain={['dataMin - 5', 'dataMax + 5']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(10, 14, 23, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white',
                    }}
                    formatter={(value: unknown) => [`${Number(value).toFixed(1)}°C`, '온도']}
                    labelFormatter={() => ''}
                />
                <ReferenceLine
                    y={average}
                    stroke="rgba(255,255,255,0.2)"
                    strokeDasharray="5 5"
                />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#00d4ff', stroke: '#fff', strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
