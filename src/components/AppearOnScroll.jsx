import React, { useEffect, useRef } from "react";
import "./AppearOnScroll.css";

const AppearOnScroll = ({
  children,
  className = "",
  threshold = 0.1,
  direction = "bottom",
  speed = "normal",
  delay = "",
  rootMargin = "0px 0px -100px 0px",
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Once the animation has played, we can disconnect the observer
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  // Determine direction class
  const directionClass = direction ? `appear-from-${direction}` : "";

  // Determine speed class
  const speedClass =
    speed === "slow" ? "appear-slow" : speed === "fast" ? "appear-fast" : "";

  // Determine delay class
  const delayClass = delay ? `appear-delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={`appear-on-scroll ${directionClass} ${speedClass} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default AppearOnScroll;
