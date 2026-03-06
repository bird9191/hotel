import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001

app.use(cors())
app.use(express.json())

// ── Rooms ──────────────────────────────────────────────

interface RoomRow {
  id: number
  type: string
  title: string
  description: string
  area: string
  beds: string
  guests: string
  price: number
}

function enrichRoom(row: RoomRow) {
  const features = db
    .prepare('SELECT feature FROM room_features WHERE room_id = ? ORDER BY id')
    .all(row.id) as { feature: string }[]

  const images = db
    .prepare('SELECT url FROM room_images WHERE room_id = ? ORDER BY sort')
    .all(row.id) as { url: string }[]

  return {
    ...row,
    features: features.map(f => f.feature),
    images: images.map(i => i.url),
  }
}

app.get('/api/rooms', (_req, res) => {
  const rows = db.prepare('SELECT * FROM rooms ORDER BY id').all() as RoomRow[]
  res.json(rows.map(enrichRoom))
})

app.get('/api/rooms/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id) as RoomRow | undefined
  if (!row) return res.status(404).json({ error: 'Номер не найден' })
  res.json(enrichRoom(row))
})

// ── Bookings ───────────────────────────────────────────

function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'DUNE-'
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

interface BookingBody {
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

app.post('/api/bookings', (req, res) => {
  const b: BookingBody = req.body

  if (!b.roomId || !b.checkIn || !b.checkOut || !b.customerName || !b.customerPhone || !b.customerEmail) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' })
  }

  const room = db.prepare('SELECT id FROM rooms WHERE id = ?').get(b.roomId)
  if (!room) return res.status(400).json({ error: 'Номер не найден' })

  const overlap = db.prepare(`
    SELECT id FROM bookings
    WHERE room_id = ?
      AND check_out > ?
      AND check_in < ?
  `).get(b.roomId, b.checkIn, b.checkOut)

  if (overlap) {
    return res.status(409).json({ error: 'Номер занят на выбранные даты' })
  }

  const id = generateId()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO bookings (id, room_id, check_in, check_out, guests, nights, total_price, customer_name, customer_phone, customer_email, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, b.roomId, b.checkIn, b.checkOut, b.guests, b.nights, b.totalPrice, b.customerName, b.customerPhone, b.customerEmail, now)

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id)
  res.status(201).json(booking)
})

app.get('/api/bookings/:id', (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) as Record<string, unknown> | undefined
  if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' })

  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(booking.room_id) as RoomRow | undefined
  if (room) {
    (booking as Record<string, unknown>).room = enrichRoom(room)
  }

  res.json(booking)
})

app.get('/api/bookings', (_req, res) => {
  const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all()
  res.json(bookings)
})

// ── Check availability ─────────────────────────────────

app.get('/api/availability', (req, res) => {
  const { roomId, checkIn, checkOut } = req.query

  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'roomId, checkIn и checkOut обязательны' })
  }

  const overlap = db.prepare(`
    SELECT id FROM bookings
    WHERE room_id = ?
      AND check_out > ?
      AND check_in < ?
  `).get(roomId, checkIn, checkOut)

  res.json({ available: !overlap })
})

// ── Static files (production) ──────────────────────────

const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('{*path}', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

// ── Start ──────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✓ Dune API: http://localhost:${PORT}`)
})
