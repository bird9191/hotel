import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import Navigation from '../components/Navigation'
import Reserve from '../components/Reserve'
import { useBooking } from '../context/BookingContext'
import '../styles/BookingPage.css'

const bookingSchema = z.object({
  name: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(100, 'Максимум 100 символов')
    .regex(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Только буквы, пробелы и дефис'),
  phone: z
    .string()
    .min(10, 'Введите корректный номер')
    .max(18, 'Слишком длинный номер')
    .regex(/^[\d\s+()-]+$/, 'Некорректный формат телефона'),
  email: z
    .string()
    .email('Введите корректный email'),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingPageProps {
  scrolled: boolean
}

const BookingPage = ({ scrolled }: BookingPageProps) => {
  const navigate = useNavigate()
  const { selectedRoom, checkIn, checkOut, guests, nights, getTotalPrice, saveBooking } = useBooking()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!selectedRoom) {
      navigate('/')
    }
  }, [selectedRoom, navigate])

  if (!selectedRoom) return null

  const totalPrice = getTotalPrice(selectedRoom)

  const formatDate = (date: Date) => format(date, 'd MMMM yyyy', { locale: ru })

  const onSubmit = async (data: BookingFormData) => {
    try {
      const booking = await saveBooking({
        room: selectedRoom,
        checkIn,
        checkOut,
        guests,
        nights,
        totalPrice,
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email,
      })

      navigate('/confirmation', { state: { bookingId: booking.id } })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при бронировании')
    }
  }

  return (
    <>
      <Navigation scrolled={scrolled} />
      <Reserve scrolled={scrolled} />

      <div className="booking-page">
        <div className="booking-page-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Назад
          </button>

          <h1 className="booking-page-title">Оформление бронирования</h1>

          <div className="booking-page-content">
            <div className="booking-summary">
              <div className="summary-image">
                <img src={selectedRoom.images[0]} alt={selectedRoom.title} />
              </div>

              <div className="summary-details">
                <h2 className="summary-room-title">{selectedRoom.title}</h2>

                <div className="summary-rows">
                  <div className="summary-row">
                    <span className="summary-label">Заселение</span>
                    <span className="summary-value">{formatDate(checkIn)}, с 14:00</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Выезд</span>
                    <span className="summary-value">{formatDate(checkOut)}, до 12:00</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Ночей</span>
                    <span className="summary-value">{nights}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Гостей</span>
                    <span className="summary-value">{guests}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Цена за ночь</span>
                    <span className="summary-value">{selectedRoom.price.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>

                <div className="summary-total">
                  <span className="summary-total-label">Итого</span>
                  <span className="summary-total-amount">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <h2 className="form-title">Данные гостя</h2>

              <div className="form-field">
                <label htmlFor="name">Имя и фамилия</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Иван Иванов"
                  autoComplete="name"
                  {...register('name')}
                  className={errors.name ? 'field-error' : ''}
                />
                {errors.name && <span className="error-msg">{errors.name.message}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="phone">Телефон</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  autoComplete="tel"
                  {...register('phone')}
                  className={errors.phone ? 'field-error' : ''}
                />
                {errors.phone && <span className="error-msg">{errors.phone.message}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="ivan@example.com"
                  autoComplete="email"
                  {...register('email')}
                  className={errors.email ? 'field-error' : ''}
                />
                {errors.email && <span className="error-msg">{errors.email.message}</span>}
              </div>

              <button type="submit" className="submit-booking-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Обработка...' : `Подтвердить бронирование — ${totalPrice.toLocaleString('ru-RU')} ₽`}
              </button>

              <p className="form-disclaimer">
                Нажимая кнопку, вы соглашаетесь с условиями бронирования и политикой конфиденциальности отеля DUNE.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookingPage
