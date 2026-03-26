import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { MenuSection } from "@/components/sections/menu-section";
import { ExperiencesSection } from "@/components/sections/experiences-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { BookingSection } from "@/components/sections/booking-section";
import { Footer } from "@/components/sections/footer";
import { RestaurantSchema } from "@/components/seo/restaurant-schema";

export default function Home() {
  return (
    <>
      <RestaurantSchema />
      <Navbar />
      <main>
        <Hero />
        <MenuSection />
        <ExperiencesSection />
        <GallerySection />
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
