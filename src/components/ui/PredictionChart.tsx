'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function PredictionChart() {
    const data = useMemo(() => {
        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        return months.map((month, i) => ({
            month,
            value: 60 + Math.random() * 30 + i * 2,
            prediction: 65 + Math.random() * 25 + i * 2.5,
        }));
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                    interval={1}
                />
                <YAxis
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
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00ff88"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    name="실제"
                />
                <Area
                    type="monotone"
                    dataKey="prediction"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorPrediction)"
                    name="예측"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
