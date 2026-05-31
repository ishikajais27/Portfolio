'use client'
import { useEffect, useRef } from 'react'
import styles from './Loader.module.css'

const SVG_W = 1000
const SVG_H = 240

const buildWave = (yBase, offset, amp, freq, w, h) => {
  const TAU = Math.PI * 2
  let d = `M -10 ${yBase + Math.sin(offset) * amp}`
  for (let x = 0; x <= w + 10; x += 2) {
    const y = yBase + Math.sin(x * freq * TAU + offset) * amp
    d += ` L ${x} ${y}`
  }
  return `${d} L ${w + 10} ${h + 10} L -10 ${h + 10} Z`
}

const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

const Loader = ({ onComplete }) => {
  const containerRef = useRef(null)
  const textGroupRef = useRef(null)
  const wave1Ref = useRef(null)
  const wave2Ref = useRef(null)
  const wave3Ref = useRef(null)
  const numRef = useRef(null)
  const lineRef = useRef(null)
  const counterWrapRef = useRef(null)
  const canvasRef = useRef(null)
  const glitchRef = useRef(null)

  useEffect(() => {
    // Particle canvas
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    let particles = []
    let animating = true

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#cd8482' : '#677e8a',
      })
    }

    const drawParticles = () => {
      if (!ctx || !animating) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })
      ctx.globalAlpha = 1
      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(205,132,130,${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      requestAnimationFrame(drawParticles)
    }
    drawParticles()

    // Main wave animation
    let rafId
    let startTs = null
    let exiting = false
    let w1Offset = 0
    let w2Offset = Math.PI * 0.7
    let w3Offset = Math.PI * 1.4
    let glitchTimer = 0

    const DURATION = 3600

    const animate = (ts) => {
      if (exiting) return
      if (!startTs) startTs = ts
      const elapsed = Math.min(ts - startTs, DURATION)
      const t = elapsed / DURATION
      const progress = easeInOutSine(t)
      const progressFast = easeOutExpo(t)

      w1Offset += 0.038
      w2Offset += 0.024
      w3Offset += 0.018

      const yBase = SVG_H * (1 - progress) - 6

      if (wave1Ref.current) {
        wave1Ref.current.setAttribute(
          'd',
          buildWave(yBase, w1Offset, 10, 0.0028, SVG_W, SVG_H),
        )
      }
      if (wave2Ref.current) {
        wave2Ref.current.setAttribute(
          'd',
          buildWave(yBase + 9, w2Offset, 7, 0.004, SVG_W, SVG_H),
        )
      }
      if (wave3Ref.current) {
        wave3Ref.current.setAttribute(
          'd',
          buildWave(yBase + 16, w3Offset, 5, 0.005, SVG_W, SVG_H),
        )
      }
      if (numRef.current) {
        numRef.current.textContent = Math.round(progress * 100)
      }
      if (lineRef.current) {
        lineRef.current.style.transform = `scaleX(${progressFast})`
      }

      // Glitch effect
      glitchTimer += 0.016
      if (glitchRef.current) {
        if (Math.sin(glitchTimer * 3.7) > 0.88 && t > 0.2 && t < 0.9) {
          const shift = (Math.random() - 0.5) * 8
          glitchRef.current.style.transform = `translateX(${shift}px)`
          glitchRef.current.style.opacity = '0.6'
        } else {
          glitchRef.current.style.transform = 'translateX(0)'
          glitchRef.current.style.opacity = '0'
        }
      }

      if (t < 1) {
        rafId = requestAnimationFrame(animate)
      } else if (!exiting) {
        exiting = true
        animating = false
        if (counterWrapRef.current) {
          counterWrapRef.current.style.transition = 'opacity 0.35s ease'
          counterWrapRef.current.style.opacity = '0'
        }
        setTimeout(() => {
          if (textGroupRef.current) {
            textGroupRef.current.style.transition = [
              'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
              'filter 1.2s ease',
              'opacity 1s ease 0.15s',
            ].join(', ')
            textGroupRef.current.style.transform =
              'scale(3.8) translateY(-20px)'
            textGroupRef.current.style.filter = 'blur(60px)'
            textGroupRef.current.style.opacity = '0'
          }
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.transition = 'opacity 0.65s ease'
              containerRef.current.style.opacity = '0'
              containerRef.current.style.pointerEvents = 'none'
            }
            setTimeout(onComplete, 700)
          }, 880)
        }, 250)
      }
    }

    const start = () => {
      rafId = requestAnimationFrame(animate)
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(start)
    } else {
      setTimeout(start, 80)
    }

    return () => {
      cancelAnimationFrame(rafId)
      exiting = true
      animating = false
      window.removeEventListener('resize', resize)
    }
  }, [onComplete])

  return (
    <div ref={containerRef} className={styles.loader}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <div className={styles.noise} />
      <div className={styles.bgGlow} />
      <div className={styles.bgGlow2} />
      <div className={styles.scanline} />

      <div ref={textGroupRef} className={styles.textContainer}>
        {/* Glitch layer */}
        <svg
          ref={glitchRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className={styles.textSvgGlitch}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <text
            x="500"
            y="188"
            textAnchor="middle"
            fontFamily="'Manrope', 'Inter', sans-serif"
            fontWeight="800"
            fontSize="118"
            letterSpacing="-3"
            fill="#cd8482"
            opacity="0.4"
          >
            Ishika Jaiswal
          </text>
        </svg>

        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          xmlns="http://www.w3.org/2000/svg"
          className={styles.textSvg}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="ij-clip">
              <text
                x="500"
                y="188"
                textAnchor="middle"
                fontFamily="'Manrope', 'Inter', sans-serif"
                fontWeight="800"
                fontSize="118"
                letterSpacing="-3"
              >
                Ishika Jaiswal
              </text>
            </clipPath>

            <linearGradient id="ij-g1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cd8482" />
              <stop offset="40%" stopColor="#b07a8c" />
              <stop offset="100%" stopColor="#677e8a" />
            </linearGradient>

            <linearGradient id="ij-g2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cd8482" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#677e8a" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="ij-g3" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#677e8a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#122e34" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="ij-shine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            <filter id="ij-blur">
              <feGaussianBlur stdDeviation="0.6" />
            </filter>
          </defs>

          <g clipPath="url(#ij-clip)">
            {/* Dark bg inside letters */}
            <rect
              x="0"
              y="0"
              width={SVG_W}
              height={SVG_H}
              fill="rgba(18,46,52,0.5)"
            />
            <path ref={wave3Ref} fill="url(#ij-g3)" filter="url(#ij-blur)" />
            <path ref={wave2Ref} fill="url(#ij-g2)" />
            <path ref={wave1Ref} fill="url(#ij-g1)" />
            {/* Shine top */}
            <rect x="0" y="0" width={SVG_W} height="55" fill="url(#ij-shine)" />
          </g>

          {/* Outline text */}
          <text
            x="500"
            y="188"
            textAnchor="middle"
            fontFamily="'Manrope', 'Inter', sans-serif"
            fontWeight="800"
            fontSize="118"
            letterSpacing="-3"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          >
            Ishika Jaiswal
          </text>
        </svg>
      </div>

      <div ref={counterWrapRef} className={styles.counter}>
        <span className={styles.counterLabel}>LOADING</span>
        <div className={styles.counterRow}>
          <span ref={numRef} className={styles.num}>
            0
          </span>
          <span className={styles.pct}>%</span>
        </div>
      </div>

      <div
        ref={lineRef}
        className={styles.progressLine}
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}

export default Loader
