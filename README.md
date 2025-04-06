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
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Setup

To access the admin panel, you need to create an admin user in your MongoDB database. 

You can do this by creating a user document in the `users` collection with the following structure:

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "hashed_password",
  "role": "admin"
}
```

For security, make sure to hash the password using bcrypt before storing it.

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

## License

[MIT](https://choosealicense.com/licenses/mit/)