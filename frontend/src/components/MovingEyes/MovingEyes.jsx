'use client'
import { useEffect, useRef } from 'react'
import styles from './MovingEyes.module.css'

const MovingEyes = () => {
  const eye1Ref = useRef(null)
  const pupil1Ref = useRef(null)
  const inside1Ref = useRef(null)
  const eye2Ref = useRef(null)
  const pupil2Ref = useRef(null)
  const inside2Ref = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX
      const mouseY = e.clientY

      // First Eye
      if (eye1Ref.current && pupil1Ref.current && inside1Ref.current) {
        const eye = eye1Ref.current
        const pupil = pupil1Ref.current
        const inside = inside1Ref.current

        const eyeX = eye.getBoundingClientRect().left + eye.offsetWidth / 2
        const eyeY = eye.getBoundingClientRect().top + eye.offsetHeight / 2

        const deltaX = mouseX - eyeX
        const deltaY = mouseY - eyeY

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
        const maxDistance = eye.offsetWidth / 2 - pupil.offsetWidth / 2

        const angle = Math.atan2(deltaY, deltaX)

        const pupilX = Math.cos(angle) * Math.min(distance, maxDistance)
        const pupilY = Math.sin(angle) * Math.min(distance, maxDistance)

        pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`

        // Inner pupil movement
        const pupilCenterX =
          pupil.getBoundingClientRect().left + pupil.offsetWidth / 2
        const pupilCenterY =
          pupil.getBoundingClientRect().top + pupil.offsetHeight / 2

        const innerDeltaX = mouseX - pupilCenterX
        const innerDeltaY = mouseY - pupilCenterY

        const innerDistance = Math.sqrt(innerDeltaX ** 2 + innerDeltaY ** 2)
        const innerMaxDistance = pupil.offsetWidth / 2 - inside.offsetWidth / 2

        const innerAngle = Math.atan2(innerDeltaY, innerDeltaX)

        const innerPupilX =
          Math.cos(innerAngle) * Math.min(innerDistance, innerMaxDistance)
        const innerPupilY =
          Math.sin(innerAngle) * Math.min(innerDistance, innerMaxDistance)

        inside.style.transform = `translate(${innerPupilX}px, ${innerPupilY}px)`
      }

      // Second Eye
      if (eye2Ref.current && pupil2Ref.current && inside2Ref.current) {
        const eye = eye2Ref.current
        const pupil = pupil2Ref.current
        const inside = inside2Ref.current

        const eyeX = eye.getBoundingClientRect().left + eye.offsetWidth / 2
        const eyeY = eye.getBoundingClientRect().top + eye.offsetHeight / 2

        const deltaX = mouseX - eyeX
        const deltaY = mouseY - eyeY

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
        const maxDistance = eye.offsetWidth / 2 - pupil.offsetWidth / 2

        const angle = Math.atan2(deltaY, deltaX)

        const pupilX = Math.cos(angle) * Math.min(distance, maxDistance)
        const pupilY = Math.sin(angle) * Math.min(distance, maxDistance)

        pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`

        // Inner pupil movement
        const pupilCenterX =
          pupil.getBoundingClientRect().left + pupil.offsetWidth / 2
        const pupilCenterY =
          pupil.getBoundingClientRect().top + pupil.offsetHeight / 2

        const innerDeltaX = mouseX - pupilCenterX
        const innerDeltaY = mouseY - pupilCenterY

        const innerDistance = Math.sqrt(innerDeltaX ** 2 + innerDeltaY ** 2)
        const innerMaxDistance = pupil.offsetWidth / 2 - inside.offsetWidth / 2

        const innerAngle = Math.atan2(innerDeltaY, innerDeltaX)

        const innerPupilX =
          Math.cos(innerAngle) * Math.min(innerDistance, innerMaxDistance)
        const innerPupilY =
          Math.sin(innerAngle) * Math.min(innerDistance, innerMaxDistance)

        inside.style.transform = `translate(${innerPupilX}px, ${innerPupilY}px)`
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
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
