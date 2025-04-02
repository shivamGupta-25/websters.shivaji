'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from "next/navigation";
import { fetchTechelonsData, fetchSiteContent } from "@/lib/utils";
import {
    Alert,
    AlertDescription
} from "@/components/ui/alert";

// Animation configurations
const animations = {
    buttonHover: {
        initial: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.98 }
    }
};

// Navigation data
const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about' },
    { name: 'Workshop', href: '/#workshop' },
    { name: 'Past Event', href: '/#pastevent' },
    { name: 'Council', href: '/#council' },
    { name: 'Techelons', href: '/techelons' },
];

// CSS classes using Tailwind composition
const STYLES = {
    desktopLink: "text-xs sm:text-sm lg:text-base font-semibold text-gray-900 hover:text-gray-600 hover:underline transition-all duration-300",
    mobileLink: "block text-base sm:text-lg font-semibold text-gray-900 hover:text-gray-600 hover:underline transition-all duration-300",
    registerButton: "bg-gray-900 text-white py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm lg:text-base font-bold rounded-full shadow-md hover:bg-gray-800 transition-all duration-300",
    mobileRegisterButton: "w-full bg-gray-900 text-white font-bold py-2.5 sm:py-3 rounded-full shadow-md",
    menuButton: "md:hidden p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200",
};

// Memoized Logo component
const Logo = memo(({ className }) => (
    <Image
        alt="logo"
        src="/assets/Header_logo.png"
        width={250}
        height={65}
        className={className}
        priority
    />
));
Logo.displayName = 'Logo';

// Optimized NavLink component
const NavLink = memo(({ href, name, onClick, className, isCurrent }) => {
    // Normalize href for hash links
    const normalizedHref = href.includes('#')
        ? href.split('#')[0] + '#' + href.split('#')[1].toLowerCase()
        : href;

    return (
        <Link
            href={normalizedHref}
            className={className}
            onClick={(e) => {
                if (normalizedHref.startsWith('/#')) {
                    e.preventDefault();
                    onClick(normalizedHref);
                }
            }}
            aria-current={isCurrent ? 'page' : undefined}
        >
            {name}
        </Link>
    );
});
NavLink.displayName = 'NavLink';

// Notification component for all system messages
const SystemNotification = memo(({ notification, onDismiss, onAction }) => {
    if (!notification) return null;
    
    const { type, message, actionLabel } = notification;
    
    // Colors based on notification type
    const styles = {
        error: "border-red-400 bg-red-50 text-red-800",
        warning: "border-yellow-400 bg-yellow-50 text-yellow-800",
        info: "border-blue-400 bg-blue-50 text-blue-800"
    };
    
    return (
        <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-3 md:p-4"
        >
            <Alert className={`flex justify-between items-center shadow-lg ${styles[type] || styles.info}`}>
                <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                    <AlertDescription className="text-xs sm:text-sm md:text-base">
                        {message}
                    </AlertDescription>
                </div>
                <div className="flex items-center gap-2">
                    {actionLabel && (
                        <button
                            onClick={onAction}
                            className={`text-xs sm:text-sm font-medium px-2 py-1 rounded transition-colors ${
                                type === 'error' ? 'bg-red-100 hover:bg-red-200' : 
                                type === 'warning' ? 'bg-yellow-100 hover:bg-yellow-200' : 
                                'bg-blue-100 hover:bg-blue-200'
                            }`}
                        >
                            {actionLabel}
                        </button>
                    )}
                    <button
                        onClick={onDismiss}
                        className="text-xs sm:text-sm font-medium hover:opacity-80 transition-opacity"
                        aria-label="Dismiss"
                    >
                        <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </Alert>
        </motion.div>
    );
});
SystemNotification.displayName = 'SystemNotification';

