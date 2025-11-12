import Join from './components/Join/Join';
import Link from 'next/link';
import Popular from './components/Popular/Popular';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-red-500 font-bold underline ">HomePage</h1>
      <Link href="/stories">Переглянути всі</Link>
      <br />
      <Link href="/travellers">переглянути всіх</Link> <br />
     
      <Join />
    </div>
  );
}
