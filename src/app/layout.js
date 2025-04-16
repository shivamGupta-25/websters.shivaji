import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Jost } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Optimize font loading by only loading the weights you need
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap" // Improves performance by showing fallback font until Jost loads
});

export const metadata = {
  title: "Websters - The Computer Science Society | Shivaji College",
  description: "Websters is the official Computer Science Society of Shivaji College, University of Delhi. Join us to learn, grow, and innovate in technology through workshops, hackathons, and tech events.",
  keywords: "Websters, Computer Science Society, Shivaji College, Delhi University, coding, programming, tech events, hackathons, workshops, technology",
  authors: [{ name: "Websters Tech Team" }],
  creator: "Websters",
  publisher: "Shivaji College, University of Delhi",
  metadataBase: new URL("https://webstersshivaji.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Websters - The Computer Science Society | Shivaji College",
    description: "Websters is the official Computer Science Society of Shivaji College, University of Delhi. Join our tech community to explore coding, workshops, and events.",
    url: "https://webstersshivaji.vercel.app",
    siteName: "Websters",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/webstersLogo.png", // Update with your actual logo path
        width: 800,
        height: 600,
        alt: "Websters Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Websters - The Computer Science Society | Shivaji College",
    description: "Websters is the official Computer Science Society of Shivaji College, University of Delhi.",
    images: ["/assets/webstersLogo.png"], // Update with your actual logo path
  },
};

// Move viewport config to its own export as recommended by Next.js
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000", // Theme color moved here from metadata
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jost.className}>
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}