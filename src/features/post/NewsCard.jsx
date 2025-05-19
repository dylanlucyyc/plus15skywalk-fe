import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import FavoriteButton from "../favorite/FavoriteButton";

function NewsCard({ post }) {
  return (
    <div className="block transition-transform hover:-translate-y-1 hover:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] duration-200">
      <div className="flex gap-4 w-full bg-white p-4 group">
        <img
          src={post.image}
          width="130"
          height="130"
          alt={post.title}
          className="flex-shrink-0 object-cover w-[100px] h-[100px]"
        />
        {console.log(post)}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold uppercase text-gray-600 block mb-1">
              {post.tags || "News"}
            </span>
            <FavoriteButton postId={post._id} size="sm" />
          </div>
          <Link to={`/${post.post_type}/${post.slug}`}>
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
              {post.title}
            </h3>
          </Link>
        </div>
        <div className="flex-shrink-0 self-center transition-transform group-hover:translate-x-1 duration-200">
          <Link to={`/${post.post_type}/${post.slug}`}>
            <FaArrowRight className="text-xl text-black" />
          </Link>
        </div>
      </div>
      <span className="w-full border-b-2 border-dashed transition-colors duration-200"></span>
    </div>
  );
}

export default React.memo(NewsCard);
