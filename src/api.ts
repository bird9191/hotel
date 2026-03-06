import type { Room } from './data/rooms'

const BASE = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Ошибка ${res.status}`)
  }

  return res.json()
}

export function fetchRooms(): Promise<Room[]> {
  return request('/rooms')
}

export function fetchRoom(id: number): Promise<Room> {
  return request(`/rooms/${id}`)
}

export interface BookingRequest {
  roomId: number
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  totalPrice: number
  customerName: string
  customerPhone: string
  customerEmail: string
}

export interface BookingResponse {
  id: string
  room_id: number
  check_in: string
  check_out: string
  guests: number
  nights: number
  total_price: number
  customer_name: string
  customer_phone: string
  customer_email: string
  created_at: string
  room?: Room
}

export function createBooking(data: BookingRequest): Promise<BookingResponse> {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function fetchBooking(id: string): Promise<BookingResponse> {
  return request(`/bookings/${id}`)
}

export function checkAvailability(roomId: number, checkIn: string, checkOut: string): Promise<{ available: boolean }> {
  return request(`/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`)
}
