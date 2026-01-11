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
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { currentCluster, currentSystem, initialize, updateAllSystems } = useOSStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initialize();
    setIsLoaded(true);

    // Real-time updates every 5 seconds
    const interval = setInterval(() => {
      updateAllSystems();
    }, 5000);

    return () => clearInterval(interval);
  }, [initialize, updateAllSystems]);

  // Loading State
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-blue)] flex items-center justify-center">
            <Loader2 size={32} className="text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            AgriNexus World OS
          </h1>
          <p className="text-[var(--text-muted)]">
            시스템 초기화 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      {/* Background */}
      <Background />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <OSHeader />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <OSSidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">
              <AnimatePresence mode="wait">
                {/* System Detail View */}
                {currentSystem && (
                  <motion.div
                    key="system-detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SystemDetail system={currentSystem} />
                  </motion.div>
                )}

                {/* Cluster View */}
                {currentCluster && !currentSystem && (
                  <motion.div
                    key={`cluster-${currentCluster}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ClusterView clusterId={currentCluster} />
                  </motion.div>
                )}

                {/* Home Dashboard */}
                {!currentCluster && !currentSystem && (
                  <motion.div
                    key="universe-core"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UniverseCore />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Footer */}
        <OSFooter />
      </div>
    </div>
  );
}
