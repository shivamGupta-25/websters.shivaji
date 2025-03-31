import { useState, useCallback, useRef, useEffect } from "react";
import { SHARE_SUCCESS_TIMEOUT } from "./constants";

// Custom hooks for sharing event
export const useShareEvent = (event) => {
  const [shareSuccess, setShareSuccess] = useState(false);

  // Improved clipboard handling with error feedback
  const copyToClipboard = useCallback((title, url) => {
    const shareText = `${title} - ${url}`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), SHARE_SUCCESS_TIMEOUT);
        })
        .catch((err) => {
          console.error("Could not copy text:", err);
          // Fallback for clipboard API failure
          fallbackCopyToClipboard(shareText);
        });
    } else {
      // Fallback for browsers without clipboard API
      fallbackCopyToClipboard(shareText);
    }
  }, []);

  // Fallback clipboard method using document.execCommand
  const fallbackCopyToClipboard = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), SHARE_SUCCESS_TIMEOUT);
      }
    } catch (err) {
      console.error("Fallback clipboard copy failed:", err);
    }
  };

  // Enhanced share handler with better error handling
  const handleShare = useCallback(() => {
    if (!event) return;

    const shareUrl = `${window.location.origin}/techelonsregistration?eventId=${event.id}`;
    const shareTitle = `Check out this event: ${event.name} at Techelons 2025`;

    if (navigator.share) {
      navigator
        .share({
          title: event.name,
          text: shareTitle,
          url: shareUrl,
        })
        .then(() => {
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), SHARE_SUCCESS_TIMEOUT);
        })
        .catch((err) => {
          // Only use clipboard fallback for AbortError (user cancelled)
          // or if the share API is not available
          if (err.name !== "AbortError") {
            copyToClipboard(shareTitle, shareUrl);
          }
        });
    } else {
      copyToClipboard(shareTitle, shareUrl);
    }
  }, [event, copyToClipboard]);

  return { handleShare, shareSuccess };
};

/**
 * Custom hook for responsive image handling
 * Simplified to focus only on needed functionality
 */
export const useImageHandling = () => {
  const [imageState, setImageState] = useState({
    error: false,
    loading: true,
    height: "auto",
  });

  // Simpler width detection with fewer moving parts
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Simple resize handler with debounce
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 100);

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Simple debounce implementation
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // Optimized image load handler
  const handleImageLoad = useCallback((e) => {
    const img = e.target;
    const { naturalWidth, naturalHeight } = img;
    const aspectRatio = naturalWidth / naturalHeight;

    // Simple responsive height calculation
    let maxHeight = "16rem";

    if (windowWidth < 640) {
      maxHeight = "12rem";
    } else if (windowWidth < 1024) {
      maxHeight = "16rem";
    } else {
      maxHeight = "20rem";
    }

    setImageState({
      error: false,
      loading: false,
      height: maxHeight,
    });
  }, [windowWidth]);

  const handleImageError = useCallback(() => {
    setImageState({
      error: true,
      loading: false,
      height: windowWidth < 640 ? "12rem" : "16rem",
    });
  }, [windowWidth]);

  const resetImage = useCallback(() => {
    setImageState({
      error: false,
      loading: true,
      height: "auto",
    });
  }, []);

  return {
    imageError: imageState.error,
    imageLoading: imageState.loading,
    imageHeight: imageState.height,
    handleImageLoad,
    handleImageError,
    resetImage,
  };
}; 