'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Work.module.css'

// Optional fields: githubLink, liveDemo, docsLink, extraLinks, features.
// A button is only rendered when its link exists.
const projects = [
  {
    title: 'Smart Contract Security Engineering',
    techStack: ['Solidity', 'Foundry', 'OpenZeppelin'],
    description:
      'Built 30+ Solidity smart contracts focused on identifying and mitigating critical vulnerability classes. Mitigated reentrancy, access control bypass, signature replay, and ERC-777 callback exploitation vulnerabilities. Validated contracts using fuzz testing, invariant testing, branch coverage, and negative-path validation with Foundry.',
    githubLink: 'https://github.com/ishikajais27/Solidity',
    docsLink: 'https://github.com/ishikajais27/Solidity/blob/main/Document.doc',
    extraLinks: [
      { label: 'ERC Repository', href: 'https://github.com/ishikajais27/ERC' },
      {
        label: 'Foundry Repository',
        href: 'https://github.com/ishikajais27/Foundry',
      },
    ],
    color: '#cd8482',
    ink: '#0a1a1f',
    widthScale: 1.06,
    heightScale: 0.94,
  },
  {
    title: 'VibeFiles - VS Code Extension',
    techStack: ['TypeScript', 'Groq Vision API', 'VS Code Extension API'],
    description:
      'Security: path traversal guard using real-path resolution and prefix assertion blocking all ../ escape attempts. Reliability: atomic file writes (tmp-rename) with rollback on failure ensuring zero side effects.',
    githubLink: 'https://github.com/ishikajais27/VibeFS',
    docsLink: 'https://github.com/ishikajais27/VibeFS/blob/main/VibeFs.docx',
    color: '#677e8a',
    ink: '#ffffff',
    widthScale: 0.88,
    heightScale: 1,
  },
  {
    title: 'PayKart - Finance Dashboard Platform',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    description:
      'Engineered role-based access control (VIEWER/ANALYST/ADMIN) with ownership checks enforced independently at both middleware and service layers. Designed dual-channel JWT authentication (HTTP-only cookie + Bearer token) with bcrypt password hashing (cost 10) and enumeration-resistant login handling.',
    githubLink: 'https://github.com/ishikajais27/PayKart',
    docsLink:
      'https://github.com/ishikajais27/PayKart/blob/main/PayKart_Technical_Reference.docx',
    color: '#622347',
    ink: '#e0b4b2',
    widthScale: 0.96,
    heightScale: 0.9,
  },
  {
    title: 'KIIT Fest 9.0 - Event Security Backend',
    techStack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    description:
      '4,000+ concurrent users.\n\nIdentity enforcement: gender-mismatch detection, duplicate check-in prevention, and strict enum validation — all validated before any database write.',
    // No links were provided for this project, so none are shown.
    color: '#e0b4b2',
    ink: '#122e34',
    widthScale: 1.1,
    heightScale: 0.97,
  },
  {
    title: 'KrishiMitra',
    techStack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Python',
      'FastAPI',
      'PyTorch / TensorFlow',
    ],
    description:
      'KrishiMitra is a full-stack AI-powered farming platform built to support rural farmers across Odisha with real-time crop disease detection, livestock health monitoring, live mandi prices, and multilingual support in Odia.',
    features: [
      'AI-powered livestock disease diagnosis',
      'Crop disease detection',
      'Live mandi prices',
      'Multilingual farmer support',
      'Odia-first experience',
      'Low-bandwidth rural device support',
      'Fast AI response pipeline',
    ],
    githubLink: 'https://github.com/ishikajais27/KrishiMitra',
    liveDemo: 'https://hack4-impact-track2-git-it-together.vercel.app/',
    color: '#4a6d78',
    ink: '#ffffff',
    widthScale: 0.92,
    heightScale: 0.92,
  },
]

// Keep these in sync with the transition times in Work.module.css
const FLY_MS = 650 // book flies to the centre of the screen
const CARD_FADE_MS = 280 // card fades out on close
const RETURN_MS = 700 // book flies back to the shelf

const cx = (...names) => names.filter(Boolean).join(' ')

// Only builds buttons for links that really exist
const getLinks = (project) =>
  [
    project.githubLink && {
      label: 'GitHub Repository',
      href: project.githubLink,
    },
    project.liveDemo && {
      label: 'Live Demo',
      href: project.liveDemo,
      solid: true,
    },
    project.docsLink && { label: 'Documentation', href: project.docsLink },
    ...(project.extraLinks || []),
  ].filter(Boolean)

