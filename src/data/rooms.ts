export interface Room {
  id: number
  type: 'standard' | 'luxury' | 'presidential'
  title: string
  description: string
  area: string
  beds: string
  guests: string
  price: number
  features: string[]
  images: string[]
}

export const rooms: Room[] = [
  {
    id: 1,
    type: 'standard',
    title: 'Стандартный номер',
    description: 'Комфортный номер с современным дизайном и всеми необходимыми удобствами',
    area: '25 м²',
    beds: '1 большая кровать или 2 раздельные',
    guests: 'До 2 гостей',
    price: 5000,
    features: [
      'Телевизор Smart TV',
      'Бесплатный Wi-Fi',
      'Кондиционер',
      'Мини-бар',
      'Сейф',
      'Фен'
    ],
    images: ['/rooms/standard-1.jpg', '/rooms/standard-2.jpg', '/rooms/standard-3.jpg']
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
      'Рабочий стол с креслом',
      'Телевизор Smart TV 55"',
      'Мини-бар',
      'Кондиционер',
      'Бесплатный Wi-Fi',
      'Сейф',
      'Утюг и гладильная доска',
      'Фен',
      'Халаты и тапочки'
    ],
    images: ['/room-1.jpg', '/room-2.jpg', '/room-3.jpg', '/room-4.jpg']
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
      'Отдельная гостиная',
      'Рабочий кабинет',
      'Джакузи',
      'Телевизор Smart TV 65"',
      'Премиум мини-бар',
      'Кондиционер с индивидуальным управлением',
      'Бесплатный Wi-Fi',
      'Сейф увеличенного размера',
      'Утюг и гладильная доска',
      'Премиум халаты и тапочки',
      'Личный консьерж',
      'Панорамные окна'
    ],
    images: ['/rooms/presidential-1.jpg', '/rooms/presidential-2.jpg', '/rooms/presidential-3.jpg', '/rooms/presidential-4.jpg']
  }
]

export const getRoomById = (id: number): Room | undefined => {
  return rooms.find(room => room.id === id)
}
