import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useBooking } from '../context/BookingContext'
import '../styles/RoomCard.css'

interface RoomCardProps {
  image: string
  title: string
  description: string
  roomId: number
  pricePerNight: number
}

const RoomCard = ({ image, title, description, roomId, pricePerNight }: RoomCardProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { nights } = useBooking()

  const totalPrice = pricePerNight * nights

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )

    const currentCard = cardRef.current
    if (currentCard) observer.observe(currentCard)

    return () => {
      if (currentCard) observer.unobserve(currentCard)
    }
  }, [])

  return (
    <Link to={`/room/${roomId}`} className="room-card-link">
      <div ref={cardRef} className={`room-card ${isVisible ? 'visible' : ''}`}>
        <div className="room-image">
          <img src={image} alt={title} />
        </div>
        <div className="room-info">
          <h3 className="room-title">{title}</h3>
          <p className="room-description">{description}</p>

          <div className="room-pricing">
            <div className="room-price-per-night">
              <span className="price-amount">{pricePerNight.toLocaleString('ru-RU')} ₽</span>
              <span className="price-label">/ ночь</span>
            </div>
            <div className="room-price-total">
              <span className="total-amount">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              <span className="total-label">за {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}</span>
            </div>
          </div>

          <div className="room-actions">
            <button className="book-room-btn">Забронировать</button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RoomCard