export const Work = () => {
  const [selected, setSelected] = useState(null) // index of the opened book
  // idle -> flying -> open -> closing -> returning -> idle
  const [phase, setPhase] = useState('idle')
  const [flight, setFlight] = useState({ x: 0, y: 0, scale: 1 })

  const phaseRef = useRef('idle')
  const selectedRef = useRef(null)
  const slotRefs = useRef([])
  const closeBtnRef = useRef(null)
  const timers = useRef([])

  const changePhase = useCallback((next) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  const openProject = useCallback(
    (index) => {
      if (phaseRef.current !== 'idle') return
      const slot = slotRefs.current[index]
      if (!slot) return

      // How far the book has to travel to end up in the middle of the screen
      const rect = slot.getBoundingClientRect()
      const targetHeight = Math.min(window.innerHeight * 0.6, 520)
      setFlight({
        x: window.innerWidth / 2 - (rect.left + rect.width / 2),
        y: window.innerHeight / 2 - (rect.top + rect.height / 2),
        scale: Math.min(targetHeight / rect.height, 1.6),
      })

      selectedRef.current = index
      setSelected(index)
      changePhase('flying')
      later(() => changePhase('open'), FLY_MS)
    },
    [changePhase, later],
  )

  const closeProject = useCallback(() => {
    if (phaseRef.current !== 'open') return
    changePhase('closing') // card fades out, book fades back in
    later(() => changePhase('returning'), CARD_FADE_MS) // book flies back
    later(() => {
      const index = selectedRef.current
      setSelected(null)
      changePhase('idle')
      slotRefs.current[index]?.focus({ preventScroll: true })
    }, CARD_FADE_MS + RETURN_MS)
  }, [changePhase, later])

  // While a book is open: Escape closes it, and the page-level wheel / keyboard
  // section switching (SinglePage) is blocked. 'menu-open' is the existing body
  // class that already disables scrolling of the page container.
  const isLocked = phase !== 'idle'
  useEffect(() => {
    if (!isLocked) return
    const blockPageNavigation = (e) => {
      if (e.key === 'Escape') closeProject()
      e.stopPropagation()
    }
    window.addEventListener('wheel', blockPageNavigation, true)
    window.addEventListener('keydown', blockPageNavigation, true)
    document.body.classList.add('menu-open')
    return () => {
      window.removeEventListener('wheel', blockPageNavigation, true)
      window.removeEventListener('keydown', blockPageNavigation, true)
      document.body.classList.remove('menu-open')
    }
  }, [isLocked, closeProject])

  // Move focus into the card once it is open
  useEffect(() => {
    if (phase === 'open') closeBtnRef.current?.focus({ preventScroll: true })
  }, [phase])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const bookIsOut =
    phase === 'flying' || phase === 'open' || phase === 'closing'
  const middle = (projects.length - 1) / 2
  const openedProject = selected !== null ? projects[selected] : null
  const links = openedProject ? getLinks(openedProject) : []

  return (
    <div className={`${styles.work} page-container page-transition`}>
      <main className={styles.main}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>My Projects</h1>
          <p className={styles.subtitle}>Click a book to open the project</p>
        </div>

        {/* Shelf: the parent that gives every book its 3D perspective */}
        <div className={cx(styles.shelf, isLocked && styles.shelfLocked)}>
          <div className={styles.board} aria-hidden="true">
            <div className={styles.boardTop} />
            <div className={styles.boardLip} />
          </div>

          {projects.map((project, index) => {
            const isSelected = index === selected
            const num = String(index + 1).padStart(2, '0')

            return (
              <div
                key={project.title}
                ref={(el) => (slotRefs.current[index] = el)}
                className={cx(
                  styles.slot,
                  isSelected && styles.slotActive,
                  isSelected && bookIsOut && styles.slotLifted,
                  isSelected && phase === 'open' && styles.slotHidden,
                  !isSelected &&
                    phase !== 'idle' &&
                    phase !== 'returning' &&
                    styles.slotDim,
                )}
                style={{
                  '--c': project.color,
                  '--ink': project.ink,
                  '--wk': project.widthScale,
                  '--hk': project.heightScale,
                  // books nearer the middle paint on top of their neighbours
                  zIndex: 10 - Math.abs(index - middle),
                  ...(isSelected && {
                    '--fx': `${flight.x}px`,
                    '--fy': `${flight.y}px`,
                    '--fs': flight.scale,
                  }),
                }}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`Open project: ${project.title}`}
                onClick={() => openProject(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation() // stop the page-level Space shortcut
                    openProject(index)
                  }
                }}
              >
                <div className={styles.book}>
                  <div className={cx(styles.face, styles.spine)}>
                    <span className={styles.spineNum}>{num}</span>
                    <span className={styles.spineTitle}>{project.title}</span>
                  </div>
                  <div className={cx(styles.face, styles.cover)}>
                    <span className={styles.coverNum}>{num}</span>
                    <span className={styles.coverTitle}>{project.title}</span>
                  </div>
                  <div className={cx(styles.face, styles.side)} />
                  <div className={cx(styles.face, styles.top)} />
                </div>
              </div>
            )
          })}
        </div>

        <div className={cx(styles.backdrop, bookIsOut && styles.backdropOn)} />

        {openedProject && (
          <div
            className={cx(
              styles.overlay,
              phase === 'open' && styles.overlayOpen,
            )}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeProject()
            }}
          >
            <div
              className={cx(styles.card, phase === 'open' && styles.cardShow)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-title"
              style={{ '--c': openedProject.color }}
            >
              <button
                ref={closeBtnRef}
                type="button"
                className={styles.closeBtn}
                onClick={closeProject}
                aria-label="Close project details"
              >
                ×
              </button>

              <div className={styles.cardBody}>
                <span className={styles.cardIndex}>
                  {String(selected + 1).padStart(2, '0')} /{' '}
                  {String(projects.length).padStart(2, '0')}
                </span>
                <h2 id="project-title" className={styles.cardTitle}>
                  {openedProject.title}
                </h2>

                <h3 className={styles.cardLabel}>Tech Stack</h3>
                <ul className={styles.chips}>
                  {openedProject.techStack.map((tech) => (
                    <li key={tech} className={styles.chip}>
                      {tech}
                    </li>
                  ))}
                </ul>

                <h3 className={styles.cardLabel}>Description</h3>
                <p className={styles.cardDesc}>{openedProject.description}</p>

                {openedProject.features && (
                  <>
                    <h3 className={styles.cardLabel}>Key Features</h3>
                    <ul className={styles.featureList}>
                      {openedProject.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </>
                )}

                {links.length > 0 && (
                  <>
                    <h3 className={styles.cardLabel}>Links</h3>
                    <div className={styles.cardActions}>
                      {links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            link.solid ? styles.btnSolid : styles.btnGhost
                          }
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
