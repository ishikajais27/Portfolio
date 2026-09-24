'use client'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './SmoothScrollNavigator.module.css'

const sections = [
  { id: 'home', name: 'Home', path: '/' },
  { id: 'about', name: 'About', path: '/about' },
  { id: 'work', name: 'Work', path: '/work' },
  { id: 'contact', name: 'Contact', path: '/contact' },
]

export const SmoothScrollNavigator = () => {
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // SinglePage owns all scrolling; changing the URL is enough to move there.
  const goTo = (path) => {
    setIsMobileMenuActive(false)
    if (path !== location.pathname) navigate(path)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuActive(!isMobileMenuActive)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuActive(false)
  }, [location.pathname])

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__container}>
        {/* Link instead of <a href> so the logo doesn't reload the app (and replay the loader) */}
        <Link to="/" className={styles.navbar__logo} id={styles.navbar__logo}>
          PORTFOLIO
        </Link>

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
                  goTo(section.path)
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
