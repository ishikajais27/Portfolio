'use client'
import { useEffect, useRef } from 'react'
import styles from './MovingEyes.module.css'

// Offset of length min(distance, max) pointing from (0,0) towards (dx, dy)
const offsetToward = (dx, dy, max) => {
  const distance = Math.min(Math.hypot(dx, dy), max)
  const angle = Math.atan2(dy, dx)
  return [Math.cos(angle) * distance, Math.sin(angle) * distance]
}

const MovingEyes = () => {
  const eye1Ref = useRef(null)
  const pupil1Ref = useRef(null)
  const inside1Ref = useRef(null)
  const eye2Ref = useRef(null)
  const pupil2Ref = useRef(null)
  const inside2Ref = useRef(null)

  useEffect(() => {
    const eyes = [
      [eye1Ref.current, pupil1Ref.current, inside1Ref.current],
      [eye2Ref.current, pupil2Ref.current, inside2Ref.current],
    ].filter((parts) => parts.every(Boolean))

    let mouseX = 0
    let mouseY = 0
    let frame = 0

    const update = () => {
      frame = 0

      // 1) read layout for every eye first...
      const moves = eyes.map(([eye, pupil, inside]) => {
        if (!eye.offsetWidth) return null // hidden (small screens)
        const eyeRect = eye.getBoundingClientRect()
        const pupilRect = pupil.getBoundingClientRect()

        const [pupilX, pupilY] = offsetToward(
          mouseX - (eyeRect.left + eye.offsetWidth / 2),
          mouseY - (eyeRect.top + eye.offsetHeight / 2),
          eye.offsetWidth / 2 - pupil.offsetWidth / 2,
        )
        const [insideX, insideY] = offsetToward(
          mouseX - (pupilRect.left + pupil.offsetWidth / 2),
          mouseY - (pupilRect.top + pupil.offsetHeight / 2),
          pupil.offsetWidth / 2 - inside.offsetWidth / 2,
        )
        return { pupil, inside, pupilX, pupilY, insideX, insideY }
      })

      // 2) ...then write, so the browser never lays out twice per frame
      moves.forEach((m) => {
        if (!m) return
        m.pupil.style.transform = `translate(${m.pupilX}px, ${m.pupilY}px)`
        m.inside.style.transform = `translate(${m.insideX}px, ${m.insideY}px)`
      })
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!frame) frame = requestAnimationFrame(update)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className={styles.eyesContainer}>
      <div className={styles.eye} ref={eye1Ref}>
        <div className={styles.pupil} ref={pupil1Ref}>
          <div className={styles.inside} ref={inside1Ref}></div>
        </div>
      </div>
      <div className={styles.eye} ref={eye2Ref}>
        <div className={styles.pupil} ref={pupil2Ref}>
          <div className={styles.inside} ref={inside2Ref}></div>
        </div>
      </div>
    </div>
  )
}

export default MovingEyes
