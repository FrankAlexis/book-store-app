import Image from "next/image";
import type {Metadata} from "next";
import {GeistSans} from "geist/font/sans";
import {GeistMono} from "geist/font/mono";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Book Store App",
  description: "Created with Next.js and Geist UI",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <header className="bg-primary text-primary-foreground p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <span>Book Store App</span>
            </h1>
            {/* You can add navigation or other elements here */}
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-secondary text-secondary-foreground p-4 text-center shadow-inner mt-8">
          <div className="container mx-auto">
            <p>
              &copy; {new Date().getFullYear()} Book Store App. All rights
              reserved.
            </p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
