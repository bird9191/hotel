import { useEffect, useState } from 'react'
import '../styles/Splash.css'

const Splash = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img src="/logo.png" alt="Hotel Dune" className="loading-logo" />
      </div>
    </div>
  )
}

export default Splash
