// 核心数据类型定义

// 知识节点类型
export interface KnowledgeNode {
  id: string;
  title: string;
  content: string;
  type: 'markdown' | 'pdf' | 'mindmap' | 'note';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  children?: KnowledgeNode[];
  position: {
    x: number;
    y: number;
    z: number; // 知识深度
  };
  metadata: {
    wordCount: number;
    readingTime: number;
    difficulty: number; // 0-100
    mastery: number; // 掌握度 0-100
    connections: string[]; // 关联节点ID
  };
}

// 学习记录类型
export interface LearningRecord {
  id: string;
  nodeId: string;
  action: 'create' | 'read' | 'edit' | 'review';
  duration: number; // 分钟
  timestamp: Date;
  date: Date;
  topic: string;
  type: string;
  content?: string;
  focusLevel: number; // 专注度 0-100
  interruptions: number;
  notes?: string;
}

// 技能类型
export interface Skill {
  id: string;
  name: string;
  category?: string;
  level: number; // 0-100
  progress: number; // 0-100
  experience: number;
  lastPracticed: Date;
  relatedNodes: string[];
  color: string;
}

// 成就类型
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'learning' | 'consistency' | 'milestone' | 'social';
  unlockedAt?: Date;
  progress: number; // 0-100
  requirements: {
    type: string;
    target: number;
    current: number;
  }[];
}

// 用户配置类型
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  email?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  joinedAt: Date;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    autoSave: boolean;
    visualEffects: boolean;
  };
  stats: {
    totalNodes: number;
    totalLearningTime: number;
    streakDays: number;
    skillsCount: number;
    achievementsCount: number;
  };
}

// 3D坐标类型
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface NodeConnection {
  source: string;
  target: string;
  strength: number; // 连接强度 0-1
  type: 'reference' | 'similarity' | 'sequence' | 'dependency';
}

// 搜索结果类型
export interface SearchResult {
  node: KnowledgeNode;
  score: number;
  highlights: string[];
  context: string;
}

// 学习统计类型
export interface LearningStats {
  daily: {
    date: string;
    duration: number;
    nodesCreated: number;
    nodesReviewed: number;
    focusScore: number;
  }[];
  weekly: {
    week: string;
    totalTime: number;
    avgFocus: number;
    skillsImproved: string[];
  }[];
  monthly: {
    month: string;
    achievements: Achievement[];
    topSkills: Skill[];
    knowledgeGrowth: number;
  }[];
}

// 导航项类型
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  children?: NavigationItem[];
}

// 文件上传类型
export interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  url?: string;
  extractedContent?: string;
  error?: string;
}

// 主题配置类型
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 过滤选项类型
export interface FilterOptions {
  tags?: string[];
  type?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  difficulty?: {
    min: number;
    max: number;
  };
  mastery?: {
    min: number;
    max: number;
  };
}