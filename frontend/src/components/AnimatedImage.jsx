'use client'
import { useEffect, useRef } from 'react'
import styles from './AnimatedImage.module.css'
import profileImage from '../assets/img2.png'

const AnimatedImage = () => {
  const imageRef = useRef(null)
  const pos = useRef({ x: 50, y: 50 })
  const frame = useRef(0)

  const apply = () => {
    frame.current = 0
    const el = imageRef.current
    if (!el) return
    el.style.setProperty('--mouse-x', `${pos.current.x}%`)
    el.style.setProperty('--mouse-y', `${pos.current.y}%`)
  }

  const update = (x, y) => {
    pos.current = { x, y }
    if (!frame.current) frame.current = requestAnimationFrame(apply)
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    update(
      ((e.clientX - rect.left) / rect.width) * 100,
      ((e.clientY - rect.top) / rect.height) * 100,
    )
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.animatedImage}
        ref={imageRef}
        style={{ backgroundImage: `url(${profileImage})` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => update(50, 50)}
      >
        <div className={styles['water-distortion']} />
        <div className={styles['dark-overlay']} />
        <div className={styles['name-overlay']} data-name="Ishika">
          Ishika
        </div>
      </div>
    </div>
  )
}

export default AnimatedImage
