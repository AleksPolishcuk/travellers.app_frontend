import Header from './components/Header/Header';
import Popular from './components/Popular/Popular';
import Footer from './components/Footer/Footer';
import './globals.css';
import AuthProvider  from './components/AuthProvider/AuthProvider';


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
    <html lang="uk" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
        <div className="container">
         <Header/>
          <main>
      {children}
          </main>
          <Footer />
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
