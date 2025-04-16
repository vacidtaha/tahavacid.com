import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import '../styles/globals.css'
import { useRouter } from 'next/router'

// Uygulama ana bileşeni
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Eğer araştırma detay sayfası ise Layout kullanma
  const isResearchDetailPage = router.pathname.startsWith('/research/[slug]');
  const isHomePage = router.pathname === '/';
  
  // Sadece ana sayfada mobil cihazlarda scrolling'i engelle
  useEffect(() => {
    if (isHomePage) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isHomePage]);
  
  if (isResearchDetailPage) {
    return <Component {...pageProps} />;
  }
  
  return (
    // Diğer tüm sayfaları Layout içinde render et
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
} 