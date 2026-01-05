'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OSHeader from '@/components/os/OSHeader';
import OSFooter from '@/components/os/OSFooter';
import OSSidebar from '@/components/os/OSSidebar';
import UniverseCore from '@/components/os/UniverseCore';
import ClusterView from '@/components/os/ClusterView';
import SystemDetail from '@/components/os/SystemDetail';
import Background from '@/components/layout/Background';
import { useOSStore } from '@/store/useOSStore';

export default function Home() {
  const { currentCluster, currentSystem, initialize, updateAllSystems, isConnected } = useOSStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initialize();
    setIsLoaded(true);

    // Real-time updates
    const interval = setInterval(() => {
      updateAllSystems();
    }, 3000);

    return () => clearInterval(interval);
  }, [initialize, updateAllSystems]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-32 h-32 mx-auto mb-8 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-[var(--primary-green)]/20" />
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-t-[var(--primary-green)] border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-[var(--primary-cyan)] border-b-transparent border-l-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🌌</span>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text font-[family-name:var(--font-orbitron)] mb-2">
            AgriNexus World OS
          </h1>
          <p className="text-white/60 mb-4">초지능 시스템 초기화 중...</p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/40">
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              UNIVERSE 코어 활성화
            </motion.span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <Background />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* OS Header */}
        <OSHeader />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <OSSidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              {/* System Detail View */}
              {currentSystem && (
                <motion.div
                  key="system-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SystemDetail system={currentSystem} />
                </motion.div>
              )}

              {/* Cluster View */}
              {currentCluster && !currentSystem && (
                <motion.div
                  key={`cluster-${currentCluster}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ClusterView clusterId={currentCluster} />
                </motion.div>
              )}

              {/* Universe Core (Default View) */}
              {!currentCluster && !currentSystem && (
                <motion.div
                  key="universe-core"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <UniverseCore />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* OS Footer */}
        <OSFooter />
      </div>
    </div>
  );
}
