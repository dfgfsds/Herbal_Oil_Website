'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Show button on scroll
  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Conditionally set bottom class
  const isProductPage = pathname?.startsWith('/productLandingPage/');
  const bottomClass = isProductPage && isMobile ? 'bottom-20' : 'bottom-6';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className={`hidden md:block fixed ${bottomClass} right-6 z-50 bg-[#d4b63a] hover:bg-[#E1D6A8] text-white p-3 rounded-md shadow-md transition-all`}
        aria-label="Scroll to Top"
      >
        <ChevronUp size={20} />
      </button>
    )
  );
};

export default ScrollToTop;
