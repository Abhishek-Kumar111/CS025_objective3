import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  // Mock data - in real app, this would come from API
  const upcomingClasses = [
    {
      id: 1,
      title: 'Mathematics 101',
      instructor: 'Dr. Smith',
      time: '10:00 AM',
      date: 'Today',
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Physics Lab',
      instructor: 'Prof. Johnson',
      time: '2:00 PM',
      date: 'Tomorrow',
      status: 'scheduled'
    }
  ];

  const recentTasks = [
    {
      id: 1,
      title: 'Math Assignment 3',
      class: 'Mathematics 101',
      dueDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      class: 'Physics Lab',
      dueDate: '2024-01-18',
      status: 'submitted'
    }
  ];

  const stats = [
    {
      label: 'Enrolled Classes',
      value: '5',
      icon: AcademicCapIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Pending Tasks',
      value: '3',
      icon: ClipboardDocumentListIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Notifications',
      value: unreadCount.toString(),
      icon: BellIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      label: 'Completed Tasks',
      value: '12',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your learning today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Classes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Classes</h2>
                <Link
                  to="/classes"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <AcademicCapIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900">{classItem.title}</h3>
                          <p className="text-sm text-gray-600">{classItem.instructor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{classItem.time}</p>
                        <p className="text-sm text-gray-600">{classItem.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming classes</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                <Link
                  to="/tasks"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${
                          task.status === 'submitted' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          <ClipboardDocumentListIcon className={`h-5 w-5 ${
                            task.status === 'submitted' ? 'text-green-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.class}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          task.status === 'submitted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status === 'submitted' ? 'Submitted' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/classes"
              className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
            >
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Browse Classes</h3>
                <p className="text-sm text-gray-600">View and join available classes</p>
              </div>
            </Link>

            <Link
              to="/tasks"
              className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
            >
              <ClipboardDocumentListIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">View Tasks</h3>
                <p className="text-sm text-gray-600">Check assignments and deadlines</p>
              </div>
            </Link>

            <Link
              to="/notifications"
              className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              <BellIcon className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600">Stay updated with announcements</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;