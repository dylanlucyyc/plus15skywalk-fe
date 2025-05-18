import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import EventCard from "./EventCard";
import { fetchPosts, selectPostsByType } from "./postSlice";

function UpcomingEvents() {
  const dispatch = useDispatch();
  const events = useSelector((state) => selectPostsByType(state, "events"));
  const isLoading = useSelector((state) => state.post.isLoading);

  useEffect(() => {
    // Only fetch if we don't already have events data
    if (events.length === 0) {
      dispatch(
        fetchPosts({
          post_type: "events",
          page: 1,
          search: "",
          filter: "all",
          sort: "newest",
          perPage: 3,
        })
      );
    }
  }, [dispatch, events.length]);

  const renderEventCards = () => {
    if (isLoading && events.length === 0) {
      return (
        <div className="col-span-3 flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <p className="col-span-3 text-center text-gray-500">
          No upcoming events available at the moment
        </p>
      );
    }
    return events
      .slice(0, 3)
      .map((event, index) => <EventCard event={event} key={index} />);
  };

  return (
    <div className="container mx-auto my-12 px-4 flex flex-col gap-6">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-6xl font-bold">Upcoming Events</h2>
        <Button as="a" href="/events">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {renderEventCards()}
      </div>
    </div>
  );
}

export default React.memo(UpcomingEvents);
