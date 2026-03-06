import '../styles/Footer.css'

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-divider" />
      <div className="footer-content">
        <div className="footer-brand">
          <h3 className="footer-logo">DUNE</h3>
          <p className="footer-tagline">Desert Luxury Resort</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Отель</h4>
            <a href="#rooms">Номера</a>
            <a href="#facilities">Удобства</a>
          </div>
          <div className="footer-col">
            <h4>Контакты</h4>
            <a href="tel:+78005553535">+7 (800) 555-35-35</a>
            <a href="mailto:info@dune-hotel.com">info@dune-hotel.com</a>
          </div>
          <div className="footer-col">
            <h4>Время</h4>
            <span>Заезд — с 14:00</span>
            <span>Выезд — до 12:00</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 DUNE Hotel. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer
