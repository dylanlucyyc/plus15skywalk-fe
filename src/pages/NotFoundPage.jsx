import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20 min-h-[50vh]">
      <h1 className="text-5xl md:text-6xl mb-6">Page Not Found</h1>
      <p className="mb-8 max-w-[350px] md:max-w-[500px] mx-auto">
        Oops! The page you're looking for seems to be missing. Don't worry –
        these things happen to the best of us.
      </p>
      <Button onClick={() => navigate("/")}>Take Me Home</Button>
    </div>
  );
}

export default NotFoundPage;
