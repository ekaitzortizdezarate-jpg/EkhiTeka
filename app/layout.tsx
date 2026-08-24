import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
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

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EkhiTeka | Quesería Gourmet & Tienda Artesana en Lekeitio',
  description: 'Quesos artesanos, regalos gourmet, catas, salazones del cantábrico, txakoli y selección de autor en Lekeitio y Euskal Herria.',
  icons: {
    icon: '/Logo.jpg',
    apple: '/Logo.jpg',
  },
};

// Script bloqueante anti-flash: aplica dark/light ANTES de que React hidrate
// Se ejecuta sincrónicamente en el navegador para evitar parpadeo de tema
const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('ekhiteka_theme');
    var isDark =
      saved === 'dark' ||
      ((!saved || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="eu" className={`${dmSans.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        {/* Script anti-flash: aplica el tema correcto antes del primer render */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#FFE259] selection:text-[#1D1D1B] bg-[#FAF8F5] dark:bg-[#141312] text-[#1D1D1B] dark:text-[#F5F5F0]">
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

