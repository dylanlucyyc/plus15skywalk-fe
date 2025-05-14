import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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

  // Generate image URLs
  const imageUrls = Array.from(
    { length: totalImages },
    (_, i) =>
      `https://picsum.photos/${imageWidth}/${imageHeight}.${imageFormat}?random=${i}`
  );

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

  // Get current images to display
  const currentImages = imageUrls.slice(startIndex, startIndex + imagesPerView);

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
            className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={url}
              alt={`Gallery image ${startIndex + index + 1}`}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;
