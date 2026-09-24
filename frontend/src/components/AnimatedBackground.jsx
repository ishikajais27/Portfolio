'use client'
import { useEffect } from 'react'
import styles from './AnimatedBackground.module.css'

// The particle canvas is shared: all <AnimatedBackground /> instances that are
// mounted at the same time use one canvas and one animation loop.
let mountedCount = 0
let stopParticles = null

const startParticles = () => {
  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.2 + 0.1,
    angle: Math.random() * Math.PI * 2,
  }))

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '-1' // Behind content
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  // Mouse interaction for particles
  const handleMouseMove = (e) => {
    particles.forEach((particle) => {
      const pDistance = Math.sqrt(
        Math.pow(e.clientX - particle.x, 2) +
          Math.pow(e.clientY - particle.y, 2),
      )
      if (pDistance < 200) {
        particle.angle = Math.atan2(
          e.clientY - particle.y,
          e.clientX - particle.x,
        )
        particle.speed = 0.5 + (1 - pDistance / 200) * 2
      }
    })
  }

  let animationId
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle) => {
      particle.x += Math.cos(particle.angle) * particle.speed
      particle.y += Math.sin(particle.angle) * particle.speed

      // Wrap around screen edges
      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(205, 132, 130, ${0.5 + Math.random() * 0.3})`
      ctx.fill()
    })

    animationId = requestAnimationFrame(animate)
  }
  animate()

  const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationId)
    canvas.remove()
  }
}

const AnimatedBackground = () => {
  useEffect(() => {
    if (mountedCount++ === 0) stopParticles = startParticles()
    return () => {
      if (--mountedCount === 0) {
        stopParticles?.()
        stopParticles = null
      }
    }
  }, [])

  return (
    <div className={styles.background}>
      {/* Gradient background */}
      <div className={styles.gradient}></div>
    </div>
  )
}

export default AnimatedBackground
