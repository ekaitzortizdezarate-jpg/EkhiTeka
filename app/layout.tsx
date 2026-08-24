import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CookieBanner } from '@/components/CookieBanner';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EkhiTeka | Quesería Gourmet & Tienda Artesana en Bilbao',
  description: 'Quesos artesanos, regalos gourmet, catas, salazones del cantábrico, txakoli y selección de autor en Bilbao y Euskal Herria.',
  icons: {
    icon: '/Logo.jpg',
    apple: '/Logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="eu" className={dmSans.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#FFE259] selection:text-[#1D1D1B] transition-colors duration-200 bg-[#FAF8F5] dark:bg-[#141312] text-[#1D1D1B] dark:text-[#F5F5F0]">
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 w-full">
                {children}
              </main>
              <Footer />
              <CartDrawer />
              <CookieBanner />
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

