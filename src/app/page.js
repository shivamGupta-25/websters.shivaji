"use client";

import { useState, useEffect } from 'react';
import Header from './_components/Header';
import Banner from './_components/Banner';
import About from './_components/About';
import Workshop from './_components/Workshop';
import Council from './_components/Council';
import PastEvent from './_components/PastEvent';
import Footer from './_components/Footer';
import ScrollIndicator from './_components/ScrollIndicator';
import ScrollToTopButton from './_components/ScrollToTopButton';

export default function Home() {
  const [showIndicator, setShowIndicator] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll indicator at the top, hide when scrolled
      setShowIndicator(window.scrollY < 100);
      
      // Show scroll to top button when scrolled down
      setShowTopButton(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Header />
      <main>
        <Banner />
        <About />
        <Workshop />
        <PastEvent />
        <Council />
        <ScrollIndicator visible={showIndicator} />
        <ScrollToTopButton visible={showTopButton} onClick={scrollToTop} />
      </main>
      <Footer />
    </>
  );
}