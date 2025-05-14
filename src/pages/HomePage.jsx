import React from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import HomeHero from "../components/HomeHero";
import ImageCarousel from "../components/ImageCarousel";

function HomePage() {
  const { user, isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <HomeHero />

      <ImageCarousel
        title="Featured Locations"
        totalImages={8}
        imagesPerView={4}
        imageWidth={300}
        imageHeight={200}
      />

      {isAuthenticated ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h1>
          <div className="mb-4">
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
          <div className="flex gap-4">
            <Link to="/profile" className="text-blue-600 hover:underline">
              View Profile
            </Link>
            <Link to="/settings" className="text-blue-600 hover:underline">
              Settings
            </Link>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Skywalk</h1>
          <p className="mb-6">Please sign in to access your account</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signin"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
