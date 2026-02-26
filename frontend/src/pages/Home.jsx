'use client'
import { useEffect, useState } from 'react'
import AnimatedImage from '../components/AnimatedImage'
import LightEffect from '../components/LightEffect/LightEffect'
import AnimatedName from '../components/AnimatedName/AnimatedName'
import styles from './Home.module.css'

export const Home = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    document.body.style.cursor = 'default'
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <div className={`${styles.home} page-container page-transition`}>
      {!isMobile && <LightEffect />}
      <div className={styles.mainContent}>
        <div className={styles.nameWrapper}>
          <AnimatedName />
        </div>
        <div className={styles.imageWrapper}>
          <AnimatedImage />
        </div>
      </div>
    </div>
  )
}
