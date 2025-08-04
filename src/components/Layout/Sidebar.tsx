import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  Sparkles,
  User,
  Settings,
  BookOpen,
  Target,
  Award,
  Clock,
  Zap,
} from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user, visualEffects } = useAppStore()

  const navigationItems = [
    {
      id: 'knowledge',
      label: '知识星图',
      icon: Brain,
      path: '/knowledge',
      description: '3D知识图谱可视化',
    },
    {
      id: 'learning',
      label: '学习轨迹',
      icon: TrendingUp,
      path: '/learning',
      description: '学习历程与统计分析',
    },
    {
      id: 'creator',
      label: '创客空间',
      icon: Sparkles,
      path: '/creator',
      description: '内容创作与管理',
    },
    {
      id: 'profile',
      label: '数字分身',
      icon: User,
      path: '/profile',
      description: '个人档案与成就',
    },
  ]

  const quickStats = [
    {
      icon: BookOpen,
      label: '知识节点',
      value: user?.stats.totalNodes || 0,
      color: 'text-knowledge-400',
    },
    {
      icon: Clock,
      label: '学习时长',
      value: `${Math.floor((user?.stats.totalLearningTime || 0) / 3600)}h`,
      color: 'text-trajectory-400',
    },
    {
      icon: Target,
      label: '连续天数',
      value: user?.stats.streakDays || 0,
      color: 'text-achievement-400',
    },
    {
      icon: Award,
      label: '成就数量',
      value: user?.stats.achievementsCount || 0,
      color: 'text-green-400',
    },
  ]

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  return (
    <div className="h-full w-80 glass-heavy border-r border-white/20 flex flex-col">
      {/* Logo 区域 */}
      <div className="p-6 border-b border-white/10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-knowledge-500 to-trajectory-500 rounded-xl flex items-center justify-center neural-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {visualEffects && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-knowledge-500 to-trajectory-500 rounded-xl opacity-30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">知识星图</h1>
            <p className="text-sm text-white/60">现代化学习系统</p>
          </div>
        </motion.div>
      </div>

      {/* 用户信息 */}
      {user && (
        <div className="p-4 border-b border-white/10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl glass hover:glass-heavy transition-all duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{user.name}</p>
              <p className="text-sm text-white/60 truncate">{user.bio}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
            主导航
          </h3>
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <motion.div
                key={item.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <Link
                  to={item.path}
                  className={`nav-item group relative ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {isActive && visualEffects && (
                      <motion.div
                        className="absolute inset-0 bg-knowledge-500/30 rounded-lg"
                        layoutId="activeNavItem"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div
                      className="w-2 h-2 bg-knowledge-500 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* 快速统计 */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
            快速统计
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  className="glass rounded-xl p-3 hover:glass-heavy transition-all duration-300 group"
                >
                  <Icon className={`w-4 h-4 ${stat.color} mb-2`} />
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </nav>

      {/* 底部设置 */}
      <div className="p-4 border-t border-white/10">
        <Link
          to="/settings"
          className={`nav-item ${
            location.pathname === '/settings' ? 'active' : ''
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>设置</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar