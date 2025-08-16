'use client'

import { useEffect, useRef } from 'react'
import styles from './CanvasBackground.module.css'

const CanvasBackground = () => {
  const canvasRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation loop with improved color palette
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Enhanced gradient with brand colors
      const gradient = ctx.createRadialGradient(
        mousePos.current.x,
        mousePos.current.y,
        100,
        mousePos.current.x,
        mousePos.current.y,
        Math.max(canvas.width, canvas.height) * 1.2
      )

      gradient.addColorStop(0, 'rgba(168, 175, 229, 0.15)')
      gradient.addColorStop(0.3, 'rgba(103, 126, 138, 0.12)')
      gradient.addColorStop(0.6, 'rgba(98, 35, 71, 0.08)')
      gradient.addColorStop(1, 'rgba(14, 29, 33, 0.05)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Enhanced particles with smoother animation
      for (let i = 0; i < 120; i++) {
        const time = Date.now() * 0.0003
        const x =
          Math.sin(time + i * 0.5) * canvas.width * 0.3 +
          mousePos.current.x * 0.15 +
          canvas.width / 2
        const y =
          Math.cos(time + i * 0.7) * canvas.height * 0.3 +
          mousePos.current.y * 0.15 +
          canvas.height / 2

        const size = 2 + Math.sin(time + i) * 1.5
        const opacity = 0.3 + Math.sin(time + i * 2) * 0.2

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(224, 180, 178, ${opacity})`
        ctx.fill()

        // Add subtle glow
        ctx.beginPath()
        ctx.arc(x, y, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 175, 229, ${opacity * 0.3})`
        ctx.fill()

        // Sparkle effect for select particles
        if (i % 8 === 0) {
          ctx.beginPath()
          ctx.arc(x, y, 0.5 + Math.random() * 1, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`
          ctx.fill()
        }
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e) => {
      const targetX = e.clientX
      const targetY = e.clientY

      // Smooth interpolation
      mousePos.current.x += (targetX - mousePos.current.x) * 0.1
      mousePos.current.y += (targetY - mousePos.current.y) * 0.1
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvasBackground} />
}

export default CanvasBackground
