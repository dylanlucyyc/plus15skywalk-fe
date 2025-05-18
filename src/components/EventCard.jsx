import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function EventCard({ event }) {
  return (
    <div className="border-1 border-black overflow-hidden">
      <img
        src={event?.image}
        alt={event?.title}
        className="w-full h-48 object-cover border-b-1"
      />
      <div className="px-2 py-4">
        <h2 className="text-3xl font-regular mb-2">{event?.title}</h2>
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
          {event?.event_details?.description}
        </p>
        <p className="font-medium text-lg mt-6 mb-2 border-t-[0.5px] pt-4">
          <span className="font-bold">Time:</span> {event?.event_details?.date}
        </p>
        <p className="font-medium text-lg mb-2">
          <span className="font-bold">Date:</span> {event?.event_details?.date}
        </p>
        <p className="font-medium text-lg">
          <span className="font-bold">Location:</span>{" "}
          {event?.event_details?.location}
        </p>
      </div>
      <Link
        to={`/events/${event?.slug}`}
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

export default React.memo(EventCard);
