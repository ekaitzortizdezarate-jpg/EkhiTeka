import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CookieBanner } from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'EkhiTeka | Tienda Gourmet & Productos Artesanos',
  description: 'Quesos de autor, bonito del norte, salazones, gildas, cerveza artesanal, txakoli y sidra selecta de Bilbao y Euskal Herria.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="eu" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
