'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Header from '../components/Header/Header'
import AnimatedBackground from '../components/AnimatedBackground'
import MovingEyes from '../components/MovingEyes/MovingEyes'
import styles from './Work.module.css'
import img2 from '../assets/img4.png'

const GithubLink = ({ href, className, onClickFn }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClickFn}
    >
      GitHub
    </a>
  )
}

const LiveLink = ({ href, className, onClickFn }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClickFn}
    >
      Live
    </a>
  )
}

export const Work = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const autoRef = useRef(null)
  const containerRef = useRef(null)

  const projects = [
    {
      title: 'GitFolio',
      description:
        'A portfolio platform for developers to showcase their projects and skills with a clean, modern interface.',
      githubLink: 'https://github.com/ishikajais27/GitFolio',
      liveDemo: 'https://git-folio-frontend.vercel.app/',
      tag: 'Full Stack',
      color: '#cd8482',
    },
    {
      title: 'NodeCanvas',
      description:
        'Interactive node-based canvas application for creating visual workflows and diagrams.',
      githubLink: 'https://github.com/ishikajais27/NodeCanvas',
      liveDemo: 'https://node-canvas-frontend-xals.vercel.app/',
      tag: 'Creative Tool',
      color: '#677e8a',
    },
    {
      title: 'Hackathon Project',
      description:
        'Survival-themed hackathon project with interactive gameplay elements and challenges.',
      githubLink: 'https://github.com/ishikajais27/Hackathon_01',
      liveDemo: 'https://hackathon-01-eexe.vercel.app/survival',
      tag: 'Hackathon',
      color: '#a67a8c',
    },
    {
      title: 'Portfolio',
      description: 'My personal portfolio showcasing my projects and skills.',
      githubLink: 'https://github.com/ishikajais27/Portfolio',
      liveDemo: 'https://portfolio-4mmh.vercel.app/',
      tag: 'Portfolio',
      color: '#122e34',
    },
    {
      title: 'CodeSensie',
      description:
        'An AI-powered coding assistant that helps developers write better code.',
      githubLink: 'https://github.com/ishikajais27/code_sensei',
      liveDemo: null,
      imageDemo: img2,
      tag: 'AI Tool',
      color: '#4a6d78',
    },
  ]

  const total = projects.length

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total)
  }, [total])

  useEffect(() => {
    if (!autoRotate) return
    autoRef.current = setInterval(next, 3500)
    return () => clearInterval(autoRef.current)
  }, [autoRotate, next])

  const pauseAuto = useCallback(() => {
    setAutoRotate(false)
    clearInterval(autoRef.current)
    setTimeout(() => setAutoRotate(true), 6000)
  }, [])

  const onDragStart = (e) => {
    setIsDragging(true)
    setDragStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX)
    pauseAuto()
  }

  const onDragEnd = (e) => {
    if (!isDragging) return
    const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX
    const diff = dragStartX - endX
    if (Math.abs(diff) > 40) {
      if (diff > 0) next()
      else prev()
    }
    setIsDragging(false)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        next()
        pauseAuto()
      }
      if (e.key === 'ArrowLeft') {
        prev()
        pauseAuto()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, pauseAuto])

  const getCardStyle = (index) => {
    const diff = (((index - activeIndex) % total) + total) % total
    const pos = diff > total / 2 ? diff - total : diff
    const absPos = Math.abs(pos)

    if (absPos > 2) return { display: 'none' }

    const rotateY = pos * 38
    const translateZ = pos === 0 ? 120 : absPos === 1 ? -60 : -200
    const translateX = pos * 260
    const scale = pos === 0 ? 1 : absPos === 1 ? 0.82 : 0.65
    const opacity = pos === 0 ? 1 : absPos === 1 ? 0.65 : 0.3
    const zIndex = pos === 0 ? 10 : absPos === 1 ? 5 : 1
    const brightness = pos === 0 ? 1 : absPos === 1 ? 0.7 : 0.5

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      filter: `brightness(${brightness})`,
      pointerEvents: pos === 0 ? 'all' : 'none',
      transition: isDragging
        ? 'none'
        : 'all 0.7s cubic-bezier(0.34, 1.26, 0.64, 1)',
    }
  }

  const handleSideCardClick = (index) => {
    if (index === activeIndex) return
    const diff = (((index - activeIndex) % total) + total) % total
    if (diff === 1 || diff < total / 2) next()
    else prev()
    pauseAuto()
  }

  return (
    <div className={`${styles.work} page-container page-transition`}>
      <Header />
      <AnimatedBackground />
      <MovingEyes />

      <main className={styles.main}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>My Projects</h1>
          <p className={styles.subtitle}>Drag, click arrows, or use keyboard</p>
        </div>

        <div
          className={styles.sceneWrapper}
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEnd}
        >
          <div className={styles.scene} ref={containerRef}>
            {projects.map((project, index) => (
              <div
                key={index}
                className={
                  index === activeIndex
                    ? `${styles.card} ${styles.cardActive}`
                    : styles.card
                }
                style={getCardStyle(index)}
                onClick={() => handleSideCardClick(index)}
              >
                <div className={styles.cardInner}>
                  <div className={styles.previewArea}>
                    {project.liveDemo ? (
                      <iframe
                        src={index === activeIndex ? project.liveDemo : ''}
                        className={styles.iframe}
                        title={project.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <img
                        src={project.imageDemo}
                        alt={project.title}
                        className={styles.previewImg}
                      />
                    )}
                    <div className={styles.previewOverlay}>
                      <span
                        className={styles.tagBadge}
                        style={{ background: project.color }}
                      >
                        {project.tag}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.cardDesc}>{project.description}</p>
                    <div className={styles.cardActions}>
                      <GithubLink
                        href={project.githubLink}
                        className={styles.btnGhost}
                        onClickFn={(e) => e.stopPropagation()}
                      />
                      {project.liveDemo ? (
                        <LiveLink
                          href={project.liveDemo}
                          className={styles.btnSolid}
                          onClickFn={(e) => e.stopPropagation()}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.navBtn}
            onClick={() => {
              prev()
              pauseAuto()
            }}
            aria-label="Previous"
          >
            Prev
          </button>

          <div className={styles.dots}>
            {projects.map((_, i) => (
              <button
                key={i}
                className={
                  i === activeIndex
                    ? `${styles.dot} ${styles.dotActive}`
                    : styles.dot
                }
                onClick={() => {
                  setActiveIndex(i)
                  pauseAuto()
                }}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>

          <button
            className={styles.navBtn}
            onClick={() => {
              next()
              pauseAuto()
            }}
            aria-label="Next"
          >
            Next
          </button>
        </div>

        <div className={styles.indexDisplay}>
          <span className={styles.indexCurrent}>
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className={styles.indexSep}>/</span>
          <span className={styles.indexTotal}>
            {String(total).padStart(2, '0')}
          </span>
        </div>
      </main>
    </div>
  )
}
