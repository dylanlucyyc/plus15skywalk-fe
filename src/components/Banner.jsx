import React from "react";
import Illustration from "../assets/images/Illustration.svg";
import AppearOnScroll from "./AppearOnScroll";

function Banner({ postType }) {
  return (
    <AppearOnScroll direction="left">
      <div className="flex container mx-auto items-center gap-6 py-12 relative">
        <div className="z-10">
          <img src={Illustration} alt="People at cafe illustration" />
        </div>
        <div className="z-10 ">
          <h2 className="text-2xl md:text-6xl font-bold text-white">
            +15 Skywalk {postType}
          </h2>
        </div>
        <div className="absolute top-1/2 translate-y-[-50%] right-0 w-full h-1/2 bg-black z-0"></div>
      </div>
    </AppearOnScroll>
  );
}

export default React.memo(Banner);
