import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Reserve from '../components/Reserve'
import BackToTop from '../components/BackToTop'
import { getRoomById } from '../data/rooms'
import { useBooking } from '../context/BookingContext'
import '../styles/RoomDetailsPage.css'

interface RoomDetailsPageProps {
  scrolled: boolean
}

const RoomDetailsPage = ({ scrolled }: RoomDetailsPageProps) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mainImage, setMainImage] = useState(0)
  const { nights, getTotalPrice, selectRoom } = useBooking()

  const room = getRoomById(Number(id))

  if (!room) {
    return (
      <>
        <Navigation scrolled={scrolled} />
        <Reserve scrolled={scrolled} />
        <div className="room-details-page">
          <div className="room-details-container">
            <div className="room-not-found">
              <h2>Номер не найден</h2>
              <button className="back-btn" onClick={() => navigate('/')}>← На главную</button>
            </div>
          </div>
        </div>
        <BackToTop />
      </>
    )
  }

  const totalPrice = getTotalPrice(room)

  const handleBookRoom = () => {
    selectRoom(room)
    navigate('/booking')
  }

  return (
    <>
      <Navigation scrolled={scrolled} />
      <Reserve scrolled={scrolled} />

      <div className="room-details-page">
        <div className="room-details-container">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Назад к номерам
          </button>

          <div className="room-details-content">
            <div className="room-gallery">
              <div className="main-image">
                <img src={room.images[mainImage]} alt={room.title} />
              </div>
              <div className="thumbnail-grid">
                {room.images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === mainImage ? 'active' : ''}`}
                    onClick={() => setMainImage(index)}
                  >
                    <img src={img} alt={`${room.title} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="room-details-info">
              <h1 className="room-details-title">{room.title}</h1>
              <p className="room-details-description">{room.description}</p>

              <div className="room-specs">
                <div className="spec-item">
                  <span className="spec-label">Площадь</span>
                  <span className="spec-value">{room.area}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Кровати</span>
                  <span className="spec-value">{room.beds}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Гости</span>
                  <span className="spec-value">{room.guests}</span>
                </div>
              </div>

              <div className="room-price-block">
                <div className="room-price-row">
                  <span className="room-price-main">{room.price.toLocaleString('ru-RU')} ₽</span>
                  <span className="room-price-per">/ ночь</span>
                </div>
                <div className="room-price-total-row">
                  <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                  <span className="room-price-nights">
                    за {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
                  </span>
                </div>
              </div>

              <div className="room-features-section">
                <h3>Удобства номера</h3>
                <ul className="room-features-list">
                  {room.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <button className="book-this-room-btn" onClick={handleBookRoom}>
                Забронировать за {totalPrice.toLocaleString('ru-RU')} ₽
              </button>
            </div>
          </div>
        </div>
      </div>

      <BackToTop />
    </>
  )
}

export default RoomDetailsPage
