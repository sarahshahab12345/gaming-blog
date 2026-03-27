// src/components/SEO.js — Sets meta tags for each page
import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "PixelGate — Gaming Blog",
  description = "Your ultimate destination for gaming news, reviews, and guides.",
  image = "",
  url = "",
  type = "website",
}) {
  const fullTitle = title.includes("PixelGate") ? title : `${title} | PixelGate`;
  const fullUrl = url || window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph (Facebook, Discord previews) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}
