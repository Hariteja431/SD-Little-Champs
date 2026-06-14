export default function sitemap() {
  // Replace with your actual domain when you add a custom domain to Vercel
  const baseUrl = 'https://sd-little-champs.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // We can add other public pages here if you create separate routes later 
    // (e.g., /about, /contact), but right now everything is a single-page scrolling website.
  ]
}
