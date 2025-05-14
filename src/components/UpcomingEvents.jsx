import React from "react";
import Button from "./Button";
import EventCard from "./EventCard";
function UpcomingEvents() {
  return (
    <div className="container mx-auto my-12 px-4 flex flex-col gap-6">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-6xl font-bold">Upcoming Events</h2>
        <Button>View All</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </div>
  );
}

export default UpcomingEvents;
