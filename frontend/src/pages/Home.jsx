'use client'
import { useEffect } from 'react'
import Header from '../components/Header/Header'
import Cursor from '../components/Cursor/Cursor' // Keep import for compatibility
import LightEffect from '../components/LightEffect/LightEffect'
import CanvasBackground from '../components/CanvasBackground/CanvasBackground'
import AnimatedName from '../components/AnimatedName/AnimatedName'
import styles from './Home.module.css'

const Home = () => {
  // Empty useEffect just for cleanup
  useEffect(() => {
    return () => {
      document.body.style.cursor = '' // Reset cursor on unmount
    }
  }, [])

  return (
    <div className={styles.home}>
      <CanvasBackground />
      <Cursor />
      <Header />
      <AnimatedName />
      <LightEffect />
    </div>
  )
}

export default Home
