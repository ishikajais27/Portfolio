// 'use client'
// import { useEffect } from 'react'
// import Header from '../components/Header/Header'
// import AnimatedImage from '../components/AnimatedImage'
// import LightEffect from '../components/LightEffect/LightEffect'
// import AnimatedName from '../components/AnimatedName/AnimatedName'
// import styles from './Home.module.css'

// export const Home = () => {
//   useEffect(() => {
//     document.body.style.cursor = 'default'
//     return () => {
//       document.body.style.cursor = ''
//     }
//   }, [])

//   return (
//     <div className={styles.home}>
//       <Header />
//       <div className={styles.mainContent}>
//         <div className={styles.nameWrapper}>
//           {' '}
//           {/* New wrapper for AnimatedName */}
//           <AnimatedName />
//         </div>
//         <div className={styles.imageWrapper}>
//           {' '}
//           {/* New wrapper for AnimatedImage */}
//           <AnimatedImage />
//         </div>
//       </div>
//       {/* <LightEffect /> */}
//     </div>
//   )
// }
'use client'
import { useEffect } from 'react'
import Header from '../components/Header/Header'
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
    <div className={styles.home}>
      <Header />
      <LightEffect />
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
