'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Header.module.css'
import { gsap } from 'gsap'
import Cursor from '../Cursor/Cursor'
import { Link, useLocation } from 'react-router-dom'
import AnimatedName from '../AnimatedName/AnimatedName'
import AnimatedImage from '../AnimatedImage'
import AnimatedBackground from '../AnimatedBackground'
import MovingEyes from '../MovingEyes/MovingEyes'

const Header = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const containerRef = useRef(null)
  const cursorRef = useRef(null)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Work', path: '/work' },
    { name: 'Contact', path: '/contact' },
  ]

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive)
    if (containerRef.current) {
      containerRef.current.classList.toggle(styles.active)
    }
  }

  const handleLinkClick = (path) => {
    // Close menu when navigating
    setIsMenuActive(false)
    if (containerRef.current) {
      containerRef.current.classList.remove(styles.active)
    }
  }

  useEffect(() => {
    // Reset menu state when location changes
    setIsMenuActive(false)
    if (containerRef.current) {
      containerRef.current.classList.remove(styles.active)
    }
  }, [location.pathname])

  useEffect(() => {
    // Any additional setup can go here
    return () => {
      // Cleanup
    }
  }, [])

  // If not on home page, render floating hamburger and 3D overlay menu
  if (!isHomePage) {
    return (
      <>
        <Cursor ref={cursorRef} />

        {/* Floating Hamburger */}
        <div className={styles.floatingHamburger} onClick={toggleMenu}>
          <div
            className={`${styles.bar} ${isMenuActive ? styles.activeBar : ''}`}
          ></div>
        </div>

        {/* 3D Menu Container with AnimatedBackground */}
        {isMenuActive && (
          <div
            ref={containerRef}
            className={`${styles.container} ${styles.active}`}
          >
            {/* Add AnimatedBackground to the menu overlay */}
            <AnimatedBackground />

            {/* Main container with 3D content */}
            <div className={styles.mainContainer}>
              <div className={styles.main}>
                <header>
                  <div className={styles.overlay}>
                    <div className={styles.mainContent}>
                      {/* Page-specific content based on current route */}
                      {location.pathname === '/about' && (
                        <>
                          <div className={styles.nameWrapper}>
                            <div className={styles.pageContent}>
                              <h1 className={styles.pageTitle}>About Me</h1>
                              <p className={styles.pageDescription}>
                                Discover my journey, skills, and passion for
                                creating amazing experiences.
                              </p>
                            </div>
                          </div>
                          <div className={styles.imageWrapper}>
                            <MovingEyes />
                          </div>
                        </>
                      )}

                      {location.pathname === '/work' && (
                        <>
                          <div className={styles.nameWrapper}>
                            <div className={styles.pageContent}>
                              <h1 className={styles.pageTitle}>My Work</h1>
                              <p className={styles.pageDescription}>
                                Explore my portfolio of projects and creative
                                solutions.
                              </p>
                            </div>
                          </div>
                          <div className={styles.imageWrapper}>
                            <MovingEyes />
                          </div>
                        </>
                      )}

                      {location.pathname === '/contact' && (
                        <>
                          <div className={styles.nameWrapper}>
                            <div className={styles.pageContent}>
                              <h1 className={styles.pageTitle}>Contact Me</h1>
                              <p className={styles.pageDescription}>
                                Let's connect and discuss your next project or
                                collaboration.
                              </p>
                            </div>
                          </div>
                          <div className={styles.imageWrapper}>
                            <MovingEyes />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </header>
              </div>

              {/* Shadow layers */}
              <div className={`${styles.shadow} ${styles.one}`}></div>
              <div className={`${styles.shadow} ${styles.two}`}></div>
            </div>

            {/* Side navigation links */}
            <div className={styles.links}>
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      style={{ '--i': `${0.05 + index * 0.05}s` }}
                      onClick={() => handleLinkClick(item.path)}
                      className={styles.overlayLink}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </>
    )
  }

  // Home page - render full 3D header interface
  return (
    <>
      <Cursor ref={cursorRef} />

      <div ref={containerRef} className={styles.container}>
        {/* Navbar with hamburger */}
        <div className={styles.navbar}>
          <div className={styles.menu}>
            <h3 className={styles.logo}>
              Your<span>Portfolio</span>
            </h3>
            <div className={styles.hamburgerMenu} onClick={toggleMenu}>
              <div className={styles.bar}></div>
            </div>
          </div>
        </div>

        {/* Add AnimatedBackground to home page menu overlay when active */}
        {isMenuActive && (
          <div>
            <AnimatedBackground />
            <MovingEyes />
          </div>
        )}

        {/* Main container with 3D content */}
        <div className={styles.mainContainer}>
          <div className={styles.main}>
            <header>
              <div className={styles.overlay}>
                <div className={styles.mainContent}>
                  <div className={styles.nameWrapper}>
                    <AnimatedName />
                  </div>
                  <div className={styles.imageWrapper}>
                    <AnimatedImage />
                  </div>
                </div>
              </div>
            </header>
          </div>

          {/* Shadow layers */}
          <div className={`${styles.shadow} ${styles.one}`}></div>
          <div className={`${styles.shadow} ${styles.two}`}></div>
        </div>

        {/* Side navigation links */}
        <div className={styles.links}>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  style={{ '--i': `${0.05 + index * 0.05}s` }}
                  onClick={() => handleLinkClick(item.path)}
                  className={styles.overlayLink}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Header
