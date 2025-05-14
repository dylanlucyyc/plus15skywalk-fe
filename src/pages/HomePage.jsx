import React from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import HomeHero from "../components/HomeHero";
import ImageCarousel from "../components/ImageCarousel";
import LoadingScreen from "../components/LoadingScreen";

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
        imageHeight={200}
      />
    </>
  );
}

export default HomePage;
