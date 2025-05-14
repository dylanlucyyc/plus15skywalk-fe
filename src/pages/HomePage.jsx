import React from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import HomeHero from "../components/HomeHero";
function HomePage() {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <HomeHero />
    </>
  );
}

export default HomePage;
