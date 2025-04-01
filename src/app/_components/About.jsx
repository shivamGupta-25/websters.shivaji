"use client";
import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fetchSiteContent } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import siteContent from '../data/siteContent';

// Animation configurations - simplified and optimized
const animations = {
    container: {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    },
    title: {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    },
    content: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.7, delay: 0.3, ease: "easeOut" }
        }
    }
};

// Simplified content normalization
const normalizeContent = (content) => {
    if (!content) return siteContent.about;

    return {
        title: content.title || siteContent.about.title,
        paragraphs: Array.isArray(content.paragraphs) && content.paragraphs.length > 0
            ? content.paragraphs.map((p, index) => ({
                id: p.id || `p${index + 1}`,
                content: p.content || `Paragraph ${index + 1}`,
            }))
            : siteContent.about.paragraphs
    };
};

// Optimized paragraph component with better sanitization
const Paragraph = memo(({ html, className = "" }) => {
    // More thorough HTML sanitization
    const sanitizeHtml = (html) => {
        if (!html) return '';
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
            .replace(/javascript:/gi, ''); // Remove javascript: URIs
    };

    return (
        <p
            className={`${className} max-w-full break-words`}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
        />
    );
});

Paragraph.displayName = 'Paragraph';

// Responsive loading skeleton
const LoadingSkeleton = () => (
    <section className="w-full px-4 py-8 sm:px-6 sm:py-8 md:px-8 md:py-8 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-screen-lg text-center">
            <Skeleton className="mx-auto h-12 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl sm:h-16 md:h-20 lg:h-24 mb-4 sm:mb-6 max-w-xs md:max-w-md lg:max-w-lg" />
            <div className="mx-auto mt-4 text-base sm:mt-6 sm:max-w-lg md:max-w-2xl lg:max-w-4xl md:text-lg space-y-3 sm:space-y-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full md:h-5" />
                ))}
                <Skeleton className="h-4 w-3/4 md:h-5" />
                <Skeleton className="mt-4 h-3 w-full sm:mt-6 sm:h-4 sm:w-3/4 mx-auto opacity-60" />
            </div>
        </div>
    </section>
);

const About = () => {
    const [aboutContent, setAboutContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    useEffect(() => {
        const loadContent = async () => {
            try {
                // Implement request timeout with AbortController for cleaner cancellation
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const content = await fetchSiteContent({ signal: controller.signal });
                clearTimeout(timeoutId);

                if (content && content.about) {
                    const normalizedContent = normalizeContent(content.about);
                    setAboutContent(normalizedContent);
                    setUsingFallback(false);
                } else {
                    // No content or no about section in the content
                    console.warn('Fallback to local site content for about section');
                    setUsingFallback(true);
                    setAboutContent(normalizeContent(siteContent.about));
                }
            } catch (error) {
                console.error('Error loading about content:', error);
                setUsingFallback(true);
                setAboutContent(normalizeContent(siteContent.about));
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, []);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    const { title = "", paragraphs = [] } = aboutContent || {};

    return (
        <section
            id="about"
            ref={ref}
            className="w-full px-4 py-8 sm:px-6 sm:py-8 md:px-8 md:py-8 lg:px-8 lg:py-8"
        >
            <motion.div
                className="mx-auto max-w-screen-lg text-center"
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={animations.container}
            >
                <motion.h1
                    className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white sm:mb-6"
                    variants={animations.title}
                >
                    {title && title.length > 50 ? `${title.substring(0, 50)}...` : title}
                </motion.h1>

                <motion.div
                    className="mx-auto mt-4 text-base text-gray-600 sm:mt-6 sm:max-w-lg md:max-w-2xl lg:max-w-4xl dark:text-gray-300 md:text-lg"
                    variants={animations.content}
                >
                    {paragraphs.length > 0 ? (
                        paragraphs.map((paragraph, index) => (
                            <Paragraph
                                key={paragraph.id}
                                html={paragraph.content}
                                className={index > 0 ? "mt-3 sm:mt-4" : ""}
                            />
                        ))
                    ) : (
                        <Paragraph
                            html="Information about our company will be available soon."
                            className="mt-3 italic"
                        />
                    )}

                    {usingFallback && (
                        <p className="mt-4 text-xs italic text-gray-500 sm:mt-6 sm:text-sm">
                            Note: Using local site content. Please check your network connection and refresh the page.
                        </p>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default memo(About);