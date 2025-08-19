'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './AnimatedName.module.css'

const AnimatedName = () => {
  const containerRef = useRef(null)
  const lettersRef = useRef([])
  const particlesRef = useRef([])
  const canvasRef = useRef(null)

  useEffect(() => {
    // Initialize particles
    particlesRef.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.2 + 0.1,
      angle: Math.random() * Math.PI * 2,
    }))

    // Name animation
    gsap.fromTo(
      lettersRef.current,
      {
        opacity: 0,
        y: 100,
        rotationX: -90,
        rotationZ: gsap.utils.random(-30, 30),
        scale: 0.5,
        color: '#0ED21',
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationZ: 0,
        scale: 1,
        color: '#E0B4B2',
        duration: 1.5,
        stagger: {
          each: 0.08,
          from: 'random',
          grid: 'auto',
        },
        ease: 'back.out(2)',
      }
    )

    // Floating animation
    lettersRef.current.forEach((letter, i) => {
      if (letter) {
        gsap.to(letter, {
          y: -10 + (i % 2 === 0 ? 5 : -5),
          duration: 3 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: i * 0.05,
        })
      }
    })

    // Mouse interaction
    const handleMouseMove = (e) => {
      lettersRef.current.forEach((letter, index) => {
        if (!letter) return

        const rect = letter.getBoundingClientRect()
        const letterX = rect.left + rect.width / 2
        const letterY = rect.top + rect.height / 2
        const distanceX = e.clientX - letterX
        const distanceY = e.clientY - letterY
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        )

        if (distance < 150) {
          const power = Math.pow((150 - distance) / 150, 2)
          const angle = Math.atan2(distanceY, distanceX)

          gsap.to(letter, {
            x: Math.cos(angle) * power * 25,
            y: Math.sin(angle) * power * 15,
            rotationZ: Math.cos(angle) * power * 20,
            scale: 1 + power * 0.3,
            color: gsap.utils.interpolate('#E0B4B2', '#A8AFE5', power),
            duration: 0.4,
            ease: 'power2.out',
          })

          // Update particles near cursor
          particlesRef.current.forEach((particle) => {
            const pDistance = Math.sqrt(
              Math.pow(e.clientX - particle.x, 2) +
                Math.pow(e.clientY - particle.y, 2)
            )
            if (pDistance < 200) {
              particle.angle = Math.atan2(
                e.clientY - particle.y,
                e.clientX - particle.x
              )
              particle.speed = 0.5 + (1 - pDistance / 200) * 2
            }
          })
        } else {
          gsap.to(letter, {
            x: 0,
            y: 0,
            rotationZ: 0,
            scale: 1,
            color: '#E0B4B2',
            duration: 1.2,
            ease: 'elastic.out(1, 0.4)',
          })
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Create canvas for particles
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvasRef.current = canvas
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '1'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)

    let animationId
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
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

      animationId = requestAnimationFrame(animateParticles)
    }

    animateParticles()

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (canvas && document.body.contains(canvas)) {
        document.body.removeChild(canvas)
      }
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      lettersRef.current.forEach((letter) => {
        if (letter) {
          gsap.killTweensOf(letter)
        }
      })
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.nameContainer}>
      <h1 className={styles.name}>
        {'Ishika Jaiswal'.split('').map((letter, index) => (
          <span
            key={index}
            className={styles.letter}
            ref={(el) => (lettersRef.current[index] = el)}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </h1>
    </div>
  )
}

export default AnimatedName
