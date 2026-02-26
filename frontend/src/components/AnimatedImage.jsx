
'use client'
import { useRef, useState } from 'react'
import styles from './AnimatedImage.module.css'
import profileImage from '../assets/img2.png'

const AnimatedImage = () => {
  const imageRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.animatedImage}
        ref={imageRef}
        style={{
          backgroundImage: `url(${profileImage})`,
          '--mouse-x': `${mousePos.x}%`,
          '--mouse-y': `${mousePos.y}%`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 50, y: 50 })}
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
