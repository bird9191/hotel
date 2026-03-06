import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import type { Room } from '../data/rooms'
import { createBooking as apiCreateBooking, fetchBooking as apiFetchBooking, type BookingResponse } from '../api'

export interface BookingData {
  id: string
  room: Room
  checkIn: Date
  checkOut: Date
  guests: number
  nights: number
  totalPrice: number
  customerName: string
  customerPhone: string
  customerEmail: string
  createdAt: Date
}

interface BookingContextType {
  checkIn: Date
  checkOut: Date
  guests: number
  selectedRoom: Room | null
  nights: number
  setCheckIn: (date: Date) => void
  setCheckOut: (date: Date) => void
  setGuests: (n: number) => void
  selectRoom: (room: Room) => void
  clearRoom: () => void
  getTotalPrice: (room: Room) => number
  saveBooking: (data: Omit<BookingData, 'id' | 'createdAt'>) => Promise<BookingData>
  getBooking: (id: string) => Promise<BookingData | null>
}

const BookingContext = createContext<BookingContextType | null>(null)

function toBookingData(res: BookingResponse): BookingData | null {
  if (!res.room) return null
  return {
    id: res.id,
    room: res.room,
    checkIn: new Date(res.check_in),
    checkOut: new Date(res.check_out),
    guests: res.guests,
    nights: res.nights,
    totalPrice: res.total_price,
    customerName: res.customer_name,
    customerPhone: res.customer_phone,
    customerEmail: res.customer_email,
    createdAt: new Date(res.created_at),
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const [checkIn, setCheckInState] = useState<Date>(today)
  const [checkOut, setCheckOutState] = useState<Date>(tomorrow)
  const [guests, setGuestsState] = useState(2)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const nights = Math.max(1, differenceInCalendarDays(checkOut, checkIn))

  const setCheckIn = useCallback((date: Date) => {
    setCheckInState(date)
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    setCheckOutState(prev => (prev <= date ? nextDay : prev))
  }, [])

  const setCheckOut = useCallback((date: Date) => {
    setCheckOutState(date)
  }, [])

  const setGuests = useCallback((n: number) => {
    setGuestsState(Math.max(1, Math.min(4, n)))
  }, [])

  const selectRoom = useCallback((room: Room) => {
    setSelectedRoom(room)
  }, [])

  const clearRoom = useCallback(() => {
    setSelectedRoom(null)
  }, [])

  const getTotalPrice = useCallback((room: Room) => {
    return room.price * nights
  }, [nights])

  const saveBooking = useCallback(async (data: Omit<BookingData, 'id' | 'createdAt'>): Promise<BookingData> => {
    const res = await apiCreateBooking({
      roomId: data.room.id,
      checkIn: data.checkIn.toISOString(),
      checkOut: data.checkOut.toISOString(),
      guests: data.guests,
      nights: data.nights,
      totalPrice: data.totalPrice,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
    })

    return {
      ...data,
      id: res.id,
      createdAt: new Date(res.created_at),
    }
  }, [])

  const getBooking = useCallback(async (id: string): Promise<BookingData | null> => {
    try {
      const res = await apiFetchBooking(id)
      return toBookingData(res)
    } catch {
      return null
    }
  }, [])

  const value = useMemo(() => ({
    checkIn,
    checkOut,
    guests,
    selectedRoom,
    nights,
    setCheckIn,
    setCheckOut,
    setGuests,
    selectRoom,
    clearRoom,
    getTotalPrice,
    saveBooking,
    getBooking,
  }), [checkIn, checkOut, guests, selectedRoom, nights, setCheckIn, setCheckOut, setGuests, selectRoom, clearRoom, getTotalPrice, saveBooking, getBooking])

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking(): BookingContextType {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
