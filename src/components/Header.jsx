import React, { useState, memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import navigationData from "../data/navigation.json";
import useAuth from "../hooks/useAuth";

const NavItem = memo(({ item, onClick }) => (
  <li>
    <Link
      to={item.link}
      style={{ fontWeight: item.fontWeight }}
      onClick={onClick}
    >
      {item.label}
    </Link>
  </li>
));

const Header = memo(function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout(() => {
      navigate("/signin");
    });
  }, [logout, navigate]);

  const handleScrollToSection = useCallback((e, link) => {
    if (link.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    }
  }, []);

  const renderNavItems = useCallback(
    (items) => {
      return items.map((item, index) => (
        <React.Fragment key={item.label}>
          <NavItem
            item={item}
            onClick={(e) => handleScrollToSection(e, item.link)}
          />
          {index < items.length - 1 && <li>|</li>}
        </React.Fragment>
      ));
    },
    [handleScrollToSection]
  );

  return (
    <header className="flex w-full font-darker container mx-auto px-4 py-6 flex-shrink-0">
      {/* Logo/Title - Visible on mobile */}
      <div className="md:hidden text-2xl font-black">+15 Skywalk</div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-[20px] list-none justify-start">
        {renderNavItems(navigationData.leftNav)}
      </ul>

      <ul className="hidden md:flex gap-[20px] list-none justify-end ml-auto font-black">
        {renderNavItems(navigationData.rightNav)}
        {isAuthenticated && (
          <>
            <li>
              <Link to="/user/me" className="font-black">
                My Profile
              </Link>
            </li>
            <li>|</li>
          </>
        )}
        <li>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="font-black">
              Log out
            </button>
          ) : (
            <Link to="/signin" className="font-black">
              Sign in
            </Link>
          )}
        </li>
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
                      onClick={(e) => {
                        handleScrollToSection(e, item.link);
                        setIsMenuOpen(false);
                      }}
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
                      onClick={(e) => {
                        handleScrollToSection(e, item.link);
                        setIsMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-4">Account</h3>
              <ul className="space-y-4">
                {isAuthenticated && (
                  <li>
                    <Link
                      to="/user/me"
                      className="text-2xl block font-black"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                )}
                <li>
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-2xl block font-black w-full"
                    >
                      Log out
                    </button>
                  ) : (
                    <Link
                      to="/signin"
                      className="text-2xl block font-black"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
});

export default Header;
