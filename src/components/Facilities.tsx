import '../styles/Facilities.css'

interface Facility {
  id: string
  title: string
  description: string
  image: string
}

const Facilities = () => {
  const facilities: Facility[] = [
    {
      id: 'gym',
      title: 'Спортзал',
      description: 'Современный фитнес-центр с профессиональным оборудованием',
      image: '/facilities/gym.jpg'
    },
    {
      id: 'restaurant',
      title: 'Столовая',
      description: 'Ресторан с изысканной кухней и панорамным видом',
      image: '/facilities/restaurant.jpg'
    },
    {
      id: 'lobby',
      title: 'Холл',
      description: 'Просторный холл с комфортной зоной отдыха',
      image: '/facilities/lobby.jpg'
    }
  ]

  return (
    <section className="facilities-section" id="facilities">
      <div className="facilities-container">
        <h2 className="facilities-title">Удобства отеля</h2>
        <p className="facilities-subtitle">Оазис роскоши и комфорта</p>
        <div className="facilities-grid">
          {facilities.map((facility) => (
            <div key={facility.id} className="facility-card">
              <div className="facility-image">
                <img src={facility.image} alt={facility.title} />
              </div>
              <div className="facility-info">
                <h3>{facility.title}</h3>
                <p>{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Facilities
