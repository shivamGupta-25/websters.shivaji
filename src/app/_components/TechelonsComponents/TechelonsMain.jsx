import { useState, useEffect, lazy, Suspense, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { fetchTechelonsData } from '@/lib/utils';
import TechelonsSkeleton from "@/app/_components/Skeletons/TechelonsMainSkeleton";
import { DEFAULT_CONTENT } from '@/app/data/techelonsData';

// Constants
const MOBILE_BREAKPOINT = 768;
const CONTENT_LOADING_TIMEOUT = 1000;

// Lazy load the SplineScene component
const SplineScene = lazy(() =>
    import("@/components/ui/splite").then(mod => ({ default: mod.SplineScene }))
);

// Spotlight Effects Component
const SpotlightEffects = memo(() => (
    <>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-purple-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
    </>
));

SpotlightEffects.displayName = 'SpotlightEffects';

// Scene3D Fallback Content
const Scene3DFallback = memo(() => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2">
                Tech<span className="text-blue-400">elons</span>
            </div>
            <div className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-200 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                April 2025
            </div>
            <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
        </div>
    </div>
));

Scene3DFallback.displayName = 'Scene3DFallback';

// Feature Card component
const FeatureCard = memo(({ icon, title, description }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-4" aria-hidden="true">{icon}</div>
        <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 md:mb-2">{title}</h3>
        <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </div>
));

FeatureCard.displayName = 'FeatureCard';

const TechelonsMain = () => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState({
        registrationOpen: false,
        statusMessage: "Registration Status Unavailable",
        daysLeft: null
    });
    const [is3DLoaded, setIs3DLoaded] = useState(false);
    const [shouldRender3D, setShouldRender3D] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [techelonsContent, setTechelonsContent] = useState(DEFAULT_CONTENT);
    const [usingFallback, setUsingFallback] = useState(false);

    // Handle responsive design
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateDimensions = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions, { passive: true });

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Fetch content and registration status
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTechelonsData();

                // Update content if available
                if (data?.uiContent) {
                    setTechelonsContent(data.uiContent);
                } else {
                    console.info('Using fallback Techelons UI content');
                    setUsingFallback(true);
                }

                // Update registration status if available
                if (data?.festInfo) {
                    const regStatus = data.festInfo.registrationEnabled;

                    let daysLeft = null;
                    let statusMessage = regStatus ? "Registration Open" : "Registration Closed";

                    if (regStatus && data.festInfo.dates?.registrationDeadline) {
                        const deadlineDate = new Date(data.festInfo.dates.registrationDeadline);
                        const currentDate = new Date();

                        // Reset time part for accurate day calculation
                        deadlineDate.setHours(0, 0, 0, 0);
                        currentDate.setHours(0, 0, 0, 0);

                        // Calculate difference in days
                        const timeDiff = deadlineDate.getTime() - currentDate.getTime();
                        daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        // Update status message with days left
                        if (daysLeft > 0) {
                            statusMessage = `Registration Open • ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
                        } else if (daysLeft === 0) {
                            statusMessage = "Registration Open • Last day!";
                        }
                    }

                    setRegistrationStatus({
                        registrationOpen: regStatus,
                        statusMessage,
                        daysLeft
                    });
                } else {
                    console.info('Using fallback Techelons registration status');
                    setUsingFallback(true);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setUsingFallback(true);
                setRegistrationStatus({
                    registrationOpen: false,
                    statusMessage: "Registration Status Unavailable",
                    daysLeft: null
                });
            }
        };

        fetchData();
    }, []);

    // Simulate content loading
    useEffect(() => {
        const contentTimer = setTimeout(() => {
            setContentLoaded(true);
        }, CONTENT_LOADING_TIMEOUT);

        return () => clearTimeout(contentTimer);
    }, []);

    // Use IntersectionObserver to only load 3D when visible
    useEffect(() => {
        if (typeof window === 'undefined' || isMobile) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShouldRender3D(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const container = document.querySelector('.techelons-3d-container');
        if (container) {
            observer.observe(container);
        }

        return () => observer.disconnect();
    }, [isMobile]);

    // Check if Spline canvas is in the DOM to detect loading
    useEffect(() => {
        if (shouldRender3D && !is3DLoaded) {
            const checkSplineLoaded = setInterval(() => {
                // Check for Spline canvas in the DOM
                const splineCanvas = document.querySelector('.techelons-3d-container canvas');
                if (splineCanvas) {
                    setIs3DLoaded(true);
                    clearInterval(checkSplineLoaded);
                }
            }, 500);

            return () => clearInterval(checkSplineLoaded);
        }
    }, [shouldRender3D, is3DLoaded]);

    // Handler functions
    const handleRegistration = useCallback(() => {
        router.push(registrationStatus.registrationOpen ? "/techelonsregistration" : "/registrationclosed");
    }, [registrationStatus.registrationOpen, router]);

    const handle3DLoad = useCallback(() => {
        setIs3DLoaded(true);
    }, []);

    const handleLearnMore = useCallback(() => {
        if (typeof window !== 'undefined') {
            document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // Status badge styling
    const statusBadgeStyle = useMemo(() => {
        const { registrationOpen, daysLeft } = registrationStatus;
        const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;

        return {
            container: `inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 rounded-full ${registrationOpen
                ? isUrgent
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
                }`,
            indicator: `w-2 h-2 rounded-full ${registrationOpen
                ? isUrgent
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-green-500 animate-pulse"
                : "bg-red-500 animate-pulse"
                }`,
            text: `font-bold text-sm md:text-md ${registrationOpen
                ? isUrgent
                    ? "text-yellow-600"
                    : "text-green-600"
                : "text-red-600"
                }`
        };
    }, [registrationStatus]);

    return (
        <section className="relative py-6 sm:py-8 md:py-10 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                {usingFallback && (
                    <div className="text-amber-600 text-sm mb-4 text-center">
                        Using local fallback content due to connection issues. Please refresh to try again.
                    </div>
                )}
                
                {/* Status Badge */}
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                    {!contentLoaded ? (
                        <TechelonsSkeleton.StatusBadge />
                    ) : (
                        <div className={statusBadgeStyle.container}>
                            <span className={statusBadgeStyle.indicator} aria-hidden="true"></span>
                            <span className={statusBadgeStyle.text}>
                                {registrationStatus.statusMessage}
                            </span>
                        </div>
                    )}
                </div>

                {/* Main Heading */}
                <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-16">
                    {!contentLoaded ? (
                        <TechelonsSkeleton.Heading />
                    ) : (
                        <>
                            <div className="inline-block relative">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 leading-none">
                                    {techelonsContent.title}
                                </h1>
                                <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/0 via-purple-600 to-indigo-600/0 blur-sm" aria-hidden="true"></div>
                            </div>
                            <p className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
                                {techelonsContent.subtitle}
                            </p>
                        </>
                    )}
                </div>

                {/* Mobile Banner - Only for mobile */}
                {isMobile && (
                    <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                        {!contentLoaded ? (
                            <TechelonsSkeleton.MobileBanner />
                        ) : (
                            <div className="relative bg-gradient-to-br from-black to-indigo-950 py-10 px-4">
                                <SpotlightEffects />
                                <div className="relative text-center">
                                    <div className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-white">Tech<span className="text-blue-400">elons</span></div>
                                    <div className="text-base sm:text-lg text-blue-200 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{techelonsContent.festDate}</div>
                                    <div className="text-white/80 text-sm">Shivaji College's Premier Tech Fest</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content */}
                <div className={`${isMobile ? "" : "grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch"}`}>
                    {/* Festival Information */}
                    <div className="h-full flex flex-col space-y-4 sm:space-y-5 md:space-y-6">
                        {/* About Section */}
                        {!contentLoaded ? (
                            <TechelonsSkeleton.AboutSection />
                        ) : (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl border border-gray-100">
                                <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold text-gray-900 mb-2 sm:mb-3">{techelonsContent.aboutTitle}</h2>
                                {techelonsContent.aboutParagraphs.map((paragraph, index) => (
                                    <p key={`about-p-${index}`} className="text-gray-600 text-xs sm:text-sm md:text-base mb-2">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Explore Section */}
                        {!contentLoaded ? (
                            <TechelonsSkeleton.ExploreSection />
                        ) : (
                            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl">
                                <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold mb-2 sm:mb-3">{techelonsContent.exploreTitle}</h2>
                                <p className="text-indigo-100 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                                    {techelonsContent.exploreDescription}
                                </p>

                                <div className="flex flex-col xs:flex-row justify-center items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                                    <button
                                        onClick={handleRegistration}
                                        className="w-full xs:w-auto bg-white text-indigo-800 py-2 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-5 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:bg-white/90 active:transform active:scale-95"
                                        aria-label={registrationStatus.registrationOpen ? "Register Now" : "Registration Closed"}
                                    >
                                        {registrationStatus.registrationOpen ? "Register Now" : "Registration Closed"}
                                    </button>
                                    <button
                                        onClick={handleLearnMore}
                                        className="w-full xs:w-auto text-center bg-indigo-700/50 text-white py-2 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-5 text-sm sm:text-base font-semibold rounded-full border border-indigo-500/30 hover:bg-indigo-700/70 transition-all duration-300 active:transform active:scale-95"
                                        aria-label="Learn More About Events"
                                    >
                                        Explore Events
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3D Scene Container (non-mobile only) */}
                    {!isMobile && (
                        <div className="h-full flex techelons-3d-container">
                            {!contentLoaded ? (
                                <TechelonsSkeleton.Scene3D />
                            ) : (
                                <div className="relative w-full h-full bg-gradient-to-br from-black to-indigo-950 rounded-2xl overflow-hidden shadow-2xl border border-indigo-900/20">
                                    <SpotlightEffects />

                                    <div className="absolute inset-0">
                                        <Suspense fallback={<Scene3DFallback />}>
                                            {shouldRender3D && (
                                                <SplineScene
                                                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                                    className="w-full h-full"
                                                    onLoad={handle3DLoad}
                                                />
                                            )}
                                        </Suspense>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 z-10 pointer-events-none">
                                        <div className="text-white text-center">
                                            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Tech<span className="text-blue-400">elons</span></div>
                                            <div className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-200 mb-2 sm:mb-3 md:mb-4 lg:mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{techelonsContent.festDate}</div>
                                            {shouldRender3D && !is3DLoaded && (
                                                <div className="text-xs md:text-sm bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent font-medium tracking-wide animate-pulse">
                                                    Interactive 3D Experience Loading
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                    {!contentLoaded ? (
                        <>
                            <TechelonsSkeleton.FeatureCard />
                            <TechelonsSkeleton.FeatureCard />
                            <TechelonsSkeleton.FeatureCard />
                        </>
                    ) : (
                        techelonsContent.features.map((feature, index) => (
                            <FeatureCard
                                key={`feature-${index}`}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default memo(TechelonsMain);