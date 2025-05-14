import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";

function NewsGrid({ title = "Latest News", articles = [], loading = false }) {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return (
    <div className="container mx-auto my-12 px-4">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <NewsCard
              key={`skeleton-${i}`}
              isLoading={true}
              title=""
              image=""
              date=""
              summary=""
              id=""
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              id={article.id}
              title={article.title}
              image={article.image}
              date={article.date}
              summary={article.summary}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsGrid;
