import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, Heart, Leaf } from 'lucide-react';

interface DatabaseTourCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [tourCategories, setTourCategories] = useState<DatabaseTourCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTourCategories();
  }, []);

  const fetchTourCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tour-categories');
      const data = await response.json();
      
      if (data.success) {
        // Filter only active categories and sort by sort_order
        const activeCategories = data.data
          .filter((cat: DatabaseTourCategory) => cat.is_active)
          .sort((a: DatabaseTourCategory, b: DatabaseTourCategory) => a.sort_order - b.sort_order);
        setTourCategories(activeCategories);
      }
    } catch (err) {
      console.error('Error fetching tour categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/campingazerbaijan2014', name: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/camping_azerbaijan/', name: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/campingazerbaijan/', name: 'LinkedIn' },
    { icon: Youtube, href: 'https://www.youtube.com/@campingazerbaijan', name: 'YouTube' },
    { 
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
          <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H1.058l1.812 1.812c-1.365 1.548-2.169 3.553-2.169 5.54 0 4.425 3.582 8.006 8.006 8.006 2.127 0 4.062-.835 5.5-2.19 1.437 1.355 3.372 2.19 5.5 2.19 4.424 0 8.005-3.581 8.005-8.006 0-1.987-.804-3.992-2.169-5.54l1.812-1.812h-3.303c-2.307-1.569-4.975-2.353-7.645-2.353zm-4.312 4.312c2.386 0 4.312 1.927 4.312 4.312 0 2.386-1.926 4.313-4.312 4.313-2.385 0-4.312-1.927-4.312-4.313 0-2.385 1.927-4.312 4.312-4.312zm8.625 0c2.385 0 4.312 1.927 4.312 4.312 0 2.386-1.927 4.313-4.312 4.313-2.386 0-4.313-1.927-4.313-4.313 0-2.385 1.927-4.312 4.313-4.312zm-8.625 1.459c-1.545 0-2.854 1.308-2.854 2.853s1.309 2.853 2.854 2.853c1.544 0 2.853-1.308 2.853-2.853s-1.309-2.853-2.853-2.853zm8.625 0c-1.545 0-2.853 1.308-2.853 2.853s1.308 2.853 2.853 2.853c1.544 0 2.853-1.308 2.853-2.853s-1.309-2.853-2.853-2.853zm-8.625 1.011c.977 0 1.842.864 1.842 1.842 0 .977-.865 1.841-1.842 1.841-.978 0-1.842-.864-1.842-1.841 0-.978.864-1.842 1.842-1.842zm8.625 0c.977 0 1.841.864 1.841 1.842 0 .977-.864 1.841-1.841 1.841-.978 0-1.842-.864-1.842-1.841 0-.978.864-1.842 1.842-1.842z"/>
        </svg>
      ), 
      href: 'https://www.tripadvisor.com/Profile/Campingaze', 
      name: 'TripAdvisor' 
    }
  ];

  return (
    <footer className="text-gray-900" style={{ background: 'rgb(209 211 213)' }}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          
          {/* Contact Info - Left */}
          <div className="lg:w-1/4 space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-900">
                <Phone className="w-4 h-4 text-primary" />
                <span>+994 51 400 90 91</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-900">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@outtour.az</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-900">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Baku, Azerbaijan</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="pt-4 border border-[#d06d3b] p-3 rounded">
              <h5 className="text-sm font-semibold mb-3">Follow Our Adventures</h5>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4 text-gray-900" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Center Section - Quick Links and Tour Categories */}
          <div className="lg:w-1/2 flex flex-col md:flex-row gap-8 justify-center items-center">
            {/* Quick Links */}
            <div className="md:w-1/2 space-y-4 text-center">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-900 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tour Categories */}
            <div className="md:w-1/2 space-y-4 text-center">
              <h4 className="text-lg font-semibold">Tour Categories</h4>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : tourCategories.length > 0 ? (
                <ul className="space-y-2">
                  {tourCategories.map((category) => (
                    <li key={category.id}>
                      <Link 
                        to={`/tours/${category.slug}`} 
                        className="text-gray-900 hover:text-primary transition-colors text-sm"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-900 text-sm">No categories available</p>
              )}
            </div>
          </div>

          {/* Company Info - Right */}
          <div className="lg:w-1/4 space-y-4 text-right">
            <div className="flex items-center justify-end space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Outtour.az</h3>
            </div>
            <p className="text-gray-900 text-sm leading-relaxed">
              Azerbaijan's first ecotour company<br/>
              since 2014. We specialize in sustainable<br/>
              mountain adventures, cultural immersion,<br/>
              and authentic local experiences.
            </p>
            <div className="flex items-center justify-end space-x-2 text-sm text-gray-900">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Over 700 successful tours</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-900 text-sm">
                © {currentYear} Outtour.az. All rights reserved.
              </p>
              <p className="text-gray-900 text-xs mt-1">
                Sustainable tourism • Cultural preservation • Environmental protection
              </p>
              <p className="text-gray-900 text-xs mt-2">
                Created by{' '}
                <a 
                  href="https://midiya.az" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Midiya
                </a>
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-900 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-900 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-900 hover:text-primary transition-colors">
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