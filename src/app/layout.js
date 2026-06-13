import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './globals.css';

const bartender = localFont({
  src: './fonts/Bartender and Cocktail.ttf',
  variable: '--font-titles',
});

const lemonMilk = localFont({
  src: './fonts/LEMONMILK-Regular.otf',
  variable: '--font-body',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-buttons',
});

export const metadata = {
  title: 'Mx Together',
  description: 'Catálogo de cócteles y mocktails',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${bartender.variable} ${lemonMilk.variable} ${poppins.variable} font-body flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}