'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './About.module.css'

export const About = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const [showPointer, setShowPointer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef(null)
  const pointerTimer = useRef(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => () => clearTimeout(pointerTimer.current), [])

  const flashPointer = (x, y) => {
    setClickPosition({ x, y })
    setShowPointer(true)
    clearTimeout(pointerTimer.current)
    pointerTimer.current = setTimeout(() => setShowPointer(false), 1000)
  }

  // A tap also fires "click", so this one handler covers mouse and touch.
  // (The separate touchstart handler flipped the card a second time.)
  const handleClick = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      flashPointer(e.clientX - rect.left, e.clientY - rect.top)
    }
    setIsFlipped((flipped) => !flipped)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        flashPointer(rect.width / 2, rect.height / 2)
      }
      setIsFlipped((flipped) => !flipped)
    }
  }

  return (
    // <div className={styles.about}>
    <div className={`${styles.about} page-container page-transition`}>
      <main className={styles.mainContainer}>
        <div
          className={`${styles.cardContainer} ${
            isFlipped ? styles.flipped : ''
          }`}
          onClick={handleClick}
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
                    I'm a 4th-year B.Tech CSE student and software developer
                    working across full-stack and backend. I build practical
                    systems with Node.js, TypeScript, PostgreSQL and WebSockets,
                    and I've led technology teams on campus.
                  </p>
                </div>

                <div className={styles.details}>
                  <p className={styles.detailRow}>
                    <span className={styles.detailLabel}>Experience</span>
                    Web Developer Intern at Expelee FZCO. Built two full-stack
                    products, Zammencalc and Memowall API, and cut PostgreSQL
                    query latency by 40% with composite indexing. Audited
                    distributed LMS codebases for attack surfaces and
                    reliability failures; the team adopted my findings.
                  </p>
                  <p className={styles.detailRow}>
                    <span className={styles.detailLabel}>Leadership</span>
                    Chief Officer, Office of Technology &amp; Innovation (OTI),
                    K-1000 KIIT: directed tech strategy and cross-team
                    execution. Tech Head, KIIT Nexus: led technical projects for
                    the student tech community.
                  </p>
                  <p className={styles.detailRow}>
                    <span className={styles.detailLabel}>Beyond code</span>
                    Designed, built and programmed robots in team settings, and
                    represented my university at tech fests hosted by IITs and
                    other premier institutes.
                  </p>
                  <p className={styles.detailRow}>
                    <span className={styles.detailLabel}>Recognition</span>
                    Top 3 at IIT Patna Tech Fest · GSSoC 2026 Open Source
                    Contributor &amp; Mentee · McKinsey Forward 2026 participant
                  </p>
                </div>

                <div className={styles.skills}>
                  <span className={styles.skill}>TypeScript</span>
                  <span className={styles.skill}>Node.js</span>
                  <span className={styles.skill}>PostgreSQL</span>
                  <span className={styles.skill}>WebSockets</span>
                  <span className={styles.skill}>React</span>
                  <span className={styles.skill}>Computer Vision</span>
                  <span className={styles.skill}>Blockchain</span>
                </div>

                <p className={styles.quote}>
                  "I like software that still holds up when things go wrong."
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
