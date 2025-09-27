// SinglePage.jsx
'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home } from './Home'
import { About } from './About'
import { Work } from './Work'
import { Contact } from './Contact'
import '../App.module.css'

export const SinglePage = () => {
  const [currentSection, setCurrentSection] = useState('home')
  const [isScrolling, setIsScrolling] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const scrollTimeoutRef = useRef(null)
  const sectionsRef = useRef([])

  const sections = [
    { id: 'home', path: '/', component: Home },
    { id: 'about', path: '/about', component: About },
    { id: 'work', path: '/work', component: Work },
    { id: 'contact', path: '/contact', component: Contact },
  ]

  useEffect(() => {
    const handleParallax = () => {
      const sections = document.querySelectorAll('.page-section')
      const scrollPosition = window.pageYOffset

      sections.forEach((section) => {
        const element = section
        const speed = 0.5 // Parallax speed
        const yPos = -(scrollPosition * speed)

        // Apply parallax to background
        const bg = element.querySelector('.parallax-bg')
        if (bg) {
          bg.style.transform = `translateY(${yPos}px)`
        }

        // Apply subtle parallax to content
        const content = element.querySelector('.section-content')
        if (content) {
          const contentSpeed = 0.1
          const contentYPos = -(scrollPosition * contentSpeed)
          content.style.transform = `translateY(${contentYPos}px)`
        }
      })
    }

    // Throttle the parallax function for performance
    let ticking = false
    const throttledParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleParallax()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledParallax, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledParallax)
    }
  }, [])

  // Sync URL with current section
  useEffect(() => {
    const sectionFromPath = location.pathname.slice(1) || 'home'
    if (sectionFromPath !== currentSection) {
      setCurrentSection(sectionFromPath)
      scrollToSection(sectionFromPath, false)
    }
  }, [location.pathname])

  const scrollToSection = useCallback(
    (sectionId, updateUrl = true) => {
      const element = document.getElementById(sectionId)
      if (element) {
        setCurrentSection(sectionId)
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })

        if (updateUrl) {
          const sectionPath = sectionId === 'home' ? '/' : `/${sectionId}`
          navigate(sectionPath, { replace: true })
        }
      }
    },
    [navigate]
  )

  const handleWheel = useCallback(
    (e) => {
      if (isScrolling) return

      e.preventDefault()
      setIsScrolling(true)

      const currentIndex = sections.findIndex(
        (section) => section.id === currentSection
      )

      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        // Scroll down to next section
        scrollToSection(sections[currentIndex + 1].id)
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up to previous section
        scrollToSection(sections[currentIndex - 1].id)
      }

      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 800)
    },
    [isScrolling, currentSection, sections, scrollToSection]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (isScrolling) return

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault()
        setIsScrolling(true)

        const currentIndex = sections.findIndex(
          (section) => section.id === currentSection
        )

        if (
          (e.key === 'ArrowDown' || e.key === ' ') &&
          currentIndex < sections.length - 1
        ) {
          scrollToSection(sections[currentIndex + 1].id)
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          scrollToSection(sections[currentIndex - 1].id)
        }

        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 800)
      }
    },
    [isScrolling, currentSection, sections, scrollToSection]
  )

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(scrollTimeoutRef.current)
    }
  }, [handleWheel, handleKeyDown])

  // Intersection Observer for section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const newSection = entry.target.id
            setCurrentSection(newSection)

            // Update URL without triggering scroll
            const sectionPath = newSection === 'home' ? '/' : `/${newSection}`
            if (location.pathname !== sectionPath) {
              navigate(sectionPath, { replace: true })
            }
          }
        })
      },
      {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: '-10% 0px -10% 0px',
      }
    )

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
        sectionsRef.current.push(element)
      }
    })

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [sections, navigate, location.pathname])

  const navigateToSection = useCallback(
    (sectionId) => {
      if (isScrolling) return
      scrollToSection(sectionId)
    },
    [isScrolling, scrollToSection]
  )

  return (
    <div className="single-page-container">
      {/* Navigation Dots */}
      <nav className="navigation-dots">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`dot ${
              currentSection === section.id ? 'active-dot' : ''
            }`}
            onClick={() => navigateToSection(section.id)}
            aria-label={`Go to ${section.id} section`}
          />
        ))}
      </nav>

      {/* Sections */}
      {sections.map((section) => {
        const SectionComponent = section.component
        return (
          <section key={section.id} id={section.id} className="page-section">
            <SectionComponent />
          </section>
        )
      })}
    </div>
  )
}
