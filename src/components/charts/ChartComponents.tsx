'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    RadialBarChart,
    RadialBar
} from 'recharts';

// Types
interface RealTimeDataPoint {
    time: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightLevel: number;
}

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    badge?: string;
}

// Chart Card Wrapper
export const ChartCard = ({ title, children, icon, badge }: ChartCardProps) => (
    <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                {icon}
                {title}
            </h3>
            {badge && <span className="badge badge-neutral">{badge}</span>}
        </div>
        {children}
    </motion.div>
);

// Color Palette
export const CHART_COLORS = {
    primary: '#10B981',    // Emerald
    secondary: '#0EA5E9',  // Sky Blue
    tertiary: '#6366F1',   // Indigo
    quaternary: '#F59E0B', // Amber
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    muted: '#64748B'
};

// Custom Tooltip Style
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg p-3 shadow-lg">
            <p className="text-xs text-[var(--text-muted)] mb-2">{label}</p>
            {payload.map((entry: any, index: number) => (
                <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                    {entry.name}: {entry.value}{entry.unit || ''}
                </p>
            ))}
        </div>
    );
};

// Real-time Line Chart Component
export const RealTimeLineChart = () => {
    const [data, setData] = useState<RealTimeDataPoint[]>([]);

    useEffect(() => {
        // Initialize with some data
        const initialData = Array.from({ length: 20 }, (_, i) => ({
            time: `${String(i).padStart(2, '0')}:00`,
            temperature: 22 + Math.random() * 6,
            humidity: 60 + Math.random() * 20,
            soilMoisture: 35 + Math.random() * 25,
            lightLevel: 600 + Math.random() * 400
        }));
        setData(initialData);

        // Real-time update simulation
        const interval = setInterval(() => {
            setData(prev => {
                const newPoint: RealTimeDataPoint = {
                    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                    temperature: 22 + Math.random() * 6,
                    humidity: 60 + Math.random() * 20,
                    soilMoisture: 35 + Math.random() * 25,
                    lightLevel: 600 + Math.random() * 400
                };
                return [...prev.slice(1), newPoint];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis
                    dataKey="time"
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                />
                <YAxis
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    iconType="circle"
                />
                <Line
                    type="monotone"
                    dataKey="temperature"
                    name="온도 (°C)"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line
                    type="monotone"
                    dataKey="humidity"
                    name="습도 (%)"
                    stroke={CHART_COLORS.secondary}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

// Area Chart for Predictions
interface PredictionData {
    month: string;
    actual: number;
    predicted: number;
}

export const PredictionAreaChart = () => {
    const data: PredictionData[] = [
        { month: '1월', actual: 2400, predicted: 2500 },
        { month: '2월', actual: 2210, predicted: 2300 },
        { month: '3월', actual: 2800, predicted: 2750 },
        { month: '4월', actual: 2080, predicted: 2200 },
        { month: '5월', actual: 2890, predicted: 2800 },
        { month: '6월', actual: 3390, predicted: 3400 },
        { month: '7월', actual: 3490, predicted: 3600 }
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis
                    dataKey="month"
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                />
                <YAxis
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Area
                    type="monotone"
                    dataKey="actual"
                    name="실제 수확량"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorActual)"
                />
                <Area
                    type="monotone"
                    dataKey="predicted"
                    name="예측 수확량"
                    stroke={CHART_COLORS.secondary}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorPredicted)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

// Crop Distribution Pie Chart
export const CropDistributionChart = () => {
    const data = [
        { name: '토마토', value: 35, color: '#EF4444' },
        { name: '상추', value: 25, color: '#22C55E' },
        { name: '오이', value: 20, color: '#10B981' },
        { name: '딸기', value: 12, color: '#EC4899' },
        { name: '파프리카', value: 8, color: '#F59E0B' }
    ];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

// Sensor Health Radial Bar Chart
export const SensorHealthChart = () => {
    const data = [
        { name: '온도', health: 94, fill: CHART_COLORS.primary },
        { name: '습도', health: 99, fill: CHART_COLORS.secondary },
        { name: '토양', health: 87, fill: CHART_COLORS.tertiary },
        { name: 'CO₂', health: 91, fill: CHART_COLORS.quaternary }
    ];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                barSize={15}
                data={data}
                startAngle={180}
                endAngle={0}
            >
                <RadialBar
                    background={{ fill: 'rgba(148,163,184,0.1)' }}
                    dataKey="health"
                    cornerRadius={10}
                />
                <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                />
                <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
        </ResponsiveContainer>
    );
};

// Weekly Performance Bar Chart
export const WeeklyPerformanceChart = () => {
    const data = [
        { day: '월', yield: 245, efficiency: 92 },
        { day: '화', yield: 268, efficiency: 94 },
        { day: '수', yield: 312, efficiency: 97 },
        { day: '목', yield: 289, efficiency: 91 },
        { day: '금', yield: 356, efficiency: 98 },
        { day: '토', yield: 298, efficiency: 95 },
        { day: '일', yield: 320, efficiency: 93 }
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis
                    dataKey="day"
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                />
                <YAxis
                    yAxisId="left"
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[80, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Bar
                    yAxisId="left"
                    dataKey="yield"
                    name="수확량 (kg)"
                    fill={CHART_COLORS.primary}
                    radius={[4, 4, 0, 0]}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="efficiency"
                    name="효율 (%)"
                    stroke={CHART_COLORS.secondary}
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2 }}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

// Sensor Trend Mini Chart
interface MiniChartProps {
    data: number[];
    color: string;
}

export const SensorMiniChart = ({ data, color }: MiniChartProps) => {
    const chartData = data.map((value, index) => ({ value, index }));

    return (
        <ResponsiveContainer width="100%" height={40}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                    <linearGradient id={`miniGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#miniGradient-${color})`}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

// Export all components
export default {
    RealTimeLineChart,
    PredictionAreaChart,
    CropDistributionChart,
    SensorHealthChart,
    WeeklyPerformanceChart,
    SensorMiniChart,
    ChartCard,
    CHART_COLORS
};
