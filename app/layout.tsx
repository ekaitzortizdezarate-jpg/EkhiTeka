import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { StoreConfigProvider } from '@/context/StoreConfigContext';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CookieBanner } from '@/components/CookieBanner';
import { createClient } from '@/lib/supabase/server';
import { getGlobalSiteImagesConfig } from '@/app/actions/site-images';
import { parseProfile, type Profile } from '@/types/database';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const [sellersRes, siteImagesConfig] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .in('role', ['vendedor', 'admin'])
      .order('updated_at', { ascending: false }),
    getGlobalSiteImagesConfig(supabase),
  ]);

  const allSellers = sellersRes.data || [];
  const mainSellerRaw = allSellers[0] || null;
  const parsedSeller = parseProfile(mainSellerRaw);

  // Inyectar de forma definitiva las imágenes globales de Supabase Storage
  const finalSellerProfile: Profile = {
    ...parsedSeller,
    site_images: siteImagesConfig.images,
    site_images_meta: siteImagesConfig.meta,
  };

  return (
    <html lang="eu" className={`${dmSans.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#FFE259] selection:text-[#1D1D1B] bg-[#FAF8F5] dark:bg-[#141312] text-[#1D1D1B] dark:text-[#F5F5F0]">
        <ThemeProvider>
          <LanguageProvider>
            <StoreConfigProvider initialSellerProfile={finalSellerProfile}>
              <CartProvider>
                <Navbar />
                <main className="flex-1 w-full">
                  {children}
                </main>
                <Footer />
                <CartDrawer />
                <CookieBanner />
              </CartProvider>
            </StoreConfigProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
