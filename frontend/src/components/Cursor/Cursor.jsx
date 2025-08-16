// 'use client'

// import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
// import styles from './Cursor.module.css'
// import { gsap } from 'gsap'

// const Cursor = forwardRef((props, ref) => {
//   const cursorRef = useRef(null)
//   const followerRef = useRef(null)
//   const isHovering = useRef(false)

//   useImperativeHandle(ref, () => ({
//     updatePosition: (x, y) => {
//       gsap.set(cursorRef.current, { x, y })
//       if (!isHovering.current) {
//         gsap.to(followerRef.current, {
//           x,
//           y,
//           duration: 0.8,
//           ease: 'power3.out',
//         })
//       }
//     },
//     setHoverState: (hovering) => {
//       isHovering.current = hovering
//       gsap.to(followerRef.current, {
//         scale: hovering ? 2 : 1,
//         backgroundColor: hovering
//           ? 'rgba(98, 35, 71, 0.6)'
//           : 'rgba(103, 126, 138, 0.3)',
//         borderColor: hovering
//           ? 'rgba(224, 180, 178, 0.8)'
//           : 'rgba(168, 175, 229, 0.4)',
//         duration: 0.4,
//         ease: 'power2.out',
//       })

//       if (hovering) {
//         gsap.to(followerRef.current, {
//           scale: 2.2,
//           duration: 0.6,
//           yoyo: true,
//           repeat: -1,
//           ease: 'power2.inOut',
//         })
//       } else {
//         gsap.killTweensOf(followerRef.current)
//       }
//     },
//   }))

//   useEffect(() => {
//     gsap.set([cursorRef.current, followerRef.current], {
//       xPercent: -50,
//       yPercent: -50,
//     })

//     gsap.to(cursorRef.current, {
//       scale: 1.2,
//       duration: 2,
//       yoyo: true,
//       repeat: -1,
//       ease: 'power2.inOut',
//     })
//   }, [])

//   return (
//     <>
//       <div ref={cursorRef} className={styles.cursor} />
//       <div ref={followerRef} className={styles.cursorFollower} />
//     </>
//   )
// })

// Cursor.displayName = 'Cursor'
// export default Cursor
'use client'
import { forwardRef, useEffect, useImperativeHandle } from 'react'

const Cursor = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    updatePosition: () => {}, // Empty function to maintain compatibility
    setHoverState: (hovering) => {
      // Optional hover state changes
      document.body.style.cursor = hovering ? 'pointer' : 'default'
    },
  }))

  useEffect(() => {
    // Reset to default cursor on mount
    document.body.style.cursor = 'default'

    return () => {
      // Cleanup - restore browser default
      document.body.style.cursor = ''
    }
  }, [])

  // Return nothing - we're using native cursor
  return null
})

Cursor.displayName = 'Cursor'
export default Cursor
