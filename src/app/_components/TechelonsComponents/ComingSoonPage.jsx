{ /* Coming Soon Page */ }

import React, { useEffect, useState } from 'react';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Skeleton } from "@/components/ui/skeleton";
import ComingSoonPageSkeleton from '../Skeletons/ComingSoonPageSkeleton';

const EventSchedule = ({ errorMessage }) => {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        
        // Simulate loading delay (remove in production and use actual data loading)
        const timer = setTimeout(() => {
            setLoading(false);
            createParticles();
        }, 2000);

        return () => {
            clearTimeout(timer);
            const container = document.getElementById('particles');
            if (container) {
                container.innerHTML = '';
            }
        };
    }, []);

    const createParticles = () => {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = 15;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 6 + 2;

            particle.style.position = 'absolute';
            particle.style.backgroundColor = '#88888815';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.borderRadius = '50%';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            const duration = Math.random() * 4 + 3;
            const delay = Math.random() * 3;
            particle.style.animation = `float ${duration}s infinite ease-in-out ${delay}s`;

            container.appendChild(particle);
        }
    };

    if (!mounted) return null;
    
    // Show skeleton while loading
    if (loading) {
        return <ComingSoonPageSkeleton />;
    }

    // If there's an error message, show a different UI
    if (errorMessage) {
        return (
            <section id="events" className="py-8 md:py-8 relative flex items-center justify-center">
                {/* Particle effect container */}
                <div id="particles" className="absolute inset-0 z-0"></div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-tr-full z-0"></div>
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-bl from-purple-500/10 to-indigo-500/10 rounded-bl-full z-0"></div>

                {/* Main content */}
                <div className="z-10 text-center w-full max-w-4xl px-4">
                    <div className="mb-8 inline-block">
                        <h1
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
                            style={{
                                fontWeight: 900,
                                WebkitTextStroke: '1px rgba(0,0,0,0.1)',
                                letterSpacing: '0.05em'
                            }}
                        >
                            Events
                        </h1>
                        <div className="h-1.5 w-20 sm:w-24 md:w-28 lg:w-32 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mt-2 md:mt-3 rounded-full"></div>
                    </div>

                    <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 animate-fadeIn"
                        style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
                    >
                        Something went wrong
                    </h2>

                    <p
                        className="text-base sm:text-lg md:text-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 text-red-600 font-medium animate-fadeIn"
                        style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
                    >
                        {errorMessage}
                    </p>

                    {/* Refresh button */}
                    <div
                        className="mt-10 sm:mt-12 md:mt-16 flex justify-center animate-fadeIn"
                        style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
                    >
                        <button
                            className="group relative overflow-hidden py-2 sm:py-3 px-6 sm:px-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base md:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            onClick={() => window.location.reload()}
                        >
                            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                Refresh Page
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-3 h-3 sm:w-4 sm:h-4">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>

                <style jsx global>{`
                    @keyframes float {
                      0% { transform: translateY(0px); }
                      50% { transform: translateY(-15px); }
                      100% { transform: translateY(0px); }
                    }
                    
                    @keyframes fadeIn {
                      from { opacity: 0; transform: translateY(20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .animate-fadeIn {
                      opacity: 0;
                      animation: fadeIn 0.8s ease-out forwards;
                    }
                    
                    h1 {
                      text-rendering: optimizeLegibility;
                      -webkit-font-smoothing: antialiased;
                      -moz-osx-font-smoothing: grayscale;
                    }
                `}</style>
            </section>
        );
    }

    return (
        <section id="events" className="py-8 md:py-8 relative flex items-center justify-center">
            {/* Particle effect container */}
            <div id="particles" className="absolute inset-0 z-0"></div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-tr-full z-0"></div>
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-bl from-purple-500/10 to-indigo-500/10 rounded-bl-full z-0"></div>

            {/* Main content */}
            <div className="z-10 text-center w-full max-w-4xl px-4">
                <div className="mb-8 inline-block">
                    <h1
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
                        style={{
                            fontWeight: 900,
                            WebkitTextStroke: '1px rgba(0,0,0,0.1)',
                            letterSpacing: '0.05em'
                        }}
                    >
                        Events
                    </h1>
                    <div className="h-1.5 w-20 sm:w-24 md:w-28 lg:w-32 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mt-2 md:mt-3 rounded-full"></div>
                </div>

                <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 animate-fadeIn"
                    style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
                >
                    Coming Soon!
                </h2>

                <p
                    className="text-base sm:text-lg md:text-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 text-gray-600 animate-fadeIn"
                    style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
                >
                    We're crafting something extraordinary at the intersection of innovation and possibility.
                    Join us on this exciting journey into the future of technology.
                </p>

                <p
                    className="text-base sm:text-lg md:text-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 text-gray-600 animate-fadeIn"
                    style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
                >
                    Follow us to stay updated!
                </p>

                {/* Social links */}
                <div
                    className="flex justify-center gap-4 sm:gap-5 md:gap-6 animate-fadeIn"
                    style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
                >
                    <a
                        href="https://www.instagram.com/websters.shivaji?igsh=MTRxaWFhMGUwMGR2eQ=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                        aria-label="Instagram"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 -z-10 scale-0 group-hover:scale-125"></div>
                        <FaInstagram size={28} className="sm:text-4xl text-gray-800 hover:scale-110 transition-transform duration-300 group-hover:text-white" />
                    </a>

                    <a
                        href="https://www.linkedin.com/company/websters-shivaji-college/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                        aria-label="LinkedIn"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 -z-10 scale-0 group-hover:scale-125"></div>
                        <FaLinkedin size={28} className="sm:text-4xl text-gray-800 hover:scale-110 transition-transform duration-300 group-hover:text-white" />
                    </a>
                </div>

                {/* Back to home button */}
                <div
                    className="mt-10 sm:mt-12 md:mt-16 flex justify-center animate-fadeIn"
                    style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
                >
                    <button
                        className="group relative overflow-hidden py-2 sm:py-3 px-6 sm:px-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base md:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        onClick={() => window.location.href = '/'}
                    >
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                        <span className="relative flex items-center justify-center gap-2">
                            Back to Home page
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-3 h-3 sm:w-4 sm:h-4">
                                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        h1 {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
        </section>
    );
};

export default EventSchedule;