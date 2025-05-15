import React from "react";
import HeroText from "../assets/images/+15-skywalk.svg";
import HeroImage from "../assets/images/hero-walking.svg";

function HomeHero() {
  return (
    <div className="flex h-[85vh] flex-col items-center justify-center border-b-1">
      <img src={HeroText} alt="Hero Text" className="hidden md:block" />
      <div className="relative w-full">
        <img
          className="z-10 m-auto relative"
          src={HeroImage}
          alt="Hero Image"
        />
        <span className="w-full border-b border-dashed absolute bottom-20 z-0"></span>
      </div>
    </div>
  );
}

export default HomeHero;
