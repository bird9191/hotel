import { useNavigate } from 'react-router-dom'
import '../styles/Navigation.css'

interface NavigationProps {
  scrolled: boolean
}

const Navigation = ({ scrolled }: NavigationProps) => {
  const navigate = useNavigate()

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-row">
        <nav className="main-nav">
          <span className="main-nav-link" onClick={() => navigate('/')}>Главная</span>
          <span className="main-nav-link" onClick={() => navigate('/#rooms')}>Номера</span>
          <span className="main-nav-link" onClick={() => navigate('/#facilities')}>Удобства</span>
          <span className="main-nav-link">Галерея</span>
        </nav>
        <div className="utility-links">
          <span className="utility-link" onClick={() => navigate('/#footer')}>Контакты</span>
          <span className="utility-link">Поддержка</span>
        </div>
      </div>
    </header>
  )
}

export default Navigation
