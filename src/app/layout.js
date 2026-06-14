import { Baloo_2, Hind } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hind = Hind({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "SD Little Champ's English Medium School",
  description: "Shaping Champions of Tomorrow - SD Little Champ's E.M School Narsipatnam",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${baloo2.variable} ${hind.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
