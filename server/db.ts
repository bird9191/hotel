import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'dune.db')

const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id         INTEGER PRIMARY KEY,
    type       TEXT NOT NULL,
    title      TEXT NOT NULL,
    description TEXT NOT NULL,
    area       TEXT NOT NULL,
    beds       TEXT NOT NULL,
    guests     TEXT NOT NULL,
    price      INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS room_features (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    feature TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS room_images (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    url     TEXT NOT NULL,
    sort    INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id             TEXT PRIMARY KEY,
    room_id        INTEGER NOT NULL REFERENCES rooms(id),
    check_in       TEXT NOT NULL,
    check_out      TEXT NOT NULL,
    guests         INTEGER NOT NULL,
    nights         INTEGER NOT NULL,
    total_price    INTEGER NOT NULL,
    customer_name  TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    created_at     TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

function seedRooms() {
  const count = db.prepare('SELECT COUNT(*) as c FROM rooms').get() as { c: number }
  if (count.c > 0) return

  const rooms = [
    {
      id: 1,
      type: 'standard',
      title: 'Стандартный номер',
      description: 'Комфортный номер с современным дизайном и всеми необходимыми удобствами',
      area: '25 м²',
      beds: '1 большая кровать или 2 раздельные',
      guests: 'До 2 гостей',
      price: 5000,
      features: ['Телевизор Smart TV', 'Бесплатный Wi-Fi', 'Кондиционер', 'Мини-бар', 'Сейф', 'Фен'],
      images: ['/rooms/standard-1.jpg', '/rooms/standard-2.jpg', '/rooms/standard-3.jpg'],
    },
    {
      id: 2,
      type: 'luxury',
      title: 'Люкс',
      description: 'Просторный номер повышенной комфортности с элегантным интерьером',
      area: '35 м²',
      beds: '1 большая кровать King size',
      guests: 'До 2 гостей',
      price: 8000,
      features: [
        'Рабочий стол с креслом', 'Телевизор Smart TV 55"', 'Мини-бар', 'Кондиционер',
        'Бесплатный Wi-Fi', 'Сейф', 'Утюг и гладильная доска', 'Фен', 'Халаты и тапочки',
      ],
      images: ['/room-1.jpg', '/room-2.jpg', '/room-3.jpg', '/room-4.jpg'],
    },
    {
      id: 3,
      type: 'presidential',
      title: 'Президентский люкс',
      description: 'Роскошный многокомнатный номер с панорамным видом и эксклюзивными удобствами',
      area: '80 м²',
      beds: '1 кровать King size + гостиная с диваном',
      guests: 'До 4 гостей',
      price: 15000,
      features: [
        'Отдельная гостиная', 'Рабочий кабинет', 'Джакузи', 'Телевизор Smart TV 65"',
        'Премиум мини-бар', 'Кондиционер с индивидуальным управлением', 'Бесплатный Wi-Fi',
        'Сейф увеличенного размера', 'Утюг и гладильная доска', 'Премиум халаты и тапочки',
        'Личный консьерж', 'Панорамные окна',
      ],
      images: ['/rooms/presidential-1.jpg', '/rooms/presidential-2.jpg', '/rooms/presidential-3.jpg', '/rooms/presidential-4.jpg'],
    },
  ]

  const insertRoom = db.prepare(
    'INSERT INTO rooms (id, type, title, description, area, beds, guests, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
  const insertFeature = db.prepare('INSERT INTO room_features (room_id, feature) VALUES (?, ?)')
  const insertImage = db.prepare('INSERT INTO room_images (room_id, url, sort) VALUES (?, ?, ?)')

  const seed = db.transaction(() => {
    for (const r of rooms) {
      insertRoom.run(r.id, r.type, r.title, r.description, r.area, r.beds, r.guests, r.price)
      r.features.forEach(f => insertFeature.run(r.id, f))
      r.images.forEach((url, i) => insertImage.run(r.id, url, i))
    }
  })

  seed()
  console.log('✓ Rooms seeded')
}

seedRooms()

export default db
