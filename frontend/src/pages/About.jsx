'use client'
import { useState, useRef, useEffect } from 'react'
import Header from '../components/Header/Header'
import AnimatedBackground from '../components/AnimatedBackground'
import styles from './About.module.css'

export const About = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const [showPointer, setShowPointer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleClick = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setClickPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setShowPointer(true)
      setTimeout(() => setShowPointer(false), 1000)
    }
    setIsFlipped(!isFlipped)
  }

  const handleTouchStart = (e) => {
    if (cardRef.current && isMobile) {
      const touch = e.touches[0]
      const rect = cardRef.current.getBoundingClientRect()
      setClickPosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      })
      setShowPointer(true)
      setTimeout(() => setShowPointer(false), 1000)
      setIsFlipped(!isFlipped)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        setClickPosition({
          x: rect.width / 2,
          y: rect.height / 2,
        })
        setShowPointer(true)
        setTimeout(() => setShowPointer(false), 1000)
      }
      setIsFlipped(!isFlipped)
    }
  }

  return (
    // <div className={styles.about}>
    <div className={`${styles.about} page-container page-transition`}>
      <Header />
      <AnimatedBackground />
      <main className={styles.mainContainer}>
        <div
          className={`${styles.cardContainer} ${
            isFlipped ? styles.flipped : ''
          }`}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onKeyDown={handleKeyPress}
          ref={cardRef}
          tabIndex={0}
          role="button"
          aria-label={
            isFlipped ? 'Hide about information' : 'Show about information'
          }
        >
          {/* Glowing Finger Pointer */}
          {showPointer && (
            <div
              className={styles.clickPointer}
              style={{
                left: `${clickPosition.x}px`,
                top: `${clickPosition.y}px`,
              }}
            >
              {isMobile ? '👆' : '👈'}
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.front}>
              <div className={styles.frontContent}>
                <h2>
                  {isMobile ? 'Tap to know about me' : 'Click to know about me'}
                </h2>
                <p>{isMobile ? '👆 Tap anywhere' : '👈 Click anywhere'}</p>
                {!isMobile && (
                  <div className={styles.hint}>
                    Press Space or Enter to flip
                  </div>
                )}
              </div>
            </div>

            <div className={styles.back}>
              <div className={styles.aboutContent}>
                <h2>About Me</h2>
                <div className={styles.aboutText}>
                  <p>
                    Hi, I'm a 3rd-year CSE student who loves building
                    things—sometimes with code, sometimes with circuits. From
                    crafting web apps to building robots for tech fests, I enjoy
                    exploring how tech solves real problems.
                  </p>

                  <p>
                    Right now, I'm interning at DeepSurge AI, working on a road
                    quality monitoring solution using computer vision. Beyond
                    that, I'm diving into blockchain security, Web3, and
                    generative AI—always curious about what's next.
                  </p>
                </div>

                <div className={styles.skills}>
                  <span className={styles.skill}>React</span>
                  <span className={styles.skill}>Node.js</span>
                  <span className={styles.skill}>CSS3</span>
                  <span className={styles.skill}>Computer Vision</span>
                  <span className={styles.skill}>Blockchain</span>
                  <span className={styles.skill}>Web3</span>
                </div>

                <p className={styles.quote}>
                  "For me, tech is about learning, failing, and trying again. 🚀
                  Let's build something cool together."
                </p>

                <div className={styles.flipHint}>
                  {isMobile
                    ? 'Tap to flip back'
                    : 'Click anywhere to flip back'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
