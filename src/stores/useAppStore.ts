import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { KnowledgeNode, UserProfile, LearningRecord, Skill, Achievement } from '@/types'
import {
  knowledgeApi,
  learningApi,
  userApi,
  fileApi,
  dataApi,
  knowledgeStorage,
  learningStorage,
  userStorage,
  achievementStorage,
  skillStorage,
  settingsStorage,
  fileService,
  analyticsService,
  ServiceError,
  type ServiceResponse,
  type UploadProgress,
  type ImportResult
} from '@/services'

interface AppState {
  // 用户状态
  user: UserProfile | null
  isAuthenticated: boolean
  
  // 知识库状态
  knowledgeNodes: KnowledgeNode[]
  selectedNode: KnowledgeNode | null
  searchQuery: string
  searchResults: KnowledgeNode[]
  
  // 学习记录
  learningRecords: LearningRecord[]
  currentSession: {
    startTime: Date | null
    nodeId: string | null
    focusLevel: number
    interruptions: number
  }
  
  // 技能和成就
  skills: Skill[]
  achievements: Achievement[]
  
  // UI状态
  sidebarCollapsed: boolean
  currentView: 'knowledge' | 'learning' | 'profile' | 'settings'
  theme: 'light' | 'dark' | 'auto'
  visualEffects: boolean
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
    sound: boolean
  }
  
  // 3D可视化状态
  graphView: '2d' | '3d'
  selectedConnections: string[]
  
  // 加载状态
  loading: {
    nodes: boolean
    search: boolean
    upload: boolean
    records: boolean
    skills: boolean
    export: boolean
  }
  
  // 错误状态
  error: string | null
  
  // 上传进度
  uploadProgress: UploadProgress | null
}

interface AppActions {
  // 用户操作
  setUser: (user: UserProfile | null) => void
  login: (user: UserProfile) => Promise<ServiceResponse>
  logout: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<ServiceResponse>
  
  // 知识库操作
  loadKnowledgeNodes: () => Promise<void>
  addKnowledgeNode: (node: Omit<KnowledgeNode, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ServiceResponse>
  updateKnowledgeNode: (id: string, updates: Partial<KnowledgeNode>) => Promise<ServiceResponse>
  deleteKnowledgeNode: (id: string) => Promise<ServiceResponse>
  setSelectedNode: (node: KnowledgeNode | null) => void
  setKnowledgeNodes: (nodes: KnowledgeNode[]) => void
  
  // 搜索操作
  searchKnowledge: (query: string) => Promise<void>
  setSearchQuery: (query: string) => void
  setSearchResults: (results: KnowledgeNode[]) => void
  clearSearch: () => void
  
  // 学习记录操作
  loadLearningRecords: () => Promise<void>
  startLearningSession: (nodeId: string) => void
  endLearningSession: () => Promise<void>
  updateSessionFocus: (focusLevel: number) => void
  addInterruption: () => void
  addLearningRecord: (record: Omit<LearningRecord, 'id'>) => Promise<ServiceResponse>
  
  // 技能和成就操作
  loadSkillsAndAchievements: () => Promise<void>
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<ServiceResponse>
  unlockAchievement: (id: string) => Promise<ServiceResponse>
  
  // 文件操作
  uploadFile: (file: File, onProgress?: (progress: UploadProgress) => void) => Promise<ServiceResponse>
  importKnowledgeNodes: (file: File) => Promise<ImportResult>
  exportData: (type: 'all' | 'knowledge' | 'learning' | 'profile') => Promise<void>
  
  // 分析操作
  generateLearningReport: () => Promise<any>
  getLearningStats: () => Promise<any>
  
  // UI操作
  toggleSidebar: () => void
  setCurrentView: (view: AppState['currentView']) => void
  setTheme: (theme: AppState['theme']) => void
  toggleVisualEffects: () => void
  setVisualEffects: (enabled: boolean) => void
  setNotifications: (notifications: AppState['notifications']) => void
  updateUser: (updates: Partial<UserProfile>) => void
  
  // 3D可视化操作
  setGraphView: (view: '2d' | '3d') => void
  toggleConnection: (connectionId: string) => void
  
  // 加载状态操作
  setLoading: (key: keyof AppState['loading'], value: boolean) => void
  
  // 错误处理
  setError: (error: string | null) => void
  clearError: () => void
  
  // 初始化
  initialize: () => Promise<void>
}

type AppStore = AppState & AppActions

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  
  knowledgeNodes: [],
  selectedNode: null,
  searchQuery: '',
  searchResults: [],
  
  learningRecords: [],
  currentSession: {
    startTime: null,
    nodeId: null,
    focusLevel: 100,
    interruptions: 0,
  },
  
  skills: [],
  achievements: [],
  
  sidebarCollapsed: false,
  currentView: 'knowledge',
  theme: 'dark',
  visualEffects: true,
  notifications: {
    email: true,
    push: true,
    desktop: true,
    sound: true,
  },
  
  graphView: '3d',
  selectedConnections: [],
  
  loading: {
    nodes: false,
    search: false,
    upload: false,
    records: false,
    skills: false,
    export: false,
  },
  
  error: null,
  uploadProgress: null,
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // 用户操作
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        
        login: async (user) => {
          try {
            const response = await userApi.login(user)
            if (response.success) {
              set({ user, isAuthenticated: true })
            }
            return response
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '登录失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage }
          }
        },
        
        logout: async () => {
          try {
            await userApi.logout()
            set({ user: null, isAuthenticated: false })
          } catch (error) {
            console.error('登出失败:', error)
          }
        },
        
        updateUserProfile: async (updates) => {
          try {
            const currentUser = get().user
            if (!currentUser) throw new Error('用户未登录')
            
            const response = await userApi.updateProfile(currentUser.id, updates)
            if (response.success && response.data) {
              set({ user: response.data })
            }
            return response
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '更新失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage }
          }
        },
        
