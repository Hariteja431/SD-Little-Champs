export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/owner/', '/teacher/'],
    },
    // Replace with your actual custom domain when you have one
    sitemap: 'https://sd-little-champs.vercel.app/sitemap.xml',
  }
}
