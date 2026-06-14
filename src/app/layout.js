import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL('https://sd-little-champs.vercel.app'),
  title: "SD Little Champ's English Medium School | Narsipatnam",
  description: "SD Little Champ's English Medium School in Narsipatnam provides top-tier education, nurturing young minds for a brighter future. Admissions Open 2026-27.",
  keywords: ["SD Little Champs", "English Medium School", "Narsipatnam", "Best School in Narsipatnam", "Primary School", "Education", "Top School in Andhra Pradesh", "Kindergarten", "CBSE", "State Syllabus", "Admissions Open"],
  authors: [{ name: "SD Little Champs" }],
  creator: "SD Little Champs",
  publisher: "SD Little Champs",
  openGraph: {
    title: "SD Little Champ's English Medium School | Narsipatnam",
    description: "Empowering Young Minds. Quality education for a brighter future at SD Little Champ's.",
    url: "https://sd-little-champs.vercel.app",
    siteName: "SD Little Champ's E.M School",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "SD Little Champs Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SD Little Champ's English Medium School",
    description: "Shaping Champions of Tomorrow - SD Little Champ's E.M School Narsipatnam",
    images: ["/logo.png"],
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE", // Replace this with your actual GSC code later
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "SD Little Champ's English Medium School",
  "url": "https://sd-little-champs.vercel.app",
  "logo": "https://sd-little-champs.vercel.app/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Narsipatnam",
    "addressRegion": "Andhra Pradesh",
    "addressCountry": "IN"
  },
  "description": "A premium English Medium School in Narsipatnam committed to holistic education and excellence."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
