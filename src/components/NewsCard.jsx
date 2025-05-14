import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function NewsCard({
  image = `https://picsum.photos/300/300.webp?random=${Math.random()}`,
  category = "Category",
  title = "Name of the news Name of the news Name of the news ews Name of the ne ews Name of the ne",
  key = "",
  link = "#",
}) {
  return (
    <Link to={link}>
      <div key={key} className="flex gap-4 w-full">
        <img
          src={image}
          width="130"
          height="130"
          alt=""
          className="flex-shrink-0"
        />
        <div className="flex-grow min-w-0">
          <span className="text-normal font-regular uppercase">{category}</span>
          <h3
            className="text-3xl font-regular"
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
        <div className="flex-shrink-0 self-center">
          <FaArrowRight className="text-xl" />
        </div>
      </div>
      <span className="w-full border-b border-dashed"></span>
    </Link>
  );
}

export default NewsCard;
