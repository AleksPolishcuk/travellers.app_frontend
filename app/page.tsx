import OurTravellersSection from './components/OurTravellersSection/OurTravellersSection';
import Join from './components/Join/Join';

import Popular from './components/Popular/Popular';
import About from './components/About/About';
import Hero from './components/Hero/Hero';
import Popular from './components/Popular/Popular';
import { getStories } from '@/lib/api/clientApi';

export default async function HomePage() {

 
  return (
    <div>
      <Hero />
      <About />
      <Popular />
      <OurTravellersSection />
      <Join />
    </div>
  );
}
