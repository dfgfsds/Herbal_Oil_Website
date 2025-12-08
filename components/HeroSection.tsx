'use client';

import React, { useEffect, useRef, useState } from 'react';
import Banner1 from '../public/img/bmc-banner-1.jpg';
import Banner2 from '../public/img/bmc-banner-2.jpg';
import Banner3 from '../public/img/bmc-banner-3.jpg';
import mobileBanner1 from '../public/img/bmc-moblie-banner-1.jpg';
import mobileBanner2 from '../public/img/bmc-moblie-banner-2.jpg';
import mobileBanner3 from '../public/img/bmc-moblie-banner-3.jpg';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useVendor } from '@/context/VendorContext';
import { baseUrl } from '@/api-endpoints/ApiUrls';
import axios from 'axios';
import { useRouter } from 'next/router';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<any>(null);
  const { vendorId } = useVendor();
  const [banners, setBanners] = useState<any[]>([]);
  const router = useRouter();


  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Fetch banners
  const bannerGetApi = async () => {
    try {
      const res = await axios.get(`${baseUrl}/banners/?vendorId=${vendorId}`);
      if (res.data?.banners) {
        setBanners(res.data.banners);
      } else {
        console.warn('Unexpected API response:', res.data);
      }
    } catch (error) {
      console.log('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    bannerGetApi();
  }, [vendorId]);


  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) return null;

  // Filter banners based on type
  const filteredBanners = banners.filter(banner =>
    isMobile ? banner.type === 'Mobile View' : banner.type === 'Web View'
  );

  const handleBannerClick = (banner: any) => {
    if (banner?.target_url) {
      router.push(banner.target_url); // Always open in same tab
    }
  };

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        onClick={onClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full cursor-pointer hover:bg-white shadow-md"
      >
        <ChevronRight className="text-blue-600 w-5 h-5" />
      </div>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <div
        onClick={onClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full cursor-pointer hover:bg-white shadow-md"
      >
        <ChevronLeft className="text-blue-600 w-5 h-5" />
      </div>
    );
  };

  const sliderSettings = {
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    arrows: true,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_: number, next: number) => {
      const slides = document.querySelectorAll('.slick-slide .zoom-slide');
      slides.forEach((slide) => slide.classList.remove('scale-100'));
      setTimeout(() => {
        const active = document.querySelector('.slick-active .zoom-slide');
        if (active) active.classList.add('scale-100');
      }, 100);
    },
  };



  return (
    <div className="relative h-[70vh] md:h-[70vh] overflow-hidden hero-container">
      <Slider ref={sliderRef} {...sliderSettings}>
        {filteredBanners.map((banner: any) => (
          <div key={banner.id}
            className="cursor-pointer"
            onClick={() => handleBannerClick(banner)}>
            <img
              className="md:rounded-lg md:object-cover w-full h-[70vh] md:h-auto"
              src={banner.image_url}
              alt={banner.title || 'banner'}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
