export default function sitemap() {
  const baseUrl = "https://chakreshchakshu.in";

  // Update this date when page content actually changes — keep it accurate, not build-time.
  const lastModified = "2026-06-25";

  const routes = ["", "/about", "/skills", "/experience", "/projects", "/contact"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
