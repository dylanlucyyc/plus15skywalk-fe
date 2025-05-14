import React from "react";
import NewsCard from "./NewsCard";
import Button from "./Button";

function NewsDisplay() {
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">+15 SKYWALK NEWS</h2>
        <Button as="a" href="/news">
          View All
        </Button>
      </div>
      <div className="flex flex-col gap-4 w-full justify-between">
        <NewsCard key="1" />
        <NewsCard key="2" />
        <NewsCard key="3" />
      </div>
    </div>
  );
}

export default NewsDisplay;