const Header = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState({
        techelons: false,
        workshop: false,
        loading: true
    });
    const [notification, setNotification] = useState(null);
    const router = useRouter();
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    // Helper to show notifications
    const showNotification = useCallback((type, message, actionLabel = null) => {
        setNotification({
            type,
            message,
            actionLabel
        });
    }, []);

    // Clear notification
    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);
    
    // Handle refresh action
    const handleRefresh = useCallback(() => {
        window.location.reload();
    }, []);

    // Fetch registration status with simplified error handling
    const fetchRegistrationStatus = useCallback(async () => {
        try {
            setRegistrationStatus(prev => ({ ...prev, loading: true }));
            
            // Try to fetch data
            const [techelonsData, siteContent] = await Promise.all([
                fetchTechelonsData(),
                fetchSiteContent()
            ]);
            
            // Check if we have valid data
            const hasTechelonsData = techelonsData && techelonsData.festInfo;
            const hasSiteContent = siteContent && siteContent.workshop;
            
            // Update registration status with available data
            setRegistrationStatus({
                techelons: hasTechelonsData ? techelonsData.festInfo.registrationEnabled : false,
                workshop: hasSiteContent ? siteContent.workshop.isRegistrationOpen : false,
                loading: false
            });
            
            // Only show error if we couldn't load any data
            if (!hasTechelonsData && !hasSiteContent) {
                showNotification(
                    'error',
                    'Unable to connect to the server. Please refresh and try again.',
                    'Refresh'
                );
            } else {
                // Clear any existing notifications on successful load
                clearNotification();
            }
        } catch (error) {
            console.error("Error fetching registration status:", error);
            
            setRegistrationStatus(prev => ({ 
                ...prev, 
                loading: false 
            }));
            
            showNotification(
                'error',
                'Unable to connect to the server. Please refresh and try again.',
                'Refresh'
            );
        }
    }, [showNotification, clearNotification]);

    // Initial fetch and periodic refresh
    useEffect(() => {
        fetchRegistrationStatus();

        // Skip refresh on admin pages
        if (pathname.startsWith('/admin')) return;

        const refreshInterval = setInterval(fetchRegistrationStatus, 60000);
        return () => clearInterval(refreshInterval);
    }, [fetchRegistrationStatus, pathname]);

    // Improved scroll to section function
    const scrollToSection = useCallback((sectionId) => {
        if (!sectionId) return false;

        // Try to find by exact ID first
        let element = document.getElementById(sectionId);

        // If not found, try case-insensitive comparison as fallback
        if (!element) {
            // Get all elements with IDs
            const allElements = document.querySelectorAll('[id]');
            // Find element with case-insensitive match
            for (const el of allElements) {
                if (el.id.toLowerCase() === sectionId.toLowerCase()) {
                    element = el;
                    break;
                }
            }
        }

        if (!element) return false;

        // Get the element's position relative to the viewport
        const rect = element.getBoundingClientRect();

        // Calculate distance from the top of the document
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add a small offset to account for the header
        const headerOffset = 8;

        window.scrollTo({
            top: rect.top + scrollTop - headerOffset,
            behavior: 'smooth'
        });

        return true;
    }, []);

    // Handle navigation with hash links
    const handleNavigation = useCallback((href) => {
        setMobileMenuOpen(false);

        // Normalize href and extract section ID
        const normalizedHref = href.toLowerCase();
        const sectionId = normalizedHref.startsWith('/#') ? normalizedHref.substring(2) : null;

        if (!sectionId) return;

        if (!isHomePage) {
            // Save section target for after navigation
            sessionStorage.setItem('scrollTarget', sectionId);
            // Use replace instead of push for more reliable navigation to home with hash
            router.replace('/');
        } else {
            // More reliable approach with timeout
            setTimeout(() => {
                if (!scrollToSection(sectionId)) {
                    // Try again if initial attempt fails
                    requestAnimationFrame(() => scrollToSection(sectionId));
                }
            }, 10);
        }
    }, [isHomePage, router, scrollToSection]);

    // Handle registration button click with simplified error handling
    const handleRegistration = useCallback(() => {
        if (registrationStatus.loading) {
            showNotification(
                'error',
                'Unable to connect to the server. Please refresh and try again.',
                'Refresh'
            );
            return;
        }

        const { techelons, workshop } = registrationStatus;

        if (techelons && workshop) {
            router.push("/register-options");
        } else if (techelons) {
            router.push("/techelonsregistration");
        } else if (workshop) {
            router.push("/workshopregistration");
        } else {
            router.push("/registrationclosed");
        }
    }, [router, registrationStatus, showNotification]);

    // Handle section scrolling on page load
    useEffect(() => {
        if (!isHomePage) return;

        const targetId = sessionStorage.getItem('scrollTarget');
        if (!targetId) return;

        // Clean up storage
        sessionStorage.removeItem('scrollTarget');

        // Use requestAnimationFrame for more reliable scrolling after page load
        const handleScroll = () => {
            // Add a small delay to ensure components are fully rendered
            setTimeout(() => {
                if (!scrollToSection(targetId)) {
                    // Retry with increasing timeouts if initial attempt fails
                    setTimeout(() => {
                        if (!scrollToSection(targetId)) {
                            // One final attempt with longer timeout
                            setTimeout(() => scrollToSection(targetId), 300);
                        }
                    }, 150);
                }
            }, 50);
        };

        // Wait for components to be fully rendered
        if (document.readyState === 'complete') {
            handleScroll();
        } else {
            window.addEventListener('load', handleScroll, { once: true });
            return () => window.removeEventListener('load', handleScroll);
        }
    }, [isHomePage, scrollToSection]);

    // Manage body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [mobileMenuOpen]);

    return (
        <>
            <header className="bg-white w-full">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5">
                    <nav className="flex items-center justify-between" aria-label="Main navigation">
                        {/* Logo - Responsive sizing */}
                        <Link href="/" className="flex-shrink-0 z-10" aria-label="Home">
                            <Logo className="h-6 sm:h-7 md:h-8 w-auto" />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex md:items-center md:gap-x-3 lg:gap-x-6 xl:gap-x-8">
                            {NAV_LINKS.map((link) => (
                                <NavLink
                                    key={link.name}
                                    href={link.href}
                                    name={link.name}
                                    onClick={handleNavigation}
                                    className={STYLES.desktopLink}
                                    isCurrent={pathname === link.href || (link.href.includes('#') && pathname === '/')}
                                />
                            ))}
                        </div>

                        {/* Desktop Register Button */}
                        <motion.button
                            variants={animations.buttonHover}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            className={`${STYLES.registerButton} hidden md:block`}
                            onClick={handleRegistration}
                        >
                            Register Now
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className={STYLES.menuButton}
                            aria-label="Open menu"
                        >
                            <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <Dialog
                        as={motion.div}
                        static
                        open={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 z-50"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-gray-900"
                            aria-hidden="true"
                        />

                        {/* Menu panel - responsive width and paddings */}
                        <div className="fixed inset-y-0 right-0 max-w-full flex pointer-events-none">
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ duration: 0.2 }}
                                className="w-56 xs:w-64 sm:w-72 bg-white px-4 xs:px-5 sm:px-6 py-4 sm:py-6 shadow-lg overflow-y-auto pointer-events-auto"
                            >
                                <div className="flex items-center justify-between">
                                    <Link href="/" onClick={() => setMobileMenuOpen(false)} aria-label="Home">
                                        <Logo className="h-6 sm:h-8 md:h-9 w-auto" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-1.5 sm:p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                                        aria-label="Close menu"
                                    >
                                        <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </button>
                                </div>

                                <nav className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                                    {NAV_LINKS.map((link) => (
                                        <div key={link.name}>
                                            <NavLink
                                                href={link.href}
                                                name={link.name}
                                                onClick={handleNavigation}
                                                className={STYLES.mobileLink}
                                                isCurrent={pathname === link.href || (link.href.includes('#') && pathname === '/')}
                                            />
                                        </div>
                                    ))}
                                    <hr className="border-gray-300 my-3 sm:my-4" />
                                    <button
                                        className={STYLES.mobileRegisterButton}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleRegistration();
                                        }}
                                    >
                                        Register Now
                                    </button>
                                </nav>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>

            {/* Unified Notification System */}
            <AnimatePresence>
                {notification && (
                    <SystemNotification 
                        notification={notification}
                        onDismiss={clearNotification}
                        onAction={handleRefresh}
                    />
                )}
            </AnimatePresence>

            <main>{children}</main>
        </>
    );
};

export default memo(Header);