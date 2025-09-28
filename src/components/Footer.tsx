import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Heart, Leaf } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const tourCategories = [
    { name: 'Hiking Tours', href: '/tours/hiking' },
    { name: 'Cultural Tours', href: '/tours/cultural' },
    { name: 'Wildlife Tours', href: '/tours/wildlife' },
    { name: 'Photography Tours', href: '/tours/photography' },
    { name: 'Tailor Made', href: '/tours/tailor-made' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/campingazerbaijan2014', name: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/camping_azerbaijan/', name: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/campingazerbaijan/', name: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/CampingAze', name: 'Twitter' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Outtour.az</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Azerbaijan's first ecotour company since 2014. We specialize in sustainable mountain adventures, 
              cultural immersion, and authentic local experiences.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Over 700 successful tours</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tour Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Tour Categories</h4>
            <ul className="space-y-2">
              {tourCategories.map((category, index) => (
                <li key={index}>
                  <Link 
                    to={category.href} 
                    className="text-gray-300 hover:text-primary transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-primary" />
                <span>+994 51 400 90 91</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@outtour.az</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Baku, Azerbaijan</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="pt-4">
              <h5 className="text-sm font-semibold mb-3">Follow Our Adventures</h5>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Outtour.az. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Sustainable tourism • Cultural preservation • Environmental protection
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;