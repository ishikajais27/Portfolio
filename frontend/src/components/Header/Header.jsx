'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Header.module.css'
import { gsap } from 'gsap'
import Cursor from '../Cursor/Cursor' // Import the Cursor component

const Header = () => {
  const [activeLink, setActiveLink] = useState(null)
  const ctaRef = useRef(null)
  const navRef = useRef(null)
  const menuItems = ['Home', 'Blogs', 'Services', 'Contact', 'About']
  const cursorRef = useRef(null) // Reference for cursor control

  useEffect(() => {
    const nav = navRef.current
    const links = nav.querySelectorAll('li')

    gsap.fromTo(
      links,
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5,
      }
    )

    const mouseMoveHandlers = []
    const mouseLeaveHandlers = []

    links.forEach((link, index) => {
      const handleMouseMove = (e) => {
        const rect = link.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        gsap.to(link, {
          x: (x - rect.width / 2) * 0.2,
          y: (y - rect.height / 2) * 0.2,
          duration: 0.4,
          ease: 'power2.out',
        })

        if (cursorRef.current) {
          cursorRef.current.updatePosition(e.clientX, e.clientY)
        }
      }

      const handleMouseLeave = () => {
        gsap.to(link, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
        })
      }

      link.addEventListener('mousemove', handleMouseMove)
      link.addEventListener('mouseleave', handleMouseLeave)

      mouseMoveHandlers[index] = handleMouseMove
      mouseLeaveHandlers[index] = handleMouseLeave
    })

    const handleResize = () => {
      if (activeLink && ctaRef.current) {
        const { x, y, width, height } = activeLink.getBoundingClientRect()
        gsap.set(ctaRef.current, {
          left: x - width,
          top: y + height,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      links.forEach((link, index) => {
        link.removeEventListener('mousemove', mouseMoveHandlers[index])
        link.removeEventListener('mouseleave', mouseLeaveHandlers[index])
      })
    }
  }, [activeLink])

  return (
    <header className={styles.header}>
      <Cursor ref={cursorRef} /> {/* Integrated Cursor component */}
      <nav ref={navRef} className={styles.nav}>
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              onMouseEnter={() => {
                setActiveLink(document.getElementById(`link-${index}`))
                if (cursorRef.current) cursorRef.current.setHoverState(true)
              }}
              onMouseLeave={() => {
                setActiveLink(null)
                if (cursorRef.current) cursorRef.current.setHoverState(false)
              }}
              id={`link-${index}`}
            >
              {item}
            </li>
          ))}
        </ul>
        <div ref={ctaRef} className={styles.cta}></div>
      </nav>
    </header>
  )
}

export default Header
