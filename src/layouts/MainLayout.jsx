import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Subscribe from "../features/subscribe/Subscribe";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Subscribe />
      <Footer />
    </div>
  );
}

export default MainLayout;
