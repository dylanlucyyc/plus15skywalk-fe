import React from "react";
import navigationData from "../data/navigation.json";
import footerImage from "../assets/images/footer-image.png";

function Footer() {
  return (
    <footer className="py-15 px-2 md:py-10 bg-black text-center md:text-left">
      <div className="container flex flex-col md:flex-row gap-6  text-white justify-between items-center mx-auto">
        <div>
          <div className="mb-6">
            <p className="text-xl mb-2">Let's connect</p>
            <a
              href="mailto:info@skywalk.com"
              className="text-gray-300 hover:text-white text-2xl md:text-6xl font-caprasimo"
            >
              info@skywalk.com
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-black mb-4">Navigation</h3>
              <ul className="space-y-2">
                {navigationData.leftNav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.link}
                      className="text-gray-300 hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-black mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigationData.rightNav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.link}
                      className="text-gray-300 hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-black mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="tel:+1234567890"
                    className="text-gray-300 hover:text-white"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@skywalk.com"
                    className="text-gray-300 hover:text-white"
                  >
                    info@skywalk.com
                  </a>
                </li>
                <li className="text-gray-300">123 Skywalk Street</li>
                <li className="text-gray-300">New York, NY 10001</li>
              </ul>
            </div>
          </div>

          <div className="">
            &copy;2025 Dylan Luc. This is a fictional project.
          </div>
        </div>
        <div className="hidden lg:block">
          <img
            src={footerImage}
            alt="Plus 15 logo"
            className="mx-auto"
            width="280px"
            height="280px"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
