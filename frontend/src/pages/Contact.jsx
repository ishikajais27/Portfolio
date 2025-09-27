'use client'
import { useState } from 'react'
import Header from '../components/Header/Header'
import Cursor from '../components/Cursor/Cursor'
import AnimatedBackground from '../components/AnimatedBackground'
import styles from './Contact.module.css'
import MovingEyes from '../components/MovingEyes/MovingEyes'
import img1 from '../assets/linkedin.png'
import img2 from '../assets/git.png'
import img3 from '../assets/leet.png'

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [hoveredField, setHoveredField] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)

    try {
      const response = await fetch(
        'https://formsubmit.co/ajax/ishikajaiswal707@gmail.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            message: formData.message,
            _subject: 'New Contact Form Submission',
            _template: 'basic',
          }),
        }
      )

      const result = await response.json()
      if (result.success) {
        setIsSubmitted(true)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: '',
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    // <div className={styles.contact}>
    <div className={`${styles.contact} page-container page-transition`}>
      <Header />
      <MovingEyes />
      <AnimatedBackground />

      {/* Vertical Social Media Links on Top Left */}
      <div className={styles.verticalSocials}>
        <a
          href="https://github.com/ishikajais27"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className={styles.socialMediaImg} src={img2} alt="GitHub" />
        </a>
        <a
          href="https://www.linkedin.com/in/ishika-jaiswal-96b3b4284/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className={styles.socialMediaImg} src={img1} alt="LinkedIn" />
        </a>
        <a
          href="https://leetcode.com/u/ishikajais_27/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className={styles.socialMediaImg} src={img3} alt="LeetCode" />
        </a>
      </div>

      <main className={styles.main}>
        <div className={styles.title}>Contact me</div>
        <div className={styles.titleInfo}>I'll get back to you soon!</div>

        {isSubmitted ? (
          <div className={styles.successMessage}>
            <h3>Thank you for reaching out!</h3>
            <p>I'll connect with you soon.</p>
            <button
              className={styles.returnButton}
              onClick={() => setIsSubmitted(false)}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div
              className={styles.inputGroup}
              onMouseEnter={() => setHoveredField('firstName')}
              onMouseLeave={() => setHoveredField(null)}
              data-hovered={hoveredField === 'firstName'}
            >
              <input
                type="text"
                name="firstName"
                id="first-name"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <label htmlFor="first-name">First name</label>
              <div className={styles.fieldHoverEffect}></div>
            </div>

            <div
              className={styles.inputGroup}
              onMouseEnter={() => setHoveredField('lastName')}
              onMouseLeave={() => setHoveredField(null)}
              data-hovered={hoveredField === 'lastName'}
            >
              <input
                type="text"
                name="lastName"
                id="last-name"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <label htmlFor="last-name">Last name</label>
              <div className={styles.fieldHoverEffect}></div>
            </div>

            <div
              className={styles.inputGroup}
              onMouseEnter={() => setHoveredField('email')}
              onMouseLeave={() => setHoveredField(null)}
              data-hovered={hoveredField === 'email'}
            >
              <input
                type="email"
                name="email"
                id="e-mail"
                placeholder="e-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="e-mail">e-mail</label>
              <div className={styles.fieldHoverEffect}></div>
            </div>

            <div
              className={styles.textareaGroup}
              onMouseEnter={() => setHoveredField('message')}
              onMouseLeave={() => setHoveredField(null)}
              data-hovered={hoveredField === 'message'}
            >
              <textarea
                name="message"
                id="message"
                rows="5"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <label htmlFor="message">Message</label>
              <div className={styles.fieldHoverEffect}></div>
            </div>

            <div className={styles.buttonDiv}>
              <button
                type="submit"
                disabled={isSending}
                className={styles.submitButton}
              >
                {isSending ? (
                  <span className={styles.sendingText}>
                    <span className={styles.dot}>.</span>
                    <span className={styles.dot}>.</span>
                    <span className={styles.dot}>.</span>
                  </span>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
