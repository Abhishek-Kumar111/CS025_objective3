import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  VideoCameraIcon,
  DocumentArrowUpIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: VideoCameraIcon,
      title: 'Live Classes',
      description: 'Join interactive live classes with real-time video and audio communication.'
    },
    {
      icon: ClipboardDocumentListIcon,
      title: 'Task Management',
      description: 'Create, assign, and track assignments with automatic grading and feedback.'
    },
    {
      icon: DocumentArrowUpIcon,
      title: 'File Sharing',
      description: 'Upload and share PDFs, documents, and multimedia content seamlessly.'
    },
    {
      icon: BellIcon,
      title: 'Notifications',
      description: 'Stay updated with real-time notifications about classes, tasks, and announcements.'
    },
    {
      icon: UserGroupIcon,
      title: 'Collaboration',
      description: 'Foster student-teacher interaction and peer-to-peer learning.'
    },
    {
      icon: ChartBarIcon,
      title: 'Progress Tracking',
      description: 'Monitor learning progress with detailed analytics and performance insights.'
    }
  ];

  const stats = [
    { label: 'Active Classes', value: '50+' },
    { label: 'Students Enrolled', value: '1000+' },
    { label: 'Tasks Completed', value: '5000+' },
    { label: 'Success Rate', value: '95%' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Welcome to
              <span className="block text-primary-200">EduPlatform</span>
            </h1>
            <p className="text-xl sm:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              A comprehensive e-learning platform where administrators can conduct live classes, 
              manage tasks, share resources, and send notifications to students.
            </p>
            
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200 shadow-lg"
              >
                <AcademicCapIcon className="h-6 w-6 mr-2" />
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200 shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create an engaging and effective online learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Admin Dashboard
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Comprehensive admin tools to manage your entire e-learning platform efficiently.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <VideoCameraIcon className="h-6 w-6 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Live Class Management</h4>
                    <p className="text-gray-600">Schedule, start, and manage live classes with integrated video conferencing.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Task & Assignment Control</h4>
                    <p className="text-gray-600">Create assignments, track submissions, and provide feedback to students.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BellIcon className="h-6 w-6 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Notification System</h4>
                    <p className="text-gray-600">Send instant notifications to students about classes, deadlines, and announcements.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Mathematics Class</div>
                      <div className="text-sm text-gray-600">25 students enrolled</div>
                    </div>
                    <div className="text-sm font-medium text-primary-600">10:00 AM</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Physics Lab</div>
                      <div className="text-sm text-gray-600">15 students enrolled</div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">2:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-primary-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educators and students who are already using EduPlatform 
              to enhance their learning experience.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200 shadow-lg"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;