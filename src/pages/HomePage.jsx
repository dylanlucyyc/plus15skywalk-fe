import React from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

function HomePage() {
  const { user, isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Welcome, {user?.name}</h1>
          <div>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
          <div>
            <Link to="/profile">View Profile</Link>
            <Link to="/settings">Settings</Link>
          </div>
        </div>
      ) : (
        <div>
          <h1>Welcome to Skywalk</h1>
          <p>Please sign in to access your account</p>
          <div>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
