import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './globals.css';
import TanStackProvider from './components/TanStackProvider/TanStackProvider';
import AuthProvider from './components/AuthProvider/AuthProvider';
import GlobalLoader from './GlobalLoader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <TanStackProvider>
          <AuthProvider>
            <div className="container">
              <Header />  
              <main>
                {children}
              </main>
              <Footer />
            </div>
            <GlobalLoader />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}