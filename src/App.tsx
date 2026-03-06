import { useState, useEffect, type CSSProperties } from 'react'
import { Routes, Route } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import Splash from './components/Splash'
import HomePage from './pages/HomePage'
import RoomDetailsPage from './pages/RoomDetailsPage'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'

const rootStyle: CSSProperties = { width: '100%', minHeight: '100vh' }

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <BookingProvider>
      <div style={rootStyle}>
        <Splash />
        <Routes>
          <Route path="/" element={<HomePage scrolled={scrolled} />} />
          <Route path="/room/:id" element={<RoomDetailsPage scrolled={scrolled} />} />
          <Route path="/booking" element={<BookingPage scrolled={scrolled} />} />
          <Route path="/confirmation" element={<ConfirmationPage scrolled={scrolled} />} />
        </Routes>
      </div>
    </BookingProvider>
  )
}

export default App