        // 知识库操作
        loadKnowledgeNodes: async () => {
          try {
            set({ loading: { ...get().loading, nodes: true } })
            const response = await knowledgeApi.getNodes()
            if (response.success && response.data) {
              set({ knowledgeNodes: response.data })
            }
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '加载知识节点失败' })
          } finally {
            set({ loading: { ...get().loading, nodes: false } })
          }
        },
        
        addKnowledgeNode: async (nodeData) => {
          try {
            const response = await knowledgeApi.createNode(nodeData)
            if (response.success && response.data) {
              const currentNodes = get().knowledgeNodes
              set({ knowledgeNodes: [...currentNodes, response.data] })
              
              // 更新用户统计
              const user = get().user
              if (user) {
                set({
                  user: {
                    ...user,
                    stats: {
                      ...user.stats,
                      totalNodes: user.stats.totalNodes + 1
                    }
                  }
                })
              }
            }
            return response
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '创建节点失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage }
          }
        },
        
        updateKnowledgeNode: async (id, updates) => {
          try {
            const response = await knowledgeApi.updateNode(id, updates)
            if (response.success && response.data) {
              const currentNodes = get().knowledgeNodes
              const updatedNodes = currentNodes.map(node => 
                node.id === id ? response.data! : node
              )
              set({ knowledgeNodes: updatedNodes })
              
              // 如果更新的是当前选中的节点，也要更新选中状态
              const selectedNode = get().selectedNode
              if (selectedNode && selectedNode.id === id) {
                set({ selectedNode: response.data })
              }
            }
            return response
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '更新节点失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage }
          }
        },
        
        deleteKnowledgeNode: async (id) => {
          try {
            const response = await knowledgeApi.deleteNode(id)
            if (response.success) {
              const currentNodes = get().knowledgeNodes
              const filteredNodes = currentNodes.filter(node => node.id !== id)
              set({ knowledgeNodes: filteredNodes })
              
              // 如果删除的是当前选中的节点，清除选中状态
              const selectedNode = get().selectedNode
              if (selectedNode && selectedNode.id === id) {
                set({ selectedNode: null })
              }
            }
            return response
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '删除节点失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage }
          }
        },
        
        setSelectedNode: (node) => set({ selectedNode: node }),
        setKnowledgeNodes: (nodes) => set({ knowledgeNodes: nodes }),
        
        // 搜索操作
        searchKnowledge: async (query) => {
          try {
            set({ loading: { ...get().loading, search: true } })
            const response = await knowledgeApi.searchNodes(query)
            if (response.success && response.data) {
              set({ searchResults: response.data, searchQuery: query })
            }
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '搜索失败' })
          } finally {
            set({ loading: { ...get().loading, search: false } })
          }
        },
        
        setSearchQuery: (query) => set({ searchQuery: query }),
        setSearchResults: (results) => set({ searchResults: results }),
        clearSearch: () => set({ searchQuery: '', searchResults: [] }),
        
        // 学习记录操作
        loadLearningRecords: async () => {
          try {
            set({ loading: { ...get().loading, records: true } })
            const response = await learningApi.getRecords()
            if (response.success && response.data) {
              set({ learningRecords: response.data })
            }
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '加载学习记录失败' })
          } finally {
            set({ loading: { ...get().loading, records: false } })
          }
        },
        
        startLearningSession: (nodeId) => {
          set({
            currentSession: {
              startTime: new Date(),
              nodeId,
              focusLevel: 100,
              interruptions: 0,
            },
          })
        },
        
        endLearningSession: async () => {
          const session = get().currentSession
          if (!session.startTime || !session.nodeId) return
          
          try {
            const duration = Math.floor((Date.now() - session.startTime.getTime()) / 1000 / 60)
            const record: Omit<LearningRecord, 'id'> = {
              nodeId: session.nodeId,
              action: 'read',
              duration,
              timestamp: new Date(),
              date: new Date(),
              topic: 'Learning Session',
              type: 'session',
              focusLevel: session.focusLevel,
              interruptions: session.interruptions,
            }
            
            const response = await learningApi.addRecord(record)
            if (response.success && response.data) {
              const currentRecords = get().learningRecords
              set({ learningRecords: [...currentRecords, response.data] })
              
              // 更新用户统计
              const user = get().user
              if (user) {
                set({
                  user: {
                    ...user,
                    stats: {
                      ...user.stats,
                      totalLearningTime: user.stats.totalLearningTime + duration * 60
                    }
                  }
                })
              }
            }
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '保存学习记录失败' })
          } finally {
            set({
              currentSession: {
                startTime: null,
                nodeId: null,
                focusLevel: 100,
                interruptions: 0,
              },
            })
          }
        },
        
        updateSessionFocus: (focusLevel) => {
          set({
            currentSession: {
              ...get().currentSession,
              focusLevel,
            },
          })
        },
        
        addInterruption: () => {
          set({
            currentSession: {
              ...get().currentSession,
              interruptions: get().currentSession.interruptions + 1,
            },
          })
        },
        
        addLearningRecord: async (recordData) => {
          try {
            const response = await learningApi.addRecord(recordData)
            if (response.success && response.data) {
              const currentRecords = get().learningRecords
              set({ learningRecords: [...currentRecords, response.data] })
            }
            return response
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '添加学习记录失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage }
          }
        },
        
        // 技能和成就操作
        loadSkillsAndAchievements: async () => {
          try {
            set({ loading: { ...get().loading, skills: true } })
            const [skillsResponse, achievementsResponse] = await Promise.all([
              skillStorage.getAll(),
              achievementStorage.getAll()
            ])
            
            set({ 
              skills: skillsResponse || [],
              achievements: achievementsResponse || []
            })
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '加载技能和成就失败' })
          } finally {
            set({ loading: { ...get().loading, skills: false } })
          }
        },
        
        updateSkill: async (id, updates) => {
          try {
            const currentSkills = get().skills
            const skillIndex = currentSkills.findIndex(skill => skill.id === id)
            if (skillIndex === -1) throw new Error('技能不存在')
            
            const updatedSkill = { ...currentSkills[skillIndex], ...updates }
            await skillStorage.save(id, updatedSkill)
            
            const updatedSkills = [...currentSkills]
            updatedSkills[skillIndex] = updatedSkill
            set({ skills: updatedSkills })
            
            return { success: true, data: updatedSkill }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '更新技能失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage }
          }
        },
        
        unlockAchievement: async (id) => {
          try {
            const currentAchievements = get().achievements
            const achievementIndex = currentAchievements.findIndex(achievement => achievement.id === id)
            if (achievementIndex === -1) throw new Error('成就不存在')
            
            const unlockedAchievement = {
              ...currentAchievements[achievementIndex],
              unlockedAt: new Date(),
              progress: 100
            }
            
            await achievementStorage.save(id, unlockedAchievement)
            
            const updatedAchievements = [...currentAchievements]
            updatedAchievements[achievementIndex] = unlockedAchievement
            set({ achievements: updatedAchievements })
            
            return { success: true, data: unlockedAchievement }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '解锁成就失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage }
          }
        },
        
        // 文件操作
        uploadFile: async (file, onProgress) => {
          try {
            set({ loading: { ...get().loading, upload: true } })
            const response = await fileApi.upload(file, onProgress)
            if (onProgress) {
              set({ uploadProgress: null })
            }
            return response
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '文件上传失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage }
          } finally {
            set({ loading: { ...get().loading, upload: false } })
          }
        },
        
        importKnowledgeNodes: async (file) => {
          try {
            const result = await dataApi.importNodes(file)
            if (result.success && result.nodes) {
              const currentNodes = get().knowledgeNodes
              set({ knowledgeNodes: [...currentNodes, ...result.nodes] })
            }
            return result
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '导入失败'
            set({ error: errorMessage })
            return { success: false, error: errorMessage, nodes: [], errors: [errorMessage] }
          }
        },
        
        exportData: async (type) => {
          try {
            set({ loading: { ...get().loading, export: true } })
            const state = get()
            
            let data: any
            let filename: string
            
            switch (type) {
              case 'knowledge':
                data = state.knowledgeNodes
                filename = 'knowledge-nodes.json'
                break
              case 'learning':
                data = state.learningRecords
                filename = 'learning-records.json'
                break
              case 'profile':
                data = state.user
                filename = 'user-profile.json'
                break
              default:
                data = {
                  user: state.user,
                  knowledgeNodes: state.knowledgeNodes,
                  learningRecords: state.learningRecords,
                  skills: state.skills,
                  achievements: state.achievements
                }
                filename = 'complete-data.json'
            }
            
            await dataApi.exportData(data, filename)
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '导出失败' })
          } finally {
            set({ loading: { ...get().loading, export: false } })
          }
        },
        
        // 分析操作
        generateLearningReport: async () => {
          try {
            const records = get().learningRecords
            return await analyticsService.generateReport(records)
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '生成报告失败' })
            return null
          }
        },
        
        getLearningStats: async () => {
          try {
            const records = get().learningRecords
            return await analyticsService.getStats(records)
          } catch (error) {
            set({ error: error instanceof Error ? error.message : '获取统计失败' })
            return null
          }
        },
        
        // UI操作
        toggleSidebar: () => {
          set({ sidebarCollapsed: !get().sidebarCollapsed })
        },
        
        setCurrentView: (view) => set({ currentView: view }),
        setTheme: (theme) => set({ theme }),
        toggleVisualEffects: () => {
          set({ visualEffects: !get().visualEffects })
        },
        
        setVisualEffects: (enabled) => set({ visualEffects: enabled }),
        
        setNotifications: (notifications) => set({ notifications }),
        
        updateUser: (updates) => {
          const currentUser = get().user
          if (currentUser) {
            set({ user: { ...currentUser, ...updates } })
          }
        },
        
        setGraphView: (view) => set({ graphView: view }),
        
        toggleConnection: (connectionId) => {
          const currentConnections = get().selectedConnections
          const isSelected = currentConnections.includes(connectionId)
          const newConnections = isSelected
            ? currentConnections.filter(id => id !== connectionId)
            : [...currentConnections, connectionId]
          set({ selectedConnections: newConnections })
        },
        
        setLoading: (key, value) => {
          set({
            loading: {
              ...get().loading,
              [key]: value
            }
          })
        },
        
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        
        // 初始化
        initialize: async () => {
          try {
            const state = get()
            
            // 并行加载所有数据
            await Promise.all([
              state.loadKnowledgeNodes(),
              state.loadLearningRecords(),
              state.loadSkillsAndAchievements()
            ])
            
            console.log('应用初始化完成')
          } catch (error) {
            console.error('应用初始化失败:', error)
            set({ error: error instanceof Error ? error.message : '初始化失败' })
          }
        },
      }),
      {
        name: 'modern-blog-store',
        partialize: (state: AppStore) => ({
          user: state.user,
          theme: state.theme,
          visualEffects: state.visualEffects,
          sidebarCollapsed: state.sidebarCollapsed,
          graphView: state.graphView,
        }),
      }
    )
  )
)