"use client";

import { useState, useEffect } from 'react';
import Header from '../_components/Header';
import Footer from '../_components/Footer';
import ScrollToTopButton from '../_components/ScrollToTopButton';
import TechelonsMain from '../_components/TechelonsComponents/TechelonsMain';
import TechelonsSchedule from '../_components/TechelonsComponents/TechelonsSchedule';
import ComingSoonPage from '../_components/TechelonsComponents/ComingSoonPage';
import { fetchTechelonsData } from '@/lib/utils';

export default function Home() {
  const [showTopButton, setShowTopButton] = useState(false);
  const [techelonsData, setTechelonsData] = useState(null);

  useEffect(() => {
    const loadTechelonsData = async () => {
      try {
        const data = await fetchTechelonsData();
        setTechelonsData(data);
      } catch (error) {
        console.error('Error loading techelons data:', error);
      }
    };

    loadTechelonsData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
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

  // Determine whether to show Coming Soon page or Schedule
  const showComingSoon = techelonsData?.festInfo?.comingSoonEnabled || false;

  return (
    <>
      <Header />
      <main>
        <TechelonsMain />
        {techelonsData && (
          showComingSoon ? <ComingSoonPage /> : <TechelonsSchedule />
        )}
        <ScrollToTopButton visible={showTopButton} onClick={scrollToTop} />
      </main>
      <Footer />
    </>
  );
}