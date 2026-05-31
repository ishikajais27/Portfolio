// Loader.jsx
'use client'
import { useEffect, useState, useRef } from 'react'
import styles from './Loader.module.css'

const CARDS = [
  {
    id: 0,
    role: 'Full Stack',
    sub: 'Developer',
    symbol: '</>',
    accent: '#e74c3c',
    bg: 'linear-gradient(150deg, #8b0000 0%, #c0392b 45%, #e74c3c 100%)',
    glow: 'rgba(231, 76, 60, 0.5)',
  },
  {
    id: 1,
    role: 'Blockchain',
    sub: 'Developer',
    symbol: '⬡',
    accent: '#7b68ee',
    bg: 'linear-gradient(150deg, #0a0a2e 0%, #2d2680 45%, #6c5ce7 100%)',
    glow: 'rgba(108, 92, 231, 0.5)',
  },
  {
    id: 2,
    role: 'Algorithms',
    sub: '& AI',
    symbol: '◈',
    accent: '#e74c3c',
    bg: 'linear-gradient(150deg, #3d0000 0%, #7a0000 45%, #b71c1c 100%)',
    glow: 'rgba(183, 28, 28, 0.5)',
  },
]

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const noiseRef = useRef(null)

  // Parallax effect on noise texture
  useEffect(() => {
    const handleScroll = () => {
      if (noiseRef.current && !exiting) {
        const scrollY = window.scrollY
        // Move texture at 30% scroll speed for subtle parallax
        noiseRef.current.style.backgroundPosition = `0px ${scrollY * 0.3}px`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [exiting])

  useEffect(() => {
    const total = 3200
    const tick = 30
    const step = 100 / (total / tick)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setExiting(true)
            setTimeout(onComplete, 900)
          }, 420)
          return 100
        }
        return next
      })
    }, tick)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className={`${styles.loader} ${exiting ? styles.loaderOut : ''}`}>
      <div ref={noiseRef} className={styles.noise} />

      {CARDS.map((card) => (
        <div
          key={card.id}
          className={`${styles.card} ${styles[`card${card.id}`]} ${
            exiting ? styles[`exit${card.id}`] : ''
          }`}
          style={{
            background: card.bg,
            boxShadow: `0 30px 70px ${card.glow}, 0 10px 30px rgba(0,0,0,0.8)`,
            '--accent': card.accent,
          }}
        >
          <div className={styles.cardShine} />
          <div className={styles.cardGlow} style={{ background: card.glow }} />

          <div className={styles.cardBody}>
            <div className={styles.avatarRing}>
              <div className={styles.avatarInner}>
                <span className={styles.symbol}>{card.symbol}</span>
              </div>
            </div>
            <div className={styles.mockText}>
              <div className={styles.mockLine} />
              <div className={`${styles.mockLine} ${styles.mockLineMid}`} />
              <div className={`${styles.mockLine} ${styles.mockLineShort}`} />
            </div>
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.cardRole}>{card.role}</span>
            <span className={styles.cardSub}>{card.sub}</span>
          </div>
        </div>
      ))}

      <div className={`${styles.counter} ${exiting ? styles.counterOut : ''}`}>
        <span className={styles.num}>{Math.round(progress)}</span>
        <span className={styles.pct}>%</span>
      </div>

      <div
        className={styles.progressLine}
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  )
}

export default Loader
