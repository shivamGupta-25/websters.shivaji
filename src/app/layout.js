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
  title: "Websters - The Computer Science Society",
  description: "Websters is the official Computer Science Society of Shivaji College, University of Delhi. We are a group of tech enthusiasts who aim to provide a platform for students to learn and grow in the field of technology.",
  openGraph: {
    title: "Websters - The Computer Science Society",
    description: "Websters is the official Computer Science Society of Shivaji College, University of Delhi.",
    type: "website",
    siteName: "Websters",
    // images: [
    //   {
    //     url: "/assets/webstersLogo.png",
    //     width: 800,
    //     height: 600,
    //   },
    // ],
  }
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