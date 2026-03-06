import { useEffect, useRef, useState } from 'react'
import RoomCard from './RoomCard'
import { rooms } from '../data/rooms'
import { useBooking } from '../context/BookingContext'
import '../styles/Rooms.css'

const Rooms = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { nights } = useBooking()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    const currentSection = sectionRef.current
    if (currentSection) observer.observe(currentSection)

    return () => {
      if (currentSection) observer.unobserve(currentSection)
    }
  }, [])

  return (
    <section ref={sectionRef} className={`rooms-section ${isVisible ? 'visible' : ''}`} id="rooms">
      <div className="rooms-container">
        <h2 className="rooms-title">Наши номера</h2>
        <p className="rooms-subtitle">
          {nights === 1 ? '1 ночь' : `${nights} ${nights < 5 ? 'ночи' : 'ночей'}`} — выберите номер
        </p>
        <div className="rooms-grid">
          {rooms.map((room, index) => (
            <div key={room.id} style={{ animationDelay: `${index * 0.2}s` }}>
              <RoomCard
                image={room.images[0]}
                title={room.title}
                description={room.description}
                roomId={room.id}
                pricePerNight={room.price}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Rooms
