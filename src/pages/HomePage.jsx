import React from "react";
import useAuth from "../hooks/useAuth";
import HomeHero from "../components/HomeHero";
import ImageCarousel from "../components/ImageCarousel";
import LoadingScreen from "../components/LoadingScreen";
import AboutUs from "../components/AboutUs";
import NewsDisplay from "../features/post/NewsDisplay";
import UpcomingEvents from "../features/post/UpcomingEvents";
import AppearOnScroll from "../components/AppearOnScroll";
function HomePage() {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen message="Initializing application..." />;
  }

  return (
    <>
      <AppearOnScroll>
        <HomeHero />
      </AppearOnScroll>
      <AppearOnScroll>
        <ImageCarousel
          title="Featured Locations"
          totalImages={8}
          imagesPerView={4}
          imageWidth={300}
          imageHeight={300}
        />
      </AppearOnScroll>
      <AppearOnScroll>
        <div className="container mx-auto my-12 px-4 flex gap-6 md:flex-row flex-col">
          <AboutUs />
          <NewsDisplay />
        </div>
      </AppearOnScroll>
      <AppearOnScroll>
        <UpcomingEvents />
      </AppearOnScroll>
    </>
  );
}

export default HomePage;
