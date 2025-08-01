# EduPlatform - E-Learning Website

A comprehensive e-learning platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS. This platform allows administrators to conduct live classes, manage tasks, upload files, and send notifications to students.

## 🚀 Features

### For Administrators
- **Live Class Management**: Schedule, start, and manage live classes with real-time communication
- **Task & Assignment System**: Create, assign, and grade assignments with file attachments
- **File Upload System**: Upload and share PDFs, documents, and multimedia content
- **Notification System**: Send real-time notifications to students and groups
- **Student Management**: View enrolled students and track their progress
- **Dashboard Analytics**: Monitor platform usage and student engagement

### For Students
- **Interactive Dashboard**: View upcoming classes, pending tasks, and notifications
- **Class Participation**: Join live classes and access recorded sessions
- **Assignment Submission**: Submit tasks with file uploads and text responses
- **Real-time Notifications**: Receive instant updates about classes and deadlines
- **Progress Tracking**: Monitor learning progress and grades
- **Resource Access**: Download class materials and resources

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Communication**: Socket.IO integration for live notifications
- **Authentication & Authorization**: JWT-based secure authentication
- **File Management**: Multer integration for file uploads (PDFs, documents, images)
- **Modern UI/UX**: Beautiful and intuitive interface with Tailwind CSS
- **RESTful API**: Well-structured backend API with proper error handling

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Socket.IO Client** - Real-time communication
- **Heroicons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd e-learning-platform
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/elearning
# JWT_SECRET=your_jwt_secret_key_here
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_email_password
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the necessary collections.

### 5. Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
e-learning-platform/
├── frontend/                 # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Layout/       # Layout components (Navbar, Footer)
│   │   │   ├── UI/           # UI components
│   │   │   └── Forms/        # Form components
│   │   ├── contexts/         # React contexts (Auth, Notifications)
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js backend
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── uploads/              # File upload directory
│   ├── server.js             # Main server file
│   └── package.json
└── README.md
```

## 🔐 Authentication

The platform supports two types of users:
- **Admin**: Can create classes, assign tasks, upload files, and send notifications
- **Student**: Can join classes, submit assignments, and receive notifications

### Demo Accounts
The login page includes demo account buttons for testing:
- Admin: `admin@example.com` / `admin123`
- Student: `student@example.com` / `student123`

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop computers (1024px and above)
- Tablets (768px to 1023px)
- Mobile phones (320px to 767px)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create new class (Admin only)
- `GET /api/classes/:id` - Get single class
- `PUT /api/classes/:id` - Update class (Admin only)
- `DELETE /api/classes/:id` - Delete class (Admin only)
- `POST /api/classes/:id/enroll` - Enroll in class
- `POST /api/classes/:id/start` - Start live class (Admin only)

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task (Admin only)
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task (Admin only)
- `POST /api/tasks/:id/submit` - Submit task (Students)
- `POST /api/tasks/:taskId/submissions/:submissionId/grade` - Grade submission (Admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Send notification (Admin only)
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read

### File Uploads
- `POST /api/uploads/single` - Upload single file
- `POST /api/uploads/multiple` - Upload multiple files
- `POST /api/uploads/class-material/:classId` - Upload class material (Admin only)
- `POST /api/uploads/task-attachment/:taskId` - Upload task attachment (Admin only)

## 🔄 Real-time Features

The platform uses Socket.IO for real-time communication:
- Live class notifications
- Instant messaging during classes
- Real-time notification delivery
- Class status updates

## 🎨 UI/UX Features

- **Modern Design**: Clean and professional interface
- **Intuitive Navigation**: Easy-to-use navigation with breadcrumbs
- **Interactive Elements**: Hover effects, animations, and transitions
- **Accessibility**: ARIA labels and keyboard navigation support
- **Loading States**: Loading spinners and skeleton screens
- **Error Handling**: User-friendly error messages and validation

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables for API URL

### Backend Deployment (Heroku/Railway)
1. Set up environment variables on your hosting platform
2. Configure MongoDB connection (MongoDB Atlas recommended)
3. Deploy the backend code
4. Update frontend API URL to point to deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please contact:
- Email: support@eduplatform.com
- Documentation: [Wiki](https://github.com/username/e-learning-platform/wiki)
- Issues: [GitHub Issues](https://github.com/username/e-learning-platform/issues)

## 🙏 Acknowledgments

- React.js team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the flexible database solution
- Socket.IO for real-time communication capabilities
- Heroicons for the beautiful icon set

---

**Happy Learning! 🎓**