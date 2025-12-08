'use client';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
  { name: 'Home', link: '/' },
  { name: 'Shop', link: '/products' },
  { name: 'Categories', link: '/categories' },
  { name: 'About Us', link: '/aboutUs' },
  { name: 'Contact Us', link: '/contactUs' },
  { name: 'Blogs', link: '/blog' },
];

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-[#f2f4ff] border-b shadow w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center md:justify-center justify-between py-1">
          {/* Desktop Nav */}
          <ul className="hidden md:flex text-md font-medium text-gray-700">
            {navLinks.map(({ name, link }, index) => (
              <li key={index}>
                <Link href={link}>
                  <span
                    className={`inline-block px-3 py-2 cursor-pointer rounded mx-2
    ${pathname === link ? 'bg-[#b39e49] text-white' : 'bg-[#d4b63a]  hover:text-white'}`}
                  >
                    {name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Logo */}
          <div className="md:hidden text-lg font-bold text-gray-700"></div>

          {/* Hamburger Icon */}
          <button
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Slide-in Mobile Menu */}
        <div
          className={`fixed top-0 left-0 h-[100vh] w-64 bg-white z-[9999] shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:hidden`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-gray-800">BMC</span>
            <button onClick={toggleMenu}>
              <X size={24} />
            </button>
          </div>
          <ul className="p-4 space-y-4 text-sm font-medium text-gray-700">
            {navLinks.map(({ name, link }, index) => (
              <li key={index}>
                <Link href={link}>
                  <span
                    onClick={toggleMenu}
                    className={`block px-4 py-2 rounded cursor-pointer 
    ${pathname === link ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'}`}
                  >
                    {name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-[9998] md:hidden"
            onClick={toggleMenu}
          />
        )}
      </div>
    </header>
  );
}

export default Navbar;
