import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Navigation.css'

interface NavigationProps {
  scrolled: boolean
}

const Navigation = ({ scrolled }: NavigationProps) => {
  const navigate = useNavigate()

  const go = useCallback((path: string) => {
    navigate(path)
  }, [navigate])

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-row">
        <nav className="main-nav">
          <button className="main-nav-link" type="button" onClick={() => go('/')}>Главная</button>
          <button className="main-nav-link" type="button" onClick={() => go('/#rooms')}>Номера</button>
          <button className="main-nav-link" type="button" onClick={() => go('/#facilities')}>Удобства</button>
          <button className="main-nav-link" type="button" onClick={() => go('/#footer')}>Галерея</button>
        </nav>
        <div className="utility-links">
          <button className="utility-link" type="button" onClick={() => go('/#footer')}>Контакты</button>
          <button className="utility-link" type="button" onClick={() => go('/#footer')}>Поддержка</button>
        </div>
      </div>
    </header>
  )
}

export default Navigation
