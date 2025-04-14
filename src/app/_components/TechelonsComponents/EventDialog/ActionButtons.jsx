// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
import { memo, useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEventDateTime } from "./utils";
import { fetchTechelonsData } from '@/lib/utils';

const ActionButtons = memo(({ event, handleRegister, registrationStatus, isLoading }) => {
  const [shareSuccess, setShareSuccess] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [festDates, setFestDates] = useState({ day1: null, day2: null });

  // Fetch fest dates for both-day events
  useEffect(() => {
    const loadFestDates = async () => {
      try {
        const data = await fetchTechelonsData();
        setFestDates({
          day1: data?.festInfo?.dates?.day1 || null,
          day2: data?.festInfo?.dates?.day2 || null
        });
      } catch (error) {
        console.error("Error loading fest dates:", error);
      }
    };
    
    if (event?.bothDayEvent) {
      loadFestDates();
    }
  }, [event?.bothDayEvent]);

  // Determine if registration is open based on the passed prop
  const isRegistrationOpen = registrationStatus === 'open';

  // Create a formatted share message with event details and emojis
  const createShareMessage = (includeUrl = true) => {
    if (!event) return "";

    const { formattedDate, formattedTime, dayOfWeek } = formatEventDateTime(event);
    
    // Build a formatted message with emojis and details
    let message = `🎯 *${event.name}*\n`;
    
    if (event.tagline) {
      message += `💫 "${event.tagline}"\n\n`;
    }
    
    // Date and time info
    if (event.bothDayEvent) {
      message += `📅 *Both Days Event*\n`;
      message += `   Day 1: ${festDates.day1 || "TBA"}\n`;
      message += `   Day 2: ${festDates.day2 || "TBA"}\n`;
      message += `⏰ ${formattedTime}\n`;
    } else {
      const day = event.festDay === "day1" ? "Day 1" : event.festDay === "day2" ? "Day 2" : "";
      message += `📅 ${day ? day + " | " : ""}${formattedDate} (${dayOfWeek})\n⏰ ${formattedTime}\n`;
    }
    
    // Duration
    if (event.duration) {
      message += `⌛ Duration: ${event.duration}\n`;
    }
    
    // Venue
    if (event.venue) {
      message += `📍 ${event.venue}\n`;
    }
    
    // Description (short version)
    if (event.description) {
      const shortDesc = event.description.length > 150 
        ? event.description.substring(0, 147) + "..." 
        : event.description;
      message += `\n📝 *About:*\n${shortDesc}\n`;
    }
    
    // Prizes if available
    if (event.prizes && event.prizes.length > 0) {
      message += `\n🏆 *Prizes:*\n`;
      event.prizes.forEach((prize, index) => {
        const emoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎁";
        if (typeof prize === 'object' && prize.position && prize.reward) {
          message += `   ${emoji} ${prize.position}: ${prize.reward}\n`;
        } else {
          message += `   ${emoji} ${prize}\n`;
        }
      });
    }
    
    // Coordinator info
    if (event.coordinators && event.coordinators.length > 0) {
      message += `\n👨‍💼 *Contact Coordinator:*\n`;
      event.coordinators.forEach(coord => {
        let coordInfo = `   ${coord.name}`;
        if (coord.phone) coordInfo += ` 📱 ${coord.phone}`;
        message += coordInfo + "\n";
      });
    }
    
    // Registration status
    message += `\n🎟️ Registration: ${registrationStatus === 'open' ? 'OPEN' : 'CLOSED'}\n`;
    
    // Add URL at the end only if includeUrl is true
    if (includeUrl) {
      message += `\n🔗 Register here: ${window.location.origin}/techelonsregistration?eventId=${event.id}`;
    }
    
    return message;
  };

  // Share handling consolidated into this component
  const handleShare = () => {
    if (!event) return;

    const shareUrl = `${window.location.origin}/techelonsregistration?eventId=${event.id}`;
    const shareTitle = `Check out this event: ${event.name}`;
    
    // First try Web Share API
    if (navigator.share) {
      // For Web Share API, don't include URL in the text as it will be added separately
      const shareMessageWithoutUrl = createShareMessage(false);
      navigator.share({
        title: event.name,
        text: shareMessageWithoutUrl,
        url: shareUrl,
      }).catch(() => {
        // Fallback to clipboard with URL included in the message
        copyToClipboard(createShareMessage(true));
      });
    } else {
      // Fallback to clipboard with URL included in the message
      copyToClipboard(createShareMessage(true));
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