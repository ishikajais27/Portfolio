// 'use client'
// import { useEffect } from 'react'
// import Header from '../components/Header/Header'
// import Cursor from '../components/Cursor/Cursor'
// import LightEffect from '../components/LightEffect/LightEffect'
// import CanvasBackground from '../components/CanvasBackground/CanvasBackground'
// import AnimatedName from '../components/AnimatedName/AnimatedName'
// import styles from './Home.module.css'

// const Home = () => {
//   useEffect(() => {
//     // Remove cursor: none from body to show default cursor
//     document.body.style.cursor = 'default'

//     return () => {
//       document.body.style.cursor = '' // Reset cursor on unmount
//     }
//   }, [])

//   return (
//     <div className={styles.home}>
//       <CanvasBackground />
//       <Header />
//       <AnimatedName />
//       <LightEffect />
//     </div>
//   )
// }

// export default Home
'use client'
import { useEffect } from 'react'
import Header from '../components/Header/Header'
import Cursor from '../components/Cursor/Cursor'
import LightEffect from '../components/LightEffect/LightEffect'
import CanvasBackground from '../components/CanvasBackground/CanvasBackground'
import AnimatedName from '../components/AnimatedName/AnimatedName'
import MovingEyes from '../components/MovingEyes/MovingEyes'
import styles from './Home.module.css'

export const Home = () => {
  useEffect(() => {
    // Remove cursor: none from body to show default cursor
    document.body.style.cursor = 'default'

    return () => {
      document.body.style.cursor = '' // Reset cursor on unmount
    }
  }, [])

  return (
    <div className={styles.home}>
      <CanvasBackground />
      <Header />
      <AnimatedName />
      <MovingEyes />
      <LightEffect />
    </div>
  )
}
