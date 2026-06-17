export default function robots() {
  const baseUrl = "https://chakreshchakshu.github.io";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
