import React from "react";
import useAuth from "../hooks/useAuth";
import HomeHero from "../components/HomeHero";
import ImageCarousel from "../components/ImageCarousel";
import LoadingScreen from "../components/LoadingScreen";
import AboutUs from "../components/AboutUs";
import NewsDisplay from "../features/post/NewsDisplay";
import UpcomingEvents from "../features/post/UpcomingEvents";
function HomePage() {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen message="Initializing application..." />;
  }

  return (
    <>
      <HomeHero />
      <ImageCarousel
        title="Featured Locations"
        totalImages={8}
        imagesPerView={4}
        imageWidth={300}
        imageHeight={300}
      />
      <div className="container mx-auto my-12 px-4 flex gap-6 md:flex-row flex-col">
        <AboutUs />
        <NewsDisplay />
      </div>
      <UpcomingEvents />
    </>
  );
}

export default HomePage;
