'use client'
import { memo, useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import AnimatedBackground from '../components/AnimatedBackground'
import MovingEyes from '../components/MovingEyes/MovingEyes'
import { Home } from './Home'
import { About } from './About'
import { Work } from './Work'
import { Contact } from './Contact'
import '../App.module.css'

const SECTIONS = [
  { id: 'home', component: memo(Home) },
  { id: 'about', component: memo(About) },
  { id: 'work', component: memo(Work) },
  { id: 'contact', component: memo(Contact) },
]

const MIN_LOCK_MS = 550 // minimum time after a step before a new gesture can start
const MAX_LOCK_MS = 1500 // safety cap so scrolling can never stay stuck
const GESTURE_GAP_MS = 120 // silence this long = gesture (and its inertia) ended
const WHEEL_THRESHOLD = 30 // accumulated delta needed to count as intentional
const SETTLE_MS = 1000

const pathOf = (id) => (id === 'home' ? '/' : `/${id}`)
const idFromPath = (pathname) => {
  const id = pathname.replace(/^\/|\/$/g, '') || 'home'
  return SECTIONS.some((s) => s.id === id) ? id : null
}

const canScrollInside = (target, container, deltaY) => {
  for (
    let el = target;
    el && el !== container && el !== document.body;
    el = el.parentElement
  ) {
    const { overflowY } = getComputedStyle(el)
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      el.scrollHeight > el.clientHeight + 1
    ) {
      const atTop = el.scrollTop <= 0
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
      if (deltaY < 0 ? !atTop : !atBottom) return true
    }
  }
  return false
}

export const SinglePage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const containerRef = useRef(null)
  const currentRef = useRef('home')
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const autoScrolling = useRef(false)
  const settleTimer = useRef(null)
  const firstRun = useRef(true)

  const commit = useCallback((id, updateUrl = true) => {
    currentRef.current = id
    if (updateUrl) navigateRef.current(pathOf(id), { replace: true })
  }, [])

  const nearestSection = useCallback(() => {
    const containerTop = containerRef.current.getBoundingClientRect().top
    let best = SECTIONS[0].id
    let bestDist = Infinity
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const dist = Math.abs(el.getBoundingClientRect().top - containerTop)
      if (dist < bestDist) {
        bestDist = dist
        best = id
      }
    })
    return best
  }, [])

  const goTo = useCallback(
    (id, { updateUrl = true, smooth = true } = {}) => {
      const container = containerRef.current
      const el = document.getElementById(id)
      if (!container || !el) return

      commit(id, updateUrl)

      autoScrolling.current = true
      clearTimeout(settleTimer.current)
      settleTimer.current = setTimeout(
        () => {
          autoScrolling.current = false
          const nearest = nearestSection()
          if (nearest !== currentRef.current) commit(nearest)
        },
        smooth ? SETTLE_MS : 100,
      )

      const top =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop
      if (smooth) {
        container.scrollTo({ top, behavior: 'smooth' })
      } else {
        container.style.scrollBehavior = 'auto'
        container.scrollTop = top
        container.style.scrollBehavior = ''
      }
    },
    [commit, nearestSection],
  )

  useEffect(() => {
    const id = idFromPath(location.pathname)
    if (id && id !== currentRef.current) {
      goTo(id, { updateUrl: false, smooth: !firstRun.current })
    }
    firstRun.current = false
  }, [location.pathname, goTo])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (autoScrolling.current) return
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return
          if (entry.target.id !== currentRef.current) commit(entry.target.id)
        })
      },
      {
        root: containerRef.current,
        threshold: [0.5],
        rootMargin: '-10% 0px -10% 0px',
      },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [commit])

  // Wheel + keyboard navigation (the ONLY wheel handler)
  useEffect(() => {
    let locked = false
    let lockedAt = 0
    let lastTime = 0
    let lastAbs = 0
    let acc = 0

    const step = (dir) => {
      const index = SECTIONS.findIndex((s) => s.id === currentRef.current)
      const next = SECTIONS[index + dir]
      if (!next) return false
      goTo(next.id)
      return true
    }

    const lock = (now) => {
      locked = true
      lockedAt = now
      acc = 0
    }

    const isOverlayOpen = () => document.body.classList.contains('menu-open')

    const onWheel = (e) => {
      if (isOverlayOpen()) return
      if (canScrollInside(e.target, containerRef.current, e.deltaY)) return

      e.preventDefault()

      const now = performance.now()
      const dy =
        e.deltaMode === 1
          ? e.deltaY * 16
          : e.deltaMode === 2
          ? e.deltaY * window.innerHeight
          : e.deltaY
      const abs = Math.abs(dy)
      const gap = now - lastTime
      lastTime = now

      if (gap > GESTURE_GAP_MS) acc = 0

      if (locked) {
        const elapsed = now - lockedAt
        // Inertia decays; a rising delta after the minimum lock = new swipe
        const newGesture =
          elapsed >= MIN_LOCK_MS &&
          (gap > GESTURE_GAP_MS || abs > lastAbs * 1.5)
        lastAbs = abs
        if (!newGesture && elapsed < MAX_LOCK_MS) return
        locked = false
        acc = 0
      }
      lastAbs = abs

      if (acc !== 0 && Math.sign(acc) !== Math.sign(dy)) acc = 0
      acc += dy

      if (Math.abs(acc) < WHEEL_THRESHOLD) return

      if (step(acc > 0 ? 1 : -1)) lock(now)
      else acc = 0
    }

    const onKeyDown = (e) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== ' ') return
      if (isOverlayOpen()) return

      const t = e.target
      if (t.closest?.('input, textarea, select, [contenteditable]')) return
      if (e.key === ' ' && t.closest?.('button, a, [role="button"]')) return

      e.preventDefault()

      const now = performance.now()
      if (locked && now - lockedAt < MIN_LOCK_MS) return

      if (step(e.key === 'ArrowUp' || (e.key === ' ' && e.shiftKey) ? -1 : 1)) {
        lock(now)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(settleTimer.current)
    }
  }, [goTo])

  return (
    <>
      <AnimatedBackground />
      <Header />
      <MovingEyes />

      <div className="single-page-container" ref={containerRef}>
        {SECTIONS.map(({ id, component: Section }) => (
          <section key={id} id={id} className="page-section">
            <Section />
          </section>
        ))}
      </div>
    </>
  )
}
