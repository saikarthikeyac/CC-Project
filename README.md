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


