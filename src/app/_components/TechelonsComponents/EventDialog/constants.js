// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
import {
  BookOpen,
  Calendar,
  Code,
  ExternalLink,
  Gamepad2,
  Palette,
  Presentation,
  Wrench,
  Loader2
} from "lucide-react";
import { fetchTechelonsData } from '@/lib/utils';

// Constants
export const SHARE_SUCCESS_TIMEOUT = 2000;
export const ICON_SIZE = "h-4 w-4";

// Icon map (memoized objects)
const CATEGORY_ICONS = {
  technical: <Code className="h-3 w-3 mr-1" />,
  workshop: <Wrench className="h-3 w-3 mr-1" />,
  gaming: <Gamepad2 className="h-3 w-3 mr-1" />,
  creative: <Palette className="h-3 w-3 mr-1" />,
  seminar: <Presentation className="h-3 w-3 mr-1" />,
  default: <Calendar className="h-3 w-3 mr-1" />
};

// Status configuration - defined outside component to prevent recreation
export const STATUS_CONFIG = {
  open: {
    color: "bg-emerald-500",
    text: "Registration Open",
    icon: <ExternalLink className="ml-2 h-4 w-4" />,
  },
  "coming-soon": {
    color: "bg-amber-500",
    text: "Coming Soon",
    icon: null,
  },
  closed: {
    color: "bg-rose-500",
    text: "Registration Closed",
    icon: null,
  },
  loading: {
    color: "bg-blue-400",
    text: "Checking Status",
    icon: <Loader2 className="ml-2 h-4 w-4 animate-spin" />,
  },
};

// Category styles for UI display
const CATEGORY_STYLES = {
  technical: {
    color: "bg-blue-500 text-white hover:bg-blue-600"
  },
  workshop: {
    color: "bg-purple-500 text-white hover:bg-purple-600"
  },
  gaming: {
    color: "bg-red-500 text-white hover:bg-red-600"
  },
  creative: {
    color: "bg-green-500 text-white hover:bg-green-600"
  },
  seminar: {
    color: "bg-amber-500 text-white hover:bg-amber-600"
  },
  default: {
    color: "bg-gray-500 text-white hover:bg-gray-600"
  }
};

// Helper function to get category style
export const getCategoryStyle = (category) => {
  const categoryLower = (category || "").toLowerCase();
  return CATEGORY_STYLES[categoryLower] || CATEGORY_STYLES.default;
};

// Helper function to get icon component
export const getCategoryIcon = (category) => {
  const categoryLower = (category || "").toLowerCase();
  return CATEGORY_ICONS[categoryLower] || CATEGORY_ICONS.default;
}; 