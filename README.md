# College Department Management System

A microservices-based system for managing college departments, faculty, students, and courses.

## Database Setup

All microservices use MongoDB databases. Follow these steps to get started:

### Prerequisites

- MongoDB installed and running on localhost:27017
- Node.js and npm installed

### Initial Database Setup

1. Import the initial faculty data:
   ```
   mongoimport --db faculty_db --collection faculties --file faculty-service/database/faculties.json --jsonArray
   ```
   
   Alternatively, you can use the setup script:
   ```
   node setup/db-init.js
   ```

## User Roles and Permissions

### Administrator
- **Username**: `admin` / **Password**: `admin`
- Has **unrestricted access** to all system features
- Can view, add, edit, and delete any faculty member across all departments
- Can designate HOD positions to faculty members

### Head of Department (HOD)
- Can view all faculty members within their department only
- Can add, edit, and delete faculty members within their own department
- Cannot view or modify faculty from other departments

### Faculty Members
- Can view the faculty directory
- Can update their own profile information
- Cannot modify other faculty members' information

## Microservices

- **Faculty Service**: Manages faculty information (completed)
- **Student Service**: Manages student information (to be implemented)
- **Course Service**: Manages course information (to be implemented)
- **Department Service**: Manages department information (to be implemented)

## Collaboration Instructions

When implementing a new microservice:

1. Create a new directory for your microservice
2. Follow the existing patterns from the faculty service
3. Include database setup files in your_service/database folder
4. Document any new API endpoints in your microservice's README

