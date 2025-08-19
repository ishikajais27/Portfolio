'use client'
import { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import AnimatedBackground from '../components/AnimatedBackground'
import MovingEyes from '../components/MovingEyes/MovingEyes'
import styles from './Work.module.css'
import img1 from '../assets/img3.png'
import img2 from '../assets/img4.png'

export const Work = () => {
  const [loadedIframes, setLoadedIframes] = useState({})
  const [activeIframe, setActiveIframe] = useState(null)

  useEffect(() => {
    document.body.style.cursor = 'default'
    return () => {
      document.body.style.cursor = ''
    }
  }, [])

  const projects = [
    {
      title: 'GitFolio',
      description:
        'A portfolio platform for developers to showcase their projects and skills with a clean, modern interface.',
      githubLink: 'https://github.com/ishikajais27/GitFolio',
      liveDemo: 'https://git-folio-frontend.vercel.app/',
    },
    {
      title: 'NodeCanvas',
      description:
        'Interactive node-based canvas application for creating visual workflows and diagrams.',
      githubLink: 'https://github.com/ishikajais27/NodeCanvas',
      liveDemo: 'https://node-canvas-frontend-xals.vercel.app/',
    },
    {
      title: 'Hackathon Project',
      description:
        'Survival-themed hackathon project with interactive gameplay elements and challenges.',
      githubLink: 'https://github.com/ishikajais27/Hackathon_01',
      liveDemo: 'https://hackathon-01-eexe.vercel.app/survival',
    },
    {
      title: 'Portfolio',
      description: 'My personal portfolio showcasing my projects and skills.',
      githubLink: 'https://github.com/ishikajais27/Portfolio',
      iliveDemo: 'https://portfolio-4mmh.vercel.app/',
    },
    {
      title: 'CodeSensie',
      description:
        'An AI-powered coding assistant that helps developers write better code.',
      githubLink: 'https://github.com/ishikajais27/code_sensei',
      imageDemo: img2, // Add this path to your codesensie image
    },
  ]

  const handleLoadIframe = (index) => {
    setLoadedIframes((prev) => ({ ...prev, [index]: true }))
    setActiveIframe(index)
  }

  const handleLiveDemoClick = (url, e) => {
    e.stopPropagation()
    window.open(url, '_blank')
  }

  const handleCardClick = (index) => {
    if (!loadedIframes[index]) {
      handleLoadIframe(index)
    }
  }

  return (
    <div className={styles.work}>
      <Header />
      <AnimatedBackground />
      <MovingEyes />
      <main className={styles.main}>
        <h1 className={styles.title}>My Projects</h1>
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <div
              key={index}
              className={`${styles.projectCard} ${
                activeIframe === index ? styles.activeCard : ''
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className={styles.demoContainer}>
                {loadedIframes[index] ? (
                  project.liveDemo ? (
                    <iframe
                      src={project.liveDemo}
                      className={styles.iframe}
                      title={`${project.title} Demo`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={project.imageDemo}
                      alt={`${project.title} Screenshot`}
                      className={styles.iframe}
                      style={{ objectFit: 'cover' }}
                    />
                  )
                ) : (
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderContent}>
                      <h3>{project.title}</h3>
                      <p>
                        Click to load{' '}
                        {project.liveDemo ? 'live demo' : 'project preview'}
                      </p>
                      <button
                        className={styles.loadButton}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLoadIframe(index)
                        }}
                      >
                        Load{' '}
                        {project.liveDemo
                          ? 'Interactive Demo'
                          : 'Project Preview'}
                      </button>
                    </div>
                  </div>
                )}
                {project.liveDemo && (
                  <button
                    className={styles.liveDemoButton}
                    onClick={(e) => handleLiveDemoClick(project.liveDemo, e)}
                  >
                    ↗ Open in New Tab
                  </button>
                )}
              </div>
              <div className={styles.cardContent}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className={styles.links}>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.githubLink}
                  >
                    <span>View on GitHub</span> <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
