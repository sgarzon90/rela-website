export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Le decimos a Google que no indexe el panel admin
      disallow: ["/admin/", "/checkout/", "/account/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  }
}