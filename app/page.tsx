import OurTravellersSection from './components/OurTravellersSection';
import Join from './components/Join/Join';
import Link from 'next/link';
import Header from './components/Header/Header';
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
      <Join />
      <OurTravellersSection />
    </div>
  );
}
