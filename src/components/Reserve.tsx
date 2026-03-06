import { useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import DatePicker from './DatePicker'
import '../styles/Reserve.css'

interface ReserveProps {
  scrolled?: boolean
}

const Reserve = ({ scrolled = false }: ReserveProps) => {
  const { checkIn, checkOut, guests, setCheckIn, setCheckOut, setGuests } = useBooking()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const navigate = useNavigate()

  const handleCheckAvailability = () => {
    navigate('/#rooms')
  }

  const handleDateConfirm = (newCheckIn: Date, newCheckOut: Date) => {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
    setIsDatePickerOpen(false)
  }

  const formatDateDisplay = (date: Date) => {
    const day = format(date, 'd', { locale: ru })
    const monthShort = format(date, 'MMM', { locale: ru }).toUpperCase()
    const weekday = format(date, 'EEE', { locale: ru }).toUpperCase()
    return (
      <span className="date-display">
        <span className="date-day">{day}</span>
        <span className="date-meta">
          <span className="date-month">{monthShort}</span>
          <span className="date-weekday">{weekday}</span>
        </span>
      </span>
    )
  }

  return (
    <>
      <div className={`reserve ${scrolled ? 'reserve-top' : ''}`}>
        <div className="reserve-inner">
          <div className="reserve-hotel">
            <span
              className="reserve-name"
              role="button"
              tabIndex={0}
              onClick={() => {
                navigate('/')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              Dune Hotel
            </span>
            <a
              href="https://yandex.ru/maps/-/CHEFbQ~r"
              target="_blank"
              rel="noopener noreferrer"
              className="reserve-address"
            >
              г. Грозный, Чеченская Республика ↗
            </a>
          </div>

          <div className="reserve-separator" />

          <div className="reserve-fields">
            <div className="dates-box" onClick={() => setIsDatePickerOpen(true)}>
              <div className="dates-box-item">
                <button className="date-trigger" type="button">
                  {formatDateDisplay(checkIn)}
                </button>
              </div>
              <div className="dates-box-divider" />
              <div className="dates-box-item">
                <button className="date-trigger" type="button">
                  {formatDateDisplay(checkOut)}
                </button>
              </div>
            </div>

            <div className="reserve-guests">
              <button className="guest-btn" type="button" onClick={() => setGuests(guests - 1)}>−</button>
              <span className="guest-label">1 номер, {guests} гост.</span>
              <button className="guest-btn" type="button" onClick={() => setGuests(guests + 1)}>+</button>
            </div>
            <button className="reserve-cta" onClick={handleCheckAvailability}>
              Проверить наличие
            </button>
          </div>
        </div>
      </div>

      <DatePicker
        isOpen={isDatePickerOpen}
        checkIn={checkIn}
        checkOut={checkOut}
        onConfirm={handleDateConfirm}
        onClose={() => setIsDatePickerOpen(false)}
      />
    </>
  )
}

export default Reserve
