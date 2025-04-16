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
import { OrganizationSchema, EventSchema } from '../components/StructuredData';

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
      {/* Add structured data for SEO */}
      <OrganizationSchema />
      <EventSchema 
        name="Techelons 2025"
        startDate="2025-04-07"
        endDate="2025-04-08"
        location="Shivaji College, University of Delhi"
        description="Annual tech fest organized by Websters - The Computer Science Society"
        image="/assets/techelons2025.png"
      />
      
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