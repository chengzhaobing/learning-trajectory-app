import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/stores/useAppStore'

interface ParticleSystemProps {
  count?: number
  size?: number
  speed?: number
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count = 2000, 
  size = 0.8, 
  speed = 0.5 
}) => {
  const ref = useRef<THREE.Points>(null!)
  const { visualEffects } = useAppStore()
  
  // 生成粒子位置
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // 随机分布在球体内
      const radius = Math.random() * 50 + 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // 渐变色彩
      const colorVariant = Math.random()
      if (colorVariant < 0.33) {
        // 知识紫
        colors[i * 3] = 0.49 + Math.random() * 0.2     // R
        colors[i * 3 + 1] = 0.34 + Math.random() * 0.2 // G
        colors[i * 3 + 2] = 0.76 + Math.random() * 0.2 // B
      } else if (colorVariant < 0.66) {
        // 轨迹蓝
        colors[i * 3] = 0.16 + Math.random() * 0.2     // R
        colors[i * 3 + 1] = 0.71 + Math.random() * 0.2 // G
        colors[i * 3 + 2] = 0.96 + Math.random() * 0.1 // B
      } else {
        // 成就金
        colors[i * 3] = 1.0                            // R
        colors[i * 3 + 1] = 0.79 + Math.random() * 0.2 // G
        colors[i * 3 + 2] = 0.16 + Math.random() * 0.2 // B
      }
    }
    
    return [positions, colors]
  }, [count])
  
  // 动画循环
  useFrame((state) => {
    if (!ref.current || !visualEffects) return
    
    const time = state.clock.getElapsedTime()
    const positions = ref.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // 缓慢旋转
      const radius = Math.sqrt(
        positions[i3] * positions[i3] + 
        positions[i3 + 1] * positions[i3 + 1] + 
        positions[i3 + 2] * positions[i3 + 2]
      )
      
      const theta = Math.atan2(positions[i3 + 1], positions[i3]) + speed * 0.001
      const phi = Math.acos(positions[i3 + 2] / radius)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      
      // 添加浮动效果
      positions[i3 + 2] += Math.sin(time * 0.5 + i * 0.01) * 0.02
    }
    
    ref.current.geometry.attributes.position.needsUpdate = true
    
    // 整体旋转
    ref.current.rotation.y = time * 0.05
    ref.current.rotation.x = Math.sin(time * 0.1) * 0.1
  })
  
  if (!visualEffects) return null
  
  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  )
}

const NeuralNetwork: React.FC = () => {
  const ref = useRef<THREE.Group>(null!)
  const { visualEffects } = useAppStore()
  
  const nodes = useMemo(() => {
    const nodePositions = []
    for (let i = 0; i < 50; i++) {
      nodePositions.push({
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40
        ] as [number, number, number],
        connections: Math.floor(Math.random() * 3) + 1
      })
    }
    return nodePositions
  }, [])
  
  useFrame((state) => {
    if (!ref.current || !visualEffects) return
    
    const time = state.clock.getElapsedTime()
    ref.current.rotation.y = time * 0.02
    ref.current.rotation.x = Math.sin(time * 0.05) * 0.05
  })
  
  if (!visualEffects) return null
  
  return (
    <group ref={ref}>
      {nodes.map((node, index) => (
        <mesh key={index} position={node.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color={index % 3 === 0 ? '#7E57C2' : index % 3 === 1 ? '#29B6F6' : '#FFCA28'}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* 连接线 */}
      {nodes.map((node, index) => 
        nodes.slice(index + 1, index + 4).map((targetNode, targetIndex) => {
          const start = new THREE.Vector3(...node.position)
          const end = new THREE.Vector3(...targetNode.position)
          const distance = start.distanceTo(end)
          
          if (distance < 15) {
            const geometry = new THREE.BufferGeometry().setFromPoints([start, end])
            
            return (
              <line key={`${index}-${targetIndex}`}>
                <bufferGeometry attach="geometry" {...geometry} />
                <lineBasicMaterial 
                  attach="material"
                  color="#7E57C2" 
                  transparent 
                  opacity={0.3}
                  linewidth={1}
                />
              </line>
            )
          }
          return null
        })
      )}
    </group>
  )
}

const EnergyField: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null!)
  const { visualEffects } = useAppStore()
  
  useFrame((state) => {
    if (!ref.current || !visualEffects) return
    
    const time = state.clock.getElapsedTime()
    ref.current.rotation.x = time * 0.1
    ref.current.rotation.y = time * 0.15
    ref.current.rotation.z = time * 0.05
    
    // 脉冲效果
    const scale = 1 + Math.sin(time * 2) * 0.1
    ref.current.scale.setScalar(scale)
  })
  
  if (!visualEffects) return null
  
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[8, 1]} />
      <meshBasicMaterial 
        color="#7E57C2"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  )
}

const ParticleBackground: React.FC = () => {
  const { visualEffects } = useAppStore()
  
  if (!visualEffects) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" />
    )
  }
  
  return (
    <div className="fixed inset-0 -z-10">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" />
      
      {/* 3D 粒子场景 */}
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.2} />
        
        {/* 粒子系统 */}
        <ParticleSystem count={1500} size={0.6} speed={0.3} />
        
        {/* 神经网络 */}
        <NeuralNetwork />
        
        {/* 能量场 */}
        <EnergyField />
        
        {/* 雾效 */}
        <fog attach="fog" args={['#1a1a2e', 30, 100]} />
      </Canvas>
      
      {/* CSS 粒子效果（备用） */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>
      
      {/* 光晕效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-knowledge-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-trajectory-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-achievement-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
    </div>
  )
}

export default ParticleBackground