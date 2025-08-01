import React from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <BookOpenIcon className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">EduPlatform</span>
            </div>
            <p className="text-gray-300 text-sm">
              A comprehensive e-learning platform for modern education. 
              Empowering students and educators with innovative tools for 
              online learning and collaboration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/classes" className="text-gray-300 hover:text-white transition-colors">Classes</a></li>
              <li><a href="/tasks" className="text-gray-300 hover:text-white transition-colors">Tasks</a></li>
              <li><a href="/notifications" className="text-gray-300 hover:text-white transition-colors">Notifications</a></li>
              <li><a href="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EduPlatform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;