import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Outtour.az. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;