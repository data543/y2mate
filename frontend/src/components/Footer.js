import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4 mt-8">
      <p className="text-gray-600 dark:text-gray-300">
        &copy; {year} Instagram Video Downloader. All rights reserved.
      </p>
      <div className="mt-2">
        <a href="/about" className="text-blue-500 hover:underline mx-2">About</a>
        <a href="/privacy-policy" className="text-blue-500 hover:underline mx-2">Privacy Policy</a>
        <a href="/disclaimer" className="text-blue-500 hover:underline mx-2">Disclaimer</a>
        <a href="/contact" className="text-blue-500 hover:underline mx-2">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;
