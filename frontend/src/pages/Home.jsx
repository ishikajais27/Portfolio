'use client'
import { useEffect } from 'react'
import AnimatedImage from '../components/AnimatedImage'
import LightEffect from '../components/LightEffect/LightEffect'
import AnimatedName from '../components/AnimatedName/AnimatedName'
import styles from './Home.module.css'

export const Home = () => {
  useEffect(() => {
    document.body.style.cursor = 'default'
    return () => {
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <div className={`${styles.home} page-container page-transition`}>
      {/* Remove <Header /> from here */}
      <LightEffect />
      <div className={styles.mainContent}>
        <div className={styles.nameWrapper}>
          <AnimatedName />
        </div>
        <div className={styles.imageWrapper}>
          <AnimatedImage />
        </div>
      </div>
      {/* <a
        href="https://drive.google.com/file/d/1z8TNfjCHJhdD_bHv9HXKZ9i7rTwb48Xk/view?usp=drive_link"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.resumeLink}
      >
        View My Resume
      </a> */}
      {/* <div className={styles.scrollIndicator}>
        <span>Scroll down</span>
        <div className={styles.arrow}></div>
      </div> */}
    </div>
  )
}
