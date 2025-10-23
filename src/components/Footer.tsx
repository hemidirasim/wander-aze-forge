import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, Heart, Leaf } from 'lucide-react';
import Logo from '@/components/Logo';

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
        <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 14 14" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-900 transition-colors" style={{ color: 'inherit' }}>
          <path d="m 12.4125,5.7662386 c 0.1405,-0.6035 0.5875,-1.208 0.5875,-1.208 l -2.006,0 c -1.1255,-0.7275 -2.4905,-1.113 -4.0065,-1.113 -1.57,0 -2.989,0.39 -4.107,1.1255 l -1.8805,0 c 0,0 0.4425,0.593 0.585,1.193 -0.366,0.5035 -0.5835,1.111 -0.5835,1.7785 0,1.658 1.3485,3.0040004 3.006,3.0040004 0.9455,0 1.7855,-0.4425 2.3405,-1.1270004 L 6.9855,10.377239 7.631,9.4092386 c 0.285,0.368 0.66,0.6680004 1.1025,0.8700004 0.7275,0.33 1.546,0.368 2.296,0.09 1.553,-0.5770004 2.348,-2.3105004 1.778,-3.8630004 -0.1045,-0.278 -0.24,-0.5255 -0.405,-0.7425 l 0.01,0.0025 z m -1.5855,4.036 c -0.6,0.2225004 -1.2525,0.1975 -1.835,-0.0715 -0.412,-0.1915 -0.7515,-0.491 -0.994,-0.8635 -0.1005,-0.1495 -0.1875,-0.3115 -0.2515,-0.4855 -0.073,-0.1975 -0.11,-0.4015 -0.1295,-0.6075 -0.037,-0.416 0.0225,-0.8365 0.2025,-1.2265 0.27,-0.582 0.7505,-1.0255 1.3505,-1.248 1.245,-0.457 2.625,0.1805 3.083,1.4205 0.458,1.2405 -0.18,2.6225 -1.4175,3.0815 l -0.0085,0 z m -4.834,-0.917 c -0.4315,0.6355 -1.161,1.0565 -1.9865,1.0565 -1.323,0 -2.4005,-1.078 -2.4005,-2.3985 0,-1.3205 1.078,-2.401 2.4005,-2.401 1.3225,0 2.399,1.0805 2.399,2.401 0,0.082 -0.015,0.157 -0.024,0.2395 -0.0405,0.4055 -0.1705,0.788 -0.3885,1.1105 l 0,-0.008 z m -3.511,-1.3735 c 0,0.8205 0.668,1.4855 1.4855,1.4855 0.8175,0 1.484,-0.665 1.484,-1.4855 0,-0.8175 -0.6665,-1.482 -1.483,-1.482 -0.818,0 -1.4855,0.6645 -1.4855,1.482 l -10e-4,0 z m 6.024,0 c 0,0.8205 0.6645,1.4855 1.484,1.4855 0.818,0 1.4825,-0.665 1.4825,-1.4855 0,-0.8175 -0.6645,-1.482 -1.4825,-1.482 -0.8175,0 -1.4855,0.6645 -1.4855,1.482 l 0.0015,0 z m -5.511,0 c 0,-0.5355 0.4345,-0.9715 0.968,-0.9715 0.532,0 0.9745,0.4365 0.9745,0.9715 0,0.538 -0.4345,0.9755 -0.9745,0.9755 -0.5405,0 -0.9755,-0.4375 -0.9755,-0.9755 l 0.0075,0 z m 6.0165,0 c 0,-0.5355 0.4345,-0.9715 0.9745,-0.9715 0.533,0 0.9685,0.4365 0.9685,0.9715 0,0.538 -0.435,0.9755 -0.976,0.9755 -0.5395,0 -0.9745,-0.4375 -0.9745,-0.9755 l 0.0075,0 z m -2.0265,-3.5415 c 1.0805,0 2.0555,0.1945 2.911,0.581 -0.3225,0.009 -0.6375,0.0655 -0.953,0.18 -0.7575,0.2775 -1.3575,0.8325 -1.6875,1.5625 -0.1575,0.33 -0.24,0.6795 -0.2705,1.0325 -0.1125,-1.538 -1.38,-2.7575 -2.9405,-2.789 0.8555,-0.367 1.846,-0.567 2.9185,-0.567 l 0.022,0 z"/>
        </svg>
      ), 
      href: 'https://www.tripadvisor.com/Profile/Campingaze', 
      name: 'TripAdvisor' 
    }
  ];

  return (
    <footer className="text-gray-900" style={{ background: 'rgb(209 211 213)' }}>
      <div className="container mx-auto footer-padding py-16">
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          
          {/* Contact Info - Left */}
          <div className="lg:w-1/4 space-y-4 text-center lg:text-left">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start space-x-3 text-sm text-gray-900">
                <Phone className="w-4 h-4 text-primary" />
                <span>+994 51 400 90 91</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3 text-sm text-gray-900">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@outtour.az</span>
              </div>
              <div className="flex items-start justify-center lg:justify-start space-x-3 text-sm text-gray-900">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Baku, Azerbaijan</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="pt-4">
              <h5 className="text-sm font-semibold mb-3">Follow Our Adventures</h5>
              <div className="flex justify-center lg:justify-start space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 border border-gray-900 hover:bg-primary hover:border-primary hover:text-white rounded-lg flex items-center justify-center transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4 text-gray-900 transition-colors" style={{ color: 'inherit' }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Center Section - Quick Links and Tour Categories */}
          <div className="lg:w-1/2 flex flex-col md:flex-row gap-8 justify-center items-center md:items-start">
            {/* Quick Links */}
            <div className="md:w-1/2 space-y-4 text-center md:text-left">
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
            <div className="md:w-1/2 space-y-4 text-center md:text-left">
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
          <div className="lg:w-1/4 space-y-4 text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end">
              <Logo className="w-28 h-28" />
            </div>
            <p className="text-gray-900 text-sm leading-relaxed">
              Founded in 2014 as Camping Azerbaijan, Outtour Azerbaijan is recognised as the country's first ecotour operator. We specialise in sustainable mountain adventures, cultural immersion and community-led experiences.
            </p>
            <div className="flex items-center justify-center lg:justify-end space-x-2 text-sm text-gray-900">
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
                © {currentYear} Outtour. All rights reserved.
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