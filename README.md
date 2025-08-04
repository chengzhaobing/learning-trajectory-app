# 学习轨迹可视化应用

一个基于React和TypeScript的现代化学习轨迹可视化应用，集成知识图谱、学习热力图、技能雷达图和数据分析功能。

## 功能特性

### 🎯 学习轨迹追踪
- **时间线视图**: 按时间顺序展示学习记录
- **热力图视图**: 可视化学习活跃度和连续性
- **技能雷达图**: 多维度技能水平评估
- **数据分析**: 详细的学习统计和趋势分析

### 🧠 知识图谱
- 3D可视化知识节点关系
- 交互式知识网络探索
- 智能知识推荐
- 学习路径规划

### 🏆 成就系统
- 学习里程碑追踪
- 个性化成就徽章
- 进度可视化
- 激励机制

### 🎨 现代化UI/UX
- Glass-morphism设计风格
- 流畅的动画效果
- 响应式布局
- 深色主题支持

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **3D渲染**: Three.js + React Three Fiber
- **图表**: D3.js + Recharts
- **路由**: React Router
- **数据查询**: TanStack Query

## 快速开始

### 环境要求
- Node.js >= 16
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Background/      # 背景效果组件
│   ├── KnowledgeGraph/  # 知识图谱组件
│   ├── Layout/          # 布局组件
│   ├── LearningTrajectory/ # 学习轨迹组件
│   └── QuantumSearch/   # 搜索组件
├── pages/              # 页面组件
├── services/           # 服务层
├── stores/             # 状态管理
├── types/              # 类型定义
└── utils/              # 工具函数
```

## 主要页面

1. **知识图谱** (`/knowledge`) - 3D知识网络可视化
2. **学习轨迹** (`/learning`) - 学习数据分析和可视化
3. **创作空间** (`/creator`) - 内容创作和管理
4. **数字档案** (`/profile`) - 个人学习档案
5. **设置** (`/settings`) - 应用配置

## 特色功能

### 学习轨迹可视化
- 支持多种时间范围筛选（周/月/季度/年）
- 四种视图模式切换
- 实时数据更新
- 空状态友好提示

### 知识图谱
- 3D节点关系可视化
- 交互式节点操作
- 智能布局算法
- 实时搜索过滤

### 响应式设计
- 移动端适配
- 平板端优化
- 桌面端完整体验

## 开发指南

### 代码规范
- 使用 ESLint + TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 组件采用函数式编程
- 使用 Prettier 格式化代码

### 状态管理
- 使用 Zustand 进行全局状态管理
- 数据持久化到 localStorage
- 支持状态订阅和更新

### 样式系统
- Tailwind CSS 原子化样式
- 自定义主题色彩系统
- Glass-morphism 设计语言
- 响应式断点设计

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 创建 Discussion

---

**注**: 这是一个演示项目，展示了现代化前端开发的最佳实践和技术栈应用。