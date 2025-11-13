import OurTravellersSection from './components/OurTravellersSection/OurTravellersSection';
import Join from './components/Join/Join';

import Popular from './components/Popular/Popular';
import About from './components/About/About';
import Hero from './components/Hero/Hero';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <About />

      <OurTravellersSection />
      <Join />
    </div>
  );
}
