# KWS Wildlife Tracking System - Backend API

A comprehensive backend API for the Kenya Wildlife Service (KWS) wildlife tracking system. This API provides endpoints for animal tracking, community reporting, and analytics with AI-powered image recognition.

## Features

- **Authentication & Authorization**
  - User registration and login
  - Role-based access control (Admin, Ranger, Researcher, Community)
  - JWT-based authentication
  - Password encryption

- **Animal Tracking**
  - Create and manage animal profiles
  - Track animal movements with GPS coordinates
  - Upload and analyze animal images using TensorFlow.js
  - Real-time location updates via Socket.IO
  - Movement history and patterns

- **Community Reporting**
  - Submit wildlife sightings
  - Upload images with AI analysis
  - Comment and verification system
  - Priority-based report management
  - Location-based reporting

- **Analytics & Predictions**
  - Movement pattern analysis
  - Species distribution statistics
  - Alert and incident tracking
  - Community report analytics
  - Predictive analytics for wildlife behavior

- **Additional Features**
  - Offline mode support
  - Real-time notifications
  - File upload handling
  - Geospatial queries
  - Rate limiting
  - Error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- TensorFlow.js
- JSON Web Tokens (JWT)
- Multer for file uploads
- Express Validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kws-wildlife-tracker.git
   cd kws-wildlife-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure your environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kws_wildlife_tracker
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Create required directories:
   ```bash
   mkdir uploads logs
   ```

5. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Animal Tracking Endpoints

- `GET /api/animals` - Get all animals
- `GET /api/animals/:id` - Get single animal
- `POST /api/animals` - Create new animal
- `PUT /api/animals/:id` - Update animal
- `POST /api/animals/:id/image` - Upload animal image
- `PUT /api/animals/:id/location` - Update animal location
- `GET /api/animals/species/:species` - Get animals by species
- `GET /api/animals/status/:status` - Get animals by status
- `GET /api/animals/radius` - Get animals within radius

### Community Report Endpoints

- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `POST /api/reports/:id/images` - Upload report images
- `POST /api/reports/:id/verify` - Verify report
- `PUT /api/reports/:id/status` - Update report status
- `POST /api/reports/:id/comments` - Add comment to report
- `GET /api/reports/status/:status` - Get reports by status
- `GET /api/reports/priority/:priority` - Get reports by priority

### Analytics Endpoints

- `GET /api/analytics/movement` - Get movement analytics
- `GET /api/analytics/species` - Get species distribution analytics
- `GET /api/analytics/alerts` - Get alerts analytics
- `GET /api/analytics/reports` - Get community reports analytics
- `POST /api/analytics/predictions` - Generate predictions
- `GET /api/analytics/type/:type` - Get analytics by type
- `GET /api/analytics/latest/:type` - Get latest analytics

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
    "message": "Error message here",
    "errors": [
        "Detailed error 1",
        "Detailed error 2"
    ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@kws-wildlife-tracker.com or create an issue in the repository. 