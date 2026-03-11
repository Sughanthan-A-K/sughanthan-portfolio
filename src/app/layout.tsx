import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Sughanthan A K | Associate Software Engineer",
  description:
    "Portfolio of Sughanthan A K — Associate Software Engineer specializing in React.js, Next.js, TypeScript.",
  icons: {
    icon: "/sughanthan-portfolio/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <SmoothScroll>
            <CustomCursor />
            <ScrollToTop />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
