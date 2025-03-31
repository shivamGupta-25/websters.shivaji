// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
import { memo, useState } from "react";
import { ArrowRight, CheckCircle, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionButtons = memo(({ event, handleRegister, registrationStatus, isLoading }) => {
  const [shareSuccess, setShareSuccess] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  // Determine if registration is open based on the passed prop
  const isRegistrationOpen = registrationStatus === 'open';

  // Share handling consolidated into this component
  const handleShare = () => {
    if (!event) return;

    const shareUrl = `${window.location.origin}/techelonsregistration?eventId=${event.id}`;
    const shareTitle = `Check out this event: ${event.name}`;

    // First try Web Share API
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: shareTitle,
        url: shareUrl,
      }).catch(() => {
        // Fallback to clipboard
        copyToClipboard(`${shareTitle} - ${shareUrl}`);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(`${shareTitle} - ${shareUrl}`);
    }
  };

  // Simple clipboard function
  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand('copy');
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        console.error('Unable to copy to clipboard', err);
      }

      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      {isLoading ? (
        <Button disabled className="flex-1 bg-primary/80 h-11 text-sm rounded-lg">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="truncate">Loading...</span>
        </Button>
      ) : isRegistrationOpen ? (
        <Button
          onClick={handleRegister}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          className="flex-1 bg-primary hover:bg-primary/90 h-11 text-sm rounded-lg"
          aria-label="Register Now"
        >
          <span className="truncate transition-transform duration-300"
            style={{ transform: btnHover ? 'translateX(-4px)' : 'translateX(0)' }}>
            Register Now
          </span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300"
            style={{ transform: btnHover ? 'translateX(4px)' : 'translateX(0)' }} />
        </Button>
      ) : null}

      <Button
        onClick={handleShare}
        variant="outline"
        className="flex-1 h-11 text-sm rounded-lg border-border/60 hover:border-primary/40 hover:bg-primary/5"
        aria-label={shareSuccess ? "Copied to clipboard" : "Share Event"}
      >
        {shareSuccess ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span className="truncate">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="mr-2 h-4 w-4" />
            <span className="truncate">Share Event</span>
          </>
        )}
      </Button>
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

export default ActionButtons; 