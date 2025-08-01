# Getting Started with EduPlatform

This guide will help you get the EduPlatform e-learning website up and running on your local machine.

## Quick Start

### 1. Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)
- npm (comes with Node.js)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd e-learning-platform

# Install root dependencies (for concurrent scripts)
npm install

# Install all dependencies for both frontend and backend
npm run install-all
```

### 3. Environment Setup
```bash
# Navigate to backend directory
cd backend

# Copy environment file
cp .env.example .env

# Edit the .env file with your settings:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/elearning
# JWT_SECRET=your_super_secret_jwt_key_here
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_email_password
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu:
sudo systemctl start mongod

# On Windows:
# Start MongoDB from the Services app or command line
```

### 5. Run the Application
```bash
# From the root directory, start both frontend and backend:
npm run dev

# Or start them separately:
# Terminal 1 - Backend:
npm run server

# Terminal 2 - Frontend:
npm run client
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Demo Accounts

For testing purposes, you can use these demo accounts:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Student Account:**
- Email: `student@example.com`
- Password: `student123`

*Note: You'll need to register these accounts first, or create them through the registration page.*

## Key Features to Test

### As an Admin:
1. **Dashboard**: View platform statistics and recent activity
2. **Classes**: Create and manage live classes
3. **Tasks**: Create assignments and grade submissions
4. **Uploads**: Upload PDFs and course materials
5. **Notifications**: Send announcements to students

### As a Student:
1. **Dashboard**: View enrolled classes and pending tasks
2. **Classes**: Join live classes and access materials
3. **Tasks**: Submit assignments with file uploads
4. **Notifications**: Receive real-time updates

## Project Structure Overview

```
e-learning-platform/
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, Notifications)
│   │   ├── pages/         # Main page components
│   │   └── ...
├── backend/           # Node.js/Express API
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Custom middleware
│   └── ...
└── README.md
```

## Common Issues & Solutions

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check the connection string in `.env`
- Make sure the database name matches your configuration

### Port Already in Use
- Frontend (3000): `lsof -ti:3000 | xargs kill -9`
- Backend (5000): `lsof -ti:5000 | xargs kill -9`

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for frontend and backend directories
```

## Next Steps

1. **Explore the Code**: Look through the components and API routes
2. **Customize**: Modify colors, layouts, and features to match your needs
3. **Deploy**: Follow the deployment guide in README.md
4. **Contribute**: Add new features or improvements

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Look at the API endpoints for backend integration
- Review the component structure for frontend customization

Happy coding! 🚀