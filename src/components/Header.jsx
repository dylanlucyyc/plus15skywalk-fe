import React, { useState } from "react";
import { Link } from "react-router-dom";
import navigationData from "../data/navigation.json";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderNavItems = (items) => {
    return items.map((item, index) => (
      <React.Fragment key={item.label}>
        <li>
          <Link to={item.link} style={{ fontWeight: item.fontWeight }}>
            {item.label}
          </Link>
        </li>
        {index < items.length - 1 && <li>|</li>}
      </React.Fragment>
    ));
  };

  return (
    <header className="flex w-full font-darker container mx-auto px-2 py-6">
      {/* Logo/Title - Visible on mobile */}
      <div className="md:hidden text-2xl font-black">+15 Skywalk</div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-[20px] list-none justify-start">
        {renderNavItems(navigationData.leftNav)}
      </ul>

      <ul className="hidden md:flex gap-[20px] list-none justify-end ml-auto font-black">
        {renderNavItems(navigationData.rightNav)}
      </ul>

      {/* Mobile Burger Button */}
      <button
        className="md:hidden ml-auto"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`w-full h-0.5 bg-black transform transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-full h-0.5 bg-black transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-full h-0.5 bg-black transform transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </div>
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl"
              aria-label="Close menu"
            >
              &#10005;
            </button>
          </div>

          <nav className="flex flex-col space-y-8">
            <div>
              <h3 className="text-xl font-black mb-4">Navigation</h3>
              <ul className="space-y-4">
                {navigationData.leftNav.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.link}
                      className="text-2xl block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-4">Quick Links</h3>
              <ul className="space-y-4">
                {navigationData.rightNav.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.link}
                      className="text-2xl block font-black"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
