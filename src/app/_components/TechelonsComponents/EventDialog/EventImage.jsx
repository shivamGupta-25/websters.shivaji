import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCategoryIcon } from "./constants";

const EventImage = memo(({
  event,
  imagePath,
  categoryStyle,
  imageError,
  imageLoading,
  imageHeight,
  handleImageLoad,
  handleImageError
}) => {
  if (!event) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
      style={{
        height: imageHeight || 'auto',
        minHeight: '14rem',
        maxHeight: '28rem'
      }}
    >
      {/* Image with optimized loading */}
      {!imageError && (
        <img
          src={imagePath}
          alt={event.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            imageLoading ? "opacity-0" : "opacity-100"
          )}
          loading="eager"
        />
      )}

      {/* Loading state */}
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Fallback for error */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center p-4 animate-fade-in">
            <div className="text-5xl mb-3">{event.emoji || "🎮"}</div>
            <div className="text-white/80 text-sm font-medium tracking-wide uppercase">Image unavailable</div>
          </div>
        </div>
      )}

      {/* Enhanced overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-85"></div>

      {/* Category badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge
          className={cn(
            "text-xs font-medium px-3 py-1 shadow-md transition-transform hover:scale-105 cursor-default",
            categoryStyle?.color || "bg-primary text-primary-foreground"
          )}
        >
          <span className="mr-1.5">{getCategoryIcon(event.category)}</span>
          <span>{event.category}</span>
        </Badge>
      </div>

      {/* Event title with improved typography */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 tracking-tight">
          {event.name}
        </h2>
        {event.tagline && (
          <p className="text-white/90 text-sm md:text-base line-clamp-2 font-medium">
            {event.tagline}
          </p>
        )}
      </div>
    </div>
  );
});

EventImage.displayName = "EventImage";

export default EventImage; 