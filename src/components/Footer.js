import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4 mt-12">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        <span>Instagram Video Downloader © {currentYear}</span>
        <div className="space-x-4 mt-2 sm:mt-0">
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/disclaimer" className="hover:underline">
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
