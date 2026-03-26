"use client";

export function RestaurantSchema() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Osteria Bellavista",
    image: "https://osteriabellavista.ch/images/hero.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Pessina 12",
      addressLocality: "Lugano",
      postalCode: "6900",
      addressCountry: "CH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.0037,
      longitude: 8.9511,
    },
    telephone: "+41911234567",
    email: "info@osteriabellavista.ch",
    url: "https://osteriabellavista.ch",
    priceRange: "$$$",
    servesCuisine: ["Ticinese", "Italian", "Mediterranean"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "12:00",
        closes: "14:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "19:00",
        closes: "22:30",
      },
    ],
    acceptsReservations: "True",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "256",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Osteria Bellavista",
        item: "https://osteriabellavista.ch",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Osteria Bellavista",
    url: "https://osteriabellavista.ch",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://osteriabellavista.ch/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
