import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import TanStackProvider from './components/TanStackProvider/TanStackProvider';

export const metadata = {
  title: 'Подорожники',
  description: 'Спільнота мандрівників',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <TanStackProvider>
        <div className="container">
          <Header />  
          <main>
      {children}
          </main>
          <Footer />
        </div>
        </TanStackProvider>
      </body>
    </html>
  );
}
