import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Analytics from '@/components/Analytics'
import Integrations from '@/components/Integrations'
import Features from '@/components/Features'
import Stats from '@/components/Stats'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <div className="shell">
        <Hero />
        <Analytics />
        <Integrations />
        <Features />
        <Stats />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </>
  )
}
