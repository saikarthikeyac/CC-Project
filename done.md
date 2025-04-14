# College Department Management System - Implementation Guide

This document explains the current implementation of the faculty management and event management microservices, and provides guidance on how to implement additional microservices while maintaining compatibility with the existing system.

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Services Implemented](#services-implemented)
4. [Database Structure](#database-structure)
5. [Authentication System](#authentication-system)
6. [Role-Based Access Control](#role-based-access-control)
7. [How to Start the System](#how-to-start-the-system)
8. [How to Implement New Microservices](#how-to-implement-new-microservices)
9. [Frontend Integration Guide](#frontend-integration-guide)
10. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

## System Overview

The College Department Management System is a microservices-based application that manages various aspects of a college department. The system currently implements:

1. **Faculty Management Service**: Handles faculty information, authentication, and role-based access
2. **Event Management Service**: Manages department events with role-based permissions

Each service operates independently with its own database, but they share a common authentication mechanism.(faculty_db,event_db)

## Architecture

The system follows a microservices architecture with:

- **Frontend**: HTML/CSS/JavaScript UI (no framework)
- **Backend Services**: Node.js + Express.js microservices
- **Database**: MongoDB (separate database for each service)
- **Authentication**: JWT-based token system

### Service Ports:
- **Faculty Service**: Runs on port 5001
- **Event Service**: Runs on port 3000
- **Backend/Admin Service**: Runs on port 5000

## Services Implemented

### Faculty Service (Port: 5001)
- **Purpose**: Manage faculty information and authentication
- **Database**: MongoDB - `faculty_db` database with `faculties` collection
- **Key Features**:
  - Faculty registration and authentication
  - Role-based access control (Admin/HOD/Faculty)
  - Department-specific permissions

### Event Service (Port: 3000)
- **Purpose**: Manage department events 
- **Database**: MongoDB - `eventDB` database with `events` collection
- **Key Features**:
  - Create, read, update, delete events
  - Department-specific events
  - Role-based permissions (HODs can only manage their department's events)

## Database Structure

### Faculty Database (`faculty_db`)
- **Collection**: `faculties`
- **Schema**:
  ```
  {
    name: String,
    email: String,
    department: String,
    designation: String (HOD, Professor, Assistant Professor, etc.),
    phone: String,
    office: String,
    username: String,
    password: String (hashed),
    passwordChanged: Boolean
  }
  ```

### Event Database (`eventDB`)
- **Collection**: `events`
- **Schema**:
  ```
  {
    title: String,
    description: String,
    date: Date,
    time: String,
    location: String,
    organizer: ObjectId (reference to faculty),
    department: String,
    isActive: Boolean
  }
  ```

## Authentication System

The system uses JSON Web Tokens (JWT) for authentication.

### Token Types
1. **Faculty Token** (x-faculty-token): Generated when faculty members login
2. **Admin Token** (x-auth-token): Generated when admin users login

### JWT Secrets
- **Faculty Secret**: `faculty_jwt_secret`
- **Admin Secret**: `your_jwt_secret`

### Token Contents
- **Faculty Token**:
  ```
  {
    facultyId: ObjectId,
    role: String (designation, e.g., "HOD"),
    department: String,
    firstLogin: Boolean
  }
  ```

- **Admin Token**:
  ```
  {
    userId: String,
    // Other admin properties
  }
  ```

## Role-Based Access Control

### User Roles
1. **Admin**: Has full access to all features and departments
2. **HOD**: Has management permissions within their department
3. **Faculty**: Has basic permissions for their own profile and viewing resources

### Access Permissions by Role

#### Admin
- Can add/edit/delete faculty in any department
- Can manage any events across departments
- Can see all data

#### HOD
- Can add/edit/delete faculty within their department
- Can manage events only for their department
- Can view all faculty within their department

#### Regular Faculty
- Can view faculty directory
- Can view their own profile
- Can view events
- Can only edit their own profile information
- Cannot add/edit other faculty or events (except events they created)

## How to Start the System

### Prerequisites
1. Install Node.js and npm
2. Install MongoDB (or MongoDB Atlas)
3. MongoDB Compass (optional but recommended for database management)

### Starting MongoDB( Mongo db app should be running and connection is started )
1. Start MongoDB server:
   ```
   mongod --dbpath=<your-data-directory>
   ```
2. MongoDB should be running on the default port (27017)

### Starting Services
1. Start Faculty Service:(inside faculty-serive folder run this)
   ```
   cd faculty-service
   npm install
   node server.js
   ```
   The service will start on port 5001

2. Start Event Service:(inside event-service folder)
   ```
   cd event-service
   npm install
   node server.js
   ```
   The service will start on port 3000

   Note: run node server.js inside backend folder also till now 3 terminals should be kept running simultaneously because all have different services implemented as seperate services in different ports

3. Access the frontend:
   Open `frontend/index.html` in a web browser 

### Admin Login
- To access admin features:
  - Username: admin
  - Password: admin
  - This will give you full system access
  -if you dont have databse you first login using this admin login and add some HOD and normal faculty
### Faculty Login Example
- HOD Login:
  - Username: (email prefix, e.g., jhondoe for jdoe@example.com)
  - Default password: faculty123

## How to Implement New Microservices

When implementing new microservices, follow these guidelines to maintain compatibility:

### Directory Structure
Create a new folder in the root directory, e.g., `your-service/`, with this structure:
```
your-service/
├── server.js           # Entry point
├── package.json        # Dependencies
├── controllers/        # Business logic
├── models/             # Data models
├── routes/             # API routes
├── middleware/         # Authentication middleware
│   ├── facultyAuth.js  # Copy from existing service
│   └── roleCheck.js    # Copy from existing service
└── db/                 # Database connection
```

### Authentication Integration
1. Copy the `facultyAuth.js` from the event-service to your new service
2. Use the same JWT verification logic:
   ```javascript
   const facultyAuth = require('./middleware/facultyAuth');
   app.use('/your-api-endpoint', facultyAuth, yourRoutes);
   ```

### Database Connection
1. Create a new MongoDB database for your service
2. Follow this pattern in your connection file:
   ```javascript
   const mongoose = require('mongoose');
   const DB_NAME = 'your_service_db';
   const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}`;
   
   const connectDB = async () => {
     try {
       await mongoose.connect(MONGODB_URI);
       console.log(`MongoDB Connected: ${mongoose.connection.host}`);
     } catch (error) {
       console.error('MongoDB connection error:', error.message);
       process.exit(1);
     }
   };
   
   module.exports = connectDB;
   ```

### Frontend Integration
1. Add a new button to the dashboard.html file in the appropriate user role section:
   ```html
   <button class="action-button" onclick="window.location.href='your-feature.html'">Your Feature</button>
   ```

2. Create a new HTML file for your feature that follows the same authorization pattern:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Your Feature</title>
     <link rel="stylesheet" href="style.css">
   </head>
   <body>
     <h2>Your Feature Title</h2>
     <div style="margin-bottom: 20px;">
       <a href="dashboard.html">Back to Dashboard</a>
     </div>
     
     <!-- Your content here -->
     
     <script>
       const API_URL = 'http://localhost:YOUR_PORT/your/api';
       
       // Get authentication token
       function getAuthToken() {
         return localStorage.getItem('token') || localStorage.getItem('facultyToken');
       }
       
       // Determine header name
       function getHeaderName() {
         return localStorage.getItem('token') ? 'x-auth-token' : 'x-faculty-token';
       }
       
       // Get user information
       function getUserInfo() {
         const faculty = JSON.parse(localStorage.getItem('faculty') || '{}');
         const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
         
         return {
           role: user.role === 'admin' ? 'admin' : 
                 faculty.designation === 'HOD' ? 'HOD' : 
                 faculty.designation === 'Admin' ? 'Admin' : 'faculty',
           department: faculty.department || 'All'
         };
       }
       
       // Your API interactions here
     </script>
   </body>
   </html>
   ```

## Frontend Integration Guide

### How to Get User Information

To access the currently logged-in user information in your frontend code:

1. **Admin users**:
   ```javascript
   const admin = JSON.parse(localStorage.getItem('currentUser') || '{}');
   if (admin.role === 'admin') {
     // This is an admin user
     console.log('Admin name:', admin.username);
   }
   ```

2. **Faculty users** (including HODs):
   ```javascript
   const faculty = JSON.parse(localStorage.getItem('faculty') || '{}');
   if (faculty.designation) {
     // This is a faculty member
     console.log('Faculty name:', faculty.name);
     console.log('Department:', faculty.department);
     console.log('Role:', faculty.designation); // HOD, Professor, etc.
   }
   ```

3. **Combined pattern** (recommended):
   ```javascript
   function getUserInfo() {
     const faculty = JSON.parse(localStorage.getItem('faculty') || '{}');
     const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
     
     return {
       role: user.role === 'admin' ? 'admin' : 
             faculty.designation === 'HOD' ? 'HOD' : 
             faculty.designation === 'Admin' ? 'Admin' : 'faculty',
       department: faculty.department || 'All',
       name: faculty.name || user.username || 'Unknown',
       id: faculty.id || user.id || null
     };
   }
   
   const userInfo = getUserInfo();
   console.log('Current user:', userInfo);
   ```

### API Authentication

When making API calls, include the authentication token:

```javascript
async function fetchData() {
  const token = localStorage.getItem('token') || localStorage.getItem('facultyToken');
  const headerName = localStorage.getItem('token') ? 'x-auth-token' : 'x-faculty-token';
  
  const response = await fetch('http://localhost:YOUR_PORT/your-api', {
    headers: {
      [headerName]: token
    }
  });
  
  const data = await response.json();
  // Process data
}
```

## Common Pitfalls and Solutions

### 1. JWT Token Verification Issues

If you encounter JWT verification errors, ensure:
- You're using the correct JWT secrets (`faculty_jwt_secret` and/or `your_jwt_secret`)
- Your facultyAuth.js middleware is copied correctly from the event-service
- You're sending the token with the correct header (x-faculty-token or x-auth-token)

### 2. Role-Based Access Not Working

If role-based access is not working correctly:
- Check that you're properly setting `req.faculty` in your middleware
- Ensure role/designation comparison is case-insensitive (e.g., 'HOD' vs 'hod')
- Add console.logs to debug token content

### 3. Cross-Service Authentication

If users can't authenticate across services:
- Make sure all services recognize both token types (faculty and admin)
- Ensure services are using the same JWT secrets
- Check that token formats are compatible

## Important Notes

1. **DO NOT MODIFY** the existing faculty-service or event-service code
2. Create your own folders for new services
3. Follow the same authentication pattern in new services
4. Use the same frontend integration pattern for consistency
5. When in doubt, refer to existing code as examples

Happy coding!