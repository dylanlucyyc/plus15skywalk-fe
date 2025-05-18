import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function RestaurantCard({ post }) {
  return (
    <div className="border-1 border-black overflow-hidden">
      <img
        src={post?.image}
        alt=""
        className="w-full h-48 object-cover border-b-1"
      />
      <div className="px-2 py-4">
        <h2 className="text-3xl font-regular mb-2">{post?.title}</h2>
        <p
          className="font-medium text-lg"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {post?.description}
        </p>
        <p className="font-medium text-lg mt-6 mb-2 border-t-[0.5px] pt-4">
          <span className="font-bold">Address:</span>{" "}
          {post?.restaurant_details?.address}
        </p>
        <p className="font-medium text-lg mb-2">
          <span className="font-bold">Operating Hours:</span>{" "}
          {post?.restaurant_details?.opening_hours}
        </p>
      </div>
      <Link
        to={`/restaurants/${post?.slug}`}
        className="bg-black px-2 py-4 flex justify-between border-t border-black hover:bg-white group duration-250"
      >
        <span className="inline-block text-center text-white text-xl group-hover:text-black">
          View Details
        </span>
        <div className="flex-shrink-0 self-center">
          <FaArrowRight className="text-xl text-white group-hover:text-black" />
        </div>
      </Link>
    </div>
  );
}

export default React.memo(RestaurantCard);
