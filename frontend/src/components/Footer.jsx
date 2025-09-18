import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Contact Info Column */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4">Get In Touch</h3>
          <p className="flex items-start mb-2">
            <MapPin className="h-5 w-5 mr-2 mt-1 text-red-600 flex-shrink-0" />
            <span>
              No. 467, Syed Sadiq Nagar, Mangadu,
              <br />
              Chennai – 600122, Tamil Nadu, India
            </span>
          </p>
          <p className="flex items-center mb-2">
            <Phone className="h-5 w-5 mr-2 text-red-600" />
            <span>
              <a href="tel:+919087090024" className="hover:text-white transition">+91 – 90870 90024</a> / <a href="tel:+916380665747" className="hover:text-white transition">+91 – 6380 66 5747</a>
            </span>
          </p>
          <p className="flex items-center mb-2">
            <Mail className="h-5 w-5 mr-2 text-red-600" />
            <a href="mailto:abrarbasha94@gmail.com" className="hover:text-white transition">abrarbasha94@gmail.com</a>
          </p>
        </div>

        {/* Social Media Column */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Follow Us</h3>
          <p className="mb-4">Stay connected with us on social media.</p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/profile.php?id=100077454764635" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-7 w-7 text-gray-400 hover:text-red-600 transition" />
            </a>
            <a href="https://twitter.com/GuideButchers" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-7 w-7 text-gray-400 hover:text-red-600 transition" />
            </a>
            <a href="https://www.instagram.com/thebutchersguide/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-7 w-7 text-gray-400 hover:text-red-600 transition" />
            </a>
          </div>
        </div>

        {/* Navigation Links Column */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-red-600 transition-colors duration-300">Home</Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-red-600 transition-colors duration-300">Shop</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-red-600 transition-colors duration-300">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-red-600 transition-colors duration-300">Contact</Link>
            </li>
            <li>
              <Link to="/certification" className="hover:text-red-600 transition-colors duration-300">Certifications</Link>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-700 text-center text-sm">
        <p>
          © {year} Classic Meat & Products. All rights reserved.
        </p>
      </div>
    </footer>
  );
}