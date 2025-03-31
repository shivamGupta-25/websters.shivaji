"use client";

import { memo } from 'react';

/**
 * ScrollToTopButton - A reusable button component that appears when scrolling down
 * and allows users to quickly return to the top of the page.
 */
const ScrollToTopButton = memo(({ visible = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      fixed bottom-4 right-4 
      p-3 rounded-full shadow-lg z-40
      bg-blue-500 hover:bg-blue-600 active:bg-blue-700 
      text-white
      transition-all duration-300
      transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
    `}
    aria-label="Scroll to top"
    title="Scroll to top"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  </button>
));

// Add display name for better debugging in React DevTools
ScrollToTopButton.displayName = 'ScrollToTopButton';

export default ScrollToTopButton;