import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink, Loader2 } from "lucide-react";

// Enhanced UI Components with modern design elements
export const SectionHeading = memo(({ icon, children }) => (
  <h3 className="text-base font-semibold mb-4 flex items-center">
    {icon && (
      <span className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary p-2 rounded-lg mr-3 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
        {icon}
      </span>
    )}
    <span className="relative tracking-tight after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-primary/50 after:to-transparent after:transform after:translate-y-1">
      {children}
    </span>
  </h3>
));
SectionHeading.displayName = "SectionHeading";

export const InfoCard = memo(({ icon, title, children, className }) => (
  <Card className={cn(
    "overflow-hidden border-border/30 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-background to-background/95",
    className
  )}>
    <CardContent className="p-5">
      <div className="flex items-start">
        {icon && (
          <div className="bg-primary/15 rounded-full p-2 mr-3 mt-0.5 flex-shrink-0 shadow-sm">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-medium text-sm mb-3 text-primary/90">{title}</h4>}
          {children}
        </div>
      </div>
    </CardContent>
  </Card>
));
InfoCard.displayName = "InfoCard";

// Enhanced registration status component
export const RegistrationStatus = memo(({ status }) => {
  // Status configuration with improved visuals
  const STATUS_CONFIG = {
    open: {
      color: "bg-emerald-500",
      pulseColor: "bg-emerald-400",
      text: "Registration Open",
      icon: <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />,
      className: "text-emerald-500 group"
    },
    "coming-soon": {
      color: "bg-amber-500",
      pulseColor: "bg-amber-400",
      text: "Coming Soon",
      className: "text-amber-500"
    },
    closed: {
      color: "bg-rose-500",
      pulseColor: "bg-rose-400",
      text: "Registration Closed",
      className: "text-rose-500"
    },
    loading: {
      color: "bg-blue-400",
      pulseColor: "bg-blue-300",
      text: "Checking Status",
      icon: <Loader2 className="ml-2 h-4 w-4 animate-spin" />,
      className: "text-blue-500"
    },
  };

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.closed;

  return (
    <span className={`flex items-center ${config.className || ""}`}>
      <span className="relative inline-flex mr-2">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${config.color}`}></span>
        <span className={`absolute inset-0 inline-block w-2.5 h-2.5 rounded-full ${config.pulseColor} animate-ping opacity-75`}></span>
      </span>
      <span className="font-medium">{config.text}</span>
      {config.icon}
    </span>
  );
});
RegistrationStatus.displayName = "RegistrationStatus"; 