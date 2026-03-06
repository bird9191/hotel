import { useState, useEffect } from 'react'
import '../styles/BackToTop.css'

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={goUp}
      aria-label="Наверх"
    >
      ↑
    </button>
  )
}

export default BackToTop
