'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Brain, Activity, BarChart3, Settings } from 'lucide-react';

const navItems = [
    { href: '/', label: '홈', icon: Home },
    { href: '/ai', label: 'AI', icon: Brain },
    { href: '/monitoring', label: '모니터링', icon: Activity },
    { href: '/analytics', label: '분석', icon: BarChart3 },
    { href: '#', label: '설정', icon: Settings },
];

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="mobile-bottom-nav">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`mobile-nav-item ${active ? 'active' : ''}`}
                    >
                        <Icon size={22} />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
