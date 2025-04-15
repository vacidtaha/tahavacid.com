import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiMenu4Line } from 'react-icons/ri';

// Header bileşeni - Navigasyon menüsü ve logo içerir
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const router = useRouter();

  // Aktif rotaya göre stil veren NavLink bileşeni
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = router.pathname === href || 
                     (href !== '/' && router.pathname.startsWith(href));
    
    return (
      <Link 
        href={href} 
        className={`relative px-5 py-3 transition-all duration-300 hover:text-gray-200 ${
          isActive 
            ? 'text-white font-medium' 
            : 'text-gray-300'
        }`}
      >
        {children}
        {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform"></span>}
      </Link>
    );
  };

  // Menü açıkken body scroll'u engelle
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Menü durum değişikliğini Layout'a bildir
  useEffect(() => {
    const event = new CustomEvent('menuToggle', { detail: { isOpen: isMenuOpen } });
    window.dispatchEvent(event);
  }, [isMenuOpen]);

  // Scroll'a göre header'ı göster/gizle
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Menü açma/kapama fonksiyonu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  // Giriş Yap tıklama işlemi
  const handleLoginClick = () => {
    setIsLoginClicked(true);
    
    // 1.5 saniye sonra yönlendirme ve menüyü kapatma
    setTimeout(() => {
      setIsMenuOpen(false);
      router.push('/login');
    }, 1500);
  };

  // Menü öğesinin arka plan stilini belirle
  const getMenuItemStyle = (path: string) => {
    // Giriş Yap butonu için sabit pastel kırmızı arka plan, tıklanınca yeşil
    if (path === '/login') {
      return isLoginClicked ? 'bg-green-500/40' : 'bg-red-500/15';
    }
    
    // Sadece fare üzerinde ise arka plan göster
    if (hoveredItem === path) {
      return 'bg-gray-600/60';
    }
    
    return '';
  };

  return (
    <>
      {/* Sabit Menü Simgesi */}
      <div className="fixed top-5 right-5 z-50">
        <button 
          onClick={toggleMenu}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/40 text-white transition-all duration-300 focus:outline-none"
          aria-label={isMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
        >
          <RiMenu4Line size={16} />
        </button>
      </div>

      {/* Modern Tam Ekran Menü - Mobilde soldan, masaüstünde sağdan açılır */}
      <div 
        className={`fixed top-0 h-full z-40 transform transition-all duration-500 ease-out 
          w-[40%] left-0 sm:left-auto sm:right-0 sm:w-40 
          ${isMenuOpen 
            ? 'translate-x-0' 
            : '-translate-x-full sm:translate-x-full'
          }`}
      >
        {/* Mobil kenar geçişi */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/80 via-black/50 to-transparent sm:hidden"></div>
        
        {/* Menü içeriği */}
        <div className="flex flex-col justify-center h-full bg-black/70 backdrop-blur-xl shadow-[10px_0_30px_rgba(0,0,0,0.8)] sm:shadow-none sm:bg-black">
          {/* Menü Linkleri */}
          <nav className="flex flex-col p-6 space-y-3">
            <Link 
              href="/" 
              className={`py-2 px-4 text-sm text-left sm:text-center rounded-lg transition-all duration-300 w-full block flex items-center justify-start sm:justify-center h-10 font-semibold ${
                router.pathname === '/' 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
              } ${getMenuItemStyle('/')}`}
              onClick={toggleMenu}
              onMouseEnter={() => setHoveredItem('/')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span>Ana Sayfa</span>
            </Link>
            <Link 
              href="/research" 
              className={`py-2 px-4 text-sm text-left sm:text-center rounded-lg transition-all duration-300 w-full block flex items-center justify-start sm:justify-center h-10 font-semibold ${
                router.pathname.startsWith('/research') 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
              } ${getMenuItemStyle('/research')}`}
              onClick={toggleMenu}
              onMouseEnter={() => setHoveredItem('/research')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span>Araştırmalar</span>
            </Link>
            <button 
              className={`py-2 px-4 text-sm text-left sm:text-center rounded-lg w-full block flex items-center justify-start sm:justify-center h-10 font-semibold 
                ${isLoginClicked ? 'text-green-400 bg-green-500/40' : 'text-red-400 bg-red-500/15'} 
                transition-all duration-1000 ease-in-out`}
              onClick={handleLoginClick}
              onMouseEnter={() => setHoveredItem('/login')}
              onMouseLeave={() => setHoveredItem(null)}
              disabled={isLoginClicked}
            >
              <span>Giriş Yap</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;