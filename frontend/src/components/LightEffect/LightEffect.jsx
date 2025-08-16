// 'use client'
// import { useEffect, useRef } from 'react'
// import styles from './LightEffect.module.css'

// const LightEffect = () => {
//   const lightRef = useRef(null)

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (lightRef.current) {
//         lightRef.current.style.setProperty('--x', `${e.clientX}px`)
//         lightRef.current.style.setProperty('--y', `${e.clientY}px`)
//       }
//     }

//     window.addEventListener('mousemove', handleMouseMove)

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove)
//     }
//   }, [])

//   return <div ref={lightRef} className={styles.lightOverlay}></div>
// }

// export default LightEffect
'use client'
import { useEffect, useRef } from 'react'
import styles from './LightEffect.module.css'

const LightEffect = () => {
  const lightRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (lightRef.current) {
        lightRef.current.style.setProperty('--x', `${e.clientX}px`)
        lightRef.current.style.setProperty('--y', `${e.clientY}px`)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return <div ref={lightRef} className={styles.lightOverlay}></div>
}

export default LightEffect
