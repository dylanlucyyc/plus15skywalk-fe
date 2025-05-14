import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import LoadingScreen from "./LoadingScreen";

function ImageCarousel({
  title = "Image Gallery",
  totalImages = 8,
  imagesPerView = 4,
  imageWidth = 200,
  imageHeight = 300,
  imageFormat = "webp",
  className = "",
}) {
  // Current starting index
  const [startIndex, setStartIndex] = useState(0);
  // Track loading state for each image
  const [loadingStates, setLoadingStates] = useState({});
  // Track error state for each image
  const [errorStates, setErrorStates] = useState({});

  // Generate image URLs
  const imageUrls = Array.from(
    { length: totalImages },
    (_, i) =>
      `https://picsum.photos/${imageWidth}/${imageHeight}.${imageFormat}?random=${i}`
  );

  // Get current images to display
  const currentImages = imageUrls.slice(startIndex, startIndex + imagesPerView);

  // Reset loading states when images change
  useEffect(() => {
    const newLoadingStates = {};
    const newErrorStates = {};
    for (let i = 0; i < imagesPerView; i++) {
      newLoadingStates[startIndex + i] = true;
      newErrorStates[startIndex + i] = false;
    }
    setLoadingStates((prev) => ({ ...prev, ...newLoadingStates }));
    setErrorStates((prev) => ({ ...prev, ...newErrorStates }));
  }, [startIndex, imagesPerView]);

  // Handle navigation
  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? totalImages - imagesPerView : prev - imagesPerView
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + imagesPerView >= totalImages ? 0 : prev + imagesPerView
    );
  };

  // Image loaded handler
  const handleImageLoaded = (index) => {
    setLoadingStates((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  // Image error handler
  const handleImageError = (index) => {
    setLoadingStates((prev) => ({
      ...prev,
      [index]: false,
    }));
    setErrorStates((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  // Calculate pagination indicator
  const currentPage = Math.floor(startIndex / imagesPerView) + 1;
  const totalPages = Math.ceil(totalImages / imagesPerView);

  return (
    <div className={`container mx-auto my-12 px-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">
            {currentPage} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Previous images"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Next images"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {currentImages.map((url, index) => (
          <div
            key={startIndex + index}
            className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative h-64"
          >
            {loadingStates[startIndex + index] && (
              <div className="absolute inset-0 bg-gray-100">
                <LoadingScreen
                  fullScreen={false}
                  variant="spinner"
                  message=""
                />
              </div>
            )}
            {errorStates[startIndex + index] && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-red-500 text-4xl mb-2">!</div>
                  <p className="text-gray-600">Image failed to load</p>
                </div>
              </div>
            )}
            <img
              src={url}
              alt={`Gallery image ${startIndex + index + 1}`}
              className={`w-full h-64 object-cover ${
                loadingStates[startIndex + index] ||
                errorStates[startIndex + index]
                  ? "opacity-0"
                  : "opacity-100"
              }`}
              loading="lazy"
              onLoad={() => handleImageLoaded(startIndex + index)}
              onError={() => handleImageError(startIndex + index)}
              style={{ transition: "opacity 0.3s ease-in-out" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;
