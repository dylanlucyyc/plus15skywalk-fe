import React from "react";

function LoadingScreen({
  message = "Loading...",
  fullScreen = true,
  variant = "spinner",
  color = "#000",
}) {
  const renderLoadingIndicator = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-2 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full animate-bounce"
                style={{
                  backgroundColor: color,
                  animationDelay: `${i * 0.15}s`,
                }}
              ></div>
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            className="w-16 h-16 rounded-full animate-pulse mb-4 opacity-75"
            style={{ backgroundColor: color }}
          ></div>
        );

      case "spinner":
      default:
        return (
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4"
            style={{ borderColor: color }}
          ></div>
        );
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "h-screen" : "h-64"
      }`}
    >
      {renderLoadingIndicator()}
      {message && <div className="text-xl text-gray-700">{message}</div>}
    </div>
  );
}

export default LoadingScreen;
