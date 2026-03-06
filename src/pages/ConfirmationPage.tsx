import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import Navigation from '../components/Navigation'
import Reserve from '../components/Reserve'
import { useBooking, type BookingData } from '../context/BookingContext'
import '../styles/ConfirmationPage.css'

interface ConfirmationPageProps {
  scrolled: boolean
}

const ConfirmationPage = ({ scrolled }: ConfirmationPageProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getBooking, clearRoom } = useBooking()
  const [booking, setBooking] = useState<BookingData | null>(null)

  const state = location.state as Record<string, unknown> | null
  const bookingId = typeof state?.bookingId === 'string' ? state.bookingId : null

  useEffect(() => {
    if (!bookingId) {
      navigate('/')
      return
    }

    let cancelled = false

    getBooking(bookingId).then(found => {
      if (cancelled) return
      if (found) {
        setBooking(found)
        clearRoom()
      } else {
        navigate('/')
      }
    })

    return () => { cancelled = true }
  }, [bookingId, getBooking, clearRoom, navigate])

  if (!booking) return null

  const formatDate = (date: Date) => format(date, 'd MMMM yyyy, EEEE', { locale: ru })

  return (
    <>
      <Navigation scrolled={scrolled} />
      <Reserve scrolled={scrolled} />

      <div className="confirmation-page">
        <div className="confirmation-container">
          <div className="confirmation-card">
            <div className="confirmation-icon">✦</div>
            <h1 className="confirmation-title">Бронирование подтверждено</h1>
            <p className="confirmation-subtitle">Спасибо! Ваше бронирование успешно оформлено.</p>

            <div className="booking-id-block">
              <span className="booking-id-label">Номер бронирования</span>
              <span className="booking-id-value">{booking.id}</span>
            </div>

            <div className="confirmation-details">
              <div className="conf-section">
                <h3>Номер</h3>
                <div className="conf-room-row">
                  <img src={booking.room.images[0]} alt={booking.room.title} className="conf-room-img" />
                  <div>
                    <span className="conf-room-name">{booking.room.title}</span>
                    <span className="conf-room-area">{booking.room.area}</span>
                  </div>
                </div>
              </div>

              <div className="conf-section">
                <h3>Даты проживания</h3>
                <div className="conf-row">
                  <span className="conf-label">Заселение</span>
                  <span className="conf-value">{formatDate(booking.checkIn)}, с 14:00</span>
                </div>
                <div className="conf-row">
                  <span className="conf-label">Выезд</span>
                  <span className="conf-value">{formatDate(booking.checkOut)}, до 12:00</span>
                </div>
                <div className="conf-row">
                  <span className="conf-label">Ночей</span>
                  <span className="conf-value">{booking.nights}</span>
                </div>
                <div className="conf-row">
                  <span className="conf-label">Гостей</span>
                  <span className="conf-value">{booking.guests}</span>
                </div>
              </div>

              <div className="conf-section">
                <h3>Гость</h3>
                <div className="conf-row">
                  <span className="conf-label">Имя</span>
                  <span className="conf-value">{booking.customerName}</span>
                </div>
                <div className="conf-row">
                  <span className="conf-label">Телефон</span>
                  <span className="conf-value">{booking.customerPhone}</span>
                </div>
                <div className="conf-row">
                  <span className="conf-label">Email</span>
                  <span className="conf-value">{booking.customerEmail}</span>
                </div>
              </div>

              <div className="conf-total">
                <span>Итого оплата</span>
                <span className="conf-total-price">{booking.totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <button className="conf-home-btn" onClick={() => navigate('/')}>
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmationPage
