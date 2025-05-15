import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function NewsCard({
  image = `https://picsum.photos/300/300.webp?random=${Math.random()}`,
  category = "Category",
  title = "Name of the news Name of the news Name of the news ews Name of the ne ews Name of the ne",
  link = "#",
}) {
  return (
    <Link
      to={link}
      className="block transition-transform hover:-translate-y-1 hover:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] duration-200"
    >
      <div className="flex gap-4 w-full bg-white p-4 group">
        <img
          src={image}
          width="130"
          height="130"
          alt=""
          className="flex-shrink-0 object-cover"
        />
        <div className="flex-grow min-w-0">
          <span className="text-sm font-semibold uppercase text-gray-600 block mb-1">
            {category}
          </span>
          <h3
            className="text-3xl font-regular transition-colors duration-200"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </h3>
        </div>
        <div className="flex-shrink-0 self-center transition-transform group-hover:translate-x-1 duration-200">
          <FaArrowRight className="text-xl text-black" />
        </div>
      </div>
      <span className="w-full border-b-2 border-dashed transition-colors duration-200"></span>
    </Link>
  );
}

export default NewsCard;
