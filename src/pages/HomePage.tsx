import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Cover from '../components/Cover'
import Reserve from '../components/Reserve'
import Rooms from '../components/Rooms'
import Facilities from '../components/Facilities'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'

interface HomePageProps {
  scrolled: boolean
}

const HomePage = ({ scrolled }: HomePageProps) => {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [hash])

  return (
    <>
      <Navigation scrolled={scrolled} />
      <Reserve scrolled={scrolled} />
      <Cover />
      <Rooms />
      <Facilities />
      <Footer />
      <BackToTop />
    </>
  )
}

export default HomePage
