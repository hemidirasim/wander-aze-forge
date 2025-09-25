import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mountain className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">Outtour.az</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Azerbaijan's premier eco-tourism company, offering authentic mountain adventures and sustainable travel experiences since 2014.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tours" className="text-gray-300 hover:text-primary transition-colors">
                  All Tours
                </Link>
              </li>
              <li>
                <Link to="/tours/trekking" className="text-gray-300 hover:text-primary transition-colors">
                  Trekking Tours
                </Link>
              </li>
              <li>
                <Link to="/tours/cultural" className="text-gray-300 hover:text-primary transition-colors">
                  Cultural Tours
                </Link>
              </li>
              <li>
                <Link to="/tours/wildlife" className="text-gray-300 hover:text-primary transition-colors">
                  Wildlife Tours
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-primary transition-colors">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    123 Nizami Street<br />
                    Baku, Azerbaijan 1000
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+994501234567" className="text-gray-300 hover:text-primary transition-colors">
                  +994 50 123 45 67
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:info@outtour.az" className="text-gray-300 hover:text-primary transition-colors">
                  info@outtour.az
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Outtour.az. All rights reserved. | Sustainable Tourism in Azerbaijan
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
