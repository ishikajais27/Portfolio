
'use client'
import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './SmoothScrollNavigator.module.css'

export const SmoothScrollNavigator = () => {
  const [isScrolling, setIsScrolling] = useState(false)
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const sections = [
    { id: 'home', name: 'Home', path: '/' },
    { id: 'about', name: 'About', path: '/about' },
    { id: 'work', name: 'Work', path: '/work' },
    { id: 'contact', name: 'Contact', path: '/contact' },
  ]

  const scrollToSection = useCallback(
    (sectionPath, sectionId) => {
      if (isScrolling) return

      setIsScrolling(true)
      navigate(sectionPath)

      // Smooth scroll to top of the page
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      setTimeout(() => {
        setIsScrolling(false)
      }, 800)
    },
    [isScrolling, navigate]
  )

  const toggleMobileMenu = () => {
    setIsMobileMenuActive(!isMobileMenuActive)
  }

  // Simple wheel scroll handling
  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return

      // Only trigger on significant scroll
      if (Math.abs(e.deltaY) < 50) return

      const currentPath = location.pathname
      const currentIndex = sections.findIndex(
        (section) => section.path === currentPath
      )

      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        // Scroll down - go to next section
        scrollToSection(
          sections[currentIndex + 1].path,
          sections[currentIndex + 1].id
        )
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up - go to previous section
        scrollToSection(
          sections[currentIndex - 1].path,
          sections[currentIndex - 1].id
        )
      }
    }

    const handleKeyDown = (e) => {
      if (isScrolling) return

      const currentPath = location.pathname
      const currentIndex = sections.findIndex(
        (section) => section.path === currentPath
      )

      if (
        (e.key === 'ArrowDown' || e.key === ' ') &&
        currentIndex < sections.length - 1
      ) {
        e.preventDefault()
        scrollToSection(
          sections[currentIndex + 1].path,
          sections[currentIndex + 1].id
        )
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault()
        scrollToSection(
          sections[currentIndex - 1].path,
          sections[currentIndex - 1].id
        )
      }
    }

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [location.pathname, isScrolling, scrollToSection, sections])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuActive(false)
  }, [location.pathname])

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__container}>
        <a href="/" className={styles.navbar__logo} id={styles.navbar__logo}>
          PORTFOLIO
        </a>

        <div
          className={`${styles.navbar__toggle} ${
            isMobileMenuActive ? styles.active : ''
          }`}
          id={styles.mobileMenu}
          onClick={toggleMobileMenu}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>

        <ul
          className={`${styles.navbar__menu} ${
            isMobileMenuActive ? styles.active : ''
          }`}
        >
          {sections.map((section) => (
            <li key={section.id} className={styles.navbar__item}>
              <a
                href={section.path}
                className={`${styles.navbar__links} ${
                  location.pathname === section.path ? styles.highlight : ''
                }`}
                id={`${section.id}-page`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(section.path, section.id)
                }}
              >
                {section.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
