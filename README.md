# Dream Homes Real Estate Website

A modern real estate web application built with Next.js that allows users to browse property listings and administrators to manage properties through a secure admin panel.

## Features

- **Property Browsing**: Browse property listings with filtering by location
- **Property Details**: View detailed information about each property
- **Admin Panel**: Secure admin interface for property management
- **CRUD Operations**: Create, read, update, and delete property listings
- **Responsive Design**: Fully responsive layout that works on all devices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Available Locations

The application currently supports the following locations for property listings:
- Lawgate
- Green Valley
- Near LPU

These locations are defined in the Property model and used throughout the application for filtering and categorizing properties.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or remote)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/real-estate-website.git
cd real-estate-website
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# Database Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Optional: Cloudinary for Image Upload
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Make sure to replace the placeholder values with your actual configuration details.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Setup

The admin panel is secured using environment variables. To access the admin panel, you need to set up the following credentials in your `.env.local` file:

```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

These credentials will be used for authentication when you log in to the admin panel.

## Project Structure

- `/app`: Next.js app router components
  - `/admin`: Admin panel pages
  - `/api`: API routes for CRUD operations
  - `/components`: Reusable UI components
  - `/lib`: Utility functions and database connection
  - `/models`: MongoDB schemas
  - `/property`: Property detail pages
- `/public`: Static assets

## Deployment

This project can be deployed using services like Vercel, Netlify, or any hosting provider that supports Node.js applications.

```bash
npm run build
npm start
```

## Recent Updates

- **April 2025**: Updated location terminology throughout the application, replacing "Highland Park" with "Near LPU" for better regional relevance
- Fixed MongoDB model caching issues by implementing cache clearing mechanism in the Property model

## License

[MIT](https://choosealicense.com/licenses/mit/)