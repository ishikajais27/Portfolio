'use client'
import { useEffect, useRef } from 'react'
import styles from './AnimatedName.module.css'

const NAME = 'Ishika Jaiswal'
const SUBTITLE = 'Developer · Builder · Explorer'

export default function AnimatedName() {
  return (
    <div className={styles.nameContainer}>
      <h1 className={styles.name}>
        {NAME.split('').map((char, i) => (
          <span
            key={i}
            className={styles.letter}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      <p className={styles.subtitle}>{SUBTITLE}</p>
    </div>
  )
}
