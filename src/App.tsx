import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// 页面组件
import KnowledgeGraph from '@/pages/KnowledgeGraph';
import LearningTrajectory from '@/pages/LearningTrajectory';
import CreatorSpace from '@/pages/CreatorSpace';
import DigitalProfile from '@/pages/DigitalProfile';
import Settings from '@/pages/Settings';

// 组件
import Sidebar from '@/components/Sidebar';
import Background from '@/components/Background';

// 状态管理
import { useAppStore } from '@/stores/useAppStore';

// 工具
import { initializeMockData } from '@/utils/mockData';

function App() {
  const location = useLocation();
  const {
    theme,
    visualEffects,
    isInitialized,
    error,
    initializeApp,
    clearError
  } = useAppStore();
  
  const [isLoading, setIsLoading] = useState(true);

  // 初始化应用
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        
        // 初始化模拟数据
        await initializeMockData();
        
        // 初始化应用状态
        await initializeApp();
        
        // 模拟加载时间
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('应用初始化失败:', error);
        toast.error('应用初始化失败，请刷新页面重试');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [initializeApp]);

  // 主题切换
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 错误处理
  useEffect(() => {
    if (error) {
      toast.error(error);
      const timer = setTimeout(() => {
        clearError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // 加载状态
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-knowledge-500 animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-lg">正在初始化应用...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error && !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">初始化失败</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 页面动画配置
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.05
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: visualEffects ? 0.5 : 0.1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* 背景效果 */}
      <Background />
      
      {/* 粒子效果 */}
      {visualEffects && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
      
      {/* 主要布局 */}
      <div className="flex h-screen relative z-10">
        {/* 侧边栏 */}
        <Sidebar />
        
        {/* 主内容区域 */}
        <main className="flex-1 ml-80 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              <Routes>
                <Route path="/" element={<Navigate to="/knowledge-graph" replace />} />
                <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
                <Route path="/learning-trajectory" element={<LearningTrajectory />} />
                <Route path="/creator-space" element={<CreatorSpace />} />
                <Route path="/digital-profile" element={<DigitalProfile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;