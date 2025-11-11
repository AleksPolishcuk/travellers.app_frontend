import Join from './components/Join/Join';
import Link from 'next/link';
import Header from './components/Header/Header';
import About from './components/About/About';

export default function HomePage() {
  return (
    <div>
      <About />
      <Link href="/stories">Переглянути всі</Link>
      <br />
      <Link href="/travellers">переглянути всіх</Link> <br />
      <Join />
    </div>
  );
}
