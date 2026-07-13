# Backend - Node.js Server

## Overview
This is the Node.js backend server for the Tharel Homes real estate application. It handles API endpoints, authentication, database operations, and business logic.

## Technology Stack
- **Runtime**: Node.js
- **Framework**: (To be determined - Express, Fastify, etc.)
- **Database**: (To be determined)
- **Authentication**: (To be determined)

## Project Structure (To Be Created)
```
backend/
├── src/
│   ├── server.js          # Main server entry point
│   ├── config/            # Configuration files
│   │   └── database.js
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── validators/        # Input validation
├── package.json
├── .env.example           # Environment variables template
├── .gitignore
└── README.md
```

## To-Do List

### 1. Setup & Configuration
- [ ] Initialize Node.js project (`npm init` or `yarn init`)
- [ ] Choose and install backend framework (Express, Fastify, etc.)
- [ ] Set up environment variables (.env file)
- [ ] Configure development vs. production environments
- [ ] Set up project structure and folder organization

### 2. Database Setup
- [ ] Choose database (MongoDB, PostgreSQL, MySQL, etc.)
- [ ] Install database driver/ORM
- [ ] Create database connection configuration
- [ ] Design database schema
- [ ] Set up migration system (if needed)

### 3. Authentication & Authorization
- [ ] Implement user authentication (JWT, sessions, OAuth)
- [ ] Create user login/signup endpoints
- [ ] Create password hashing/encryption
- [ ] Set up role-based access control (Admin, Realtor, Buyer, Hotel)
- [ ] Implement protected routes middleware

### 4. Core API Endpoints
- [ ] **User Management**
  - [ ] POST /api/auth/signup
  - [ ] POST /api/auth/login
  - [ ] POST /api/auth/logout
  - [ ] GET /api/users/:id
  - [ ] PUT /api/users/:id

- [ ] **Properties**
  - [ ] GET /api/properties (list all)
  - [ ] GET /api/properties/:id (get single)
  - [ ] POST /api/properties (create)
  - [ ] PUT /api/properties/:id (update)
  - [ ] DELETE /api/properties/:id (delete)
  - [ ] GET /api/properties/search (search/filter)

- [ ] **Favorites**
  - [ ] POST /api/favorites (add to favorites)
  - [ ] DELETE /api/favorites/:id (remove from favorites)
  - [ ] GET /api/favorites (get user favorites)

- [ ] **Dashboard**
  - [ ] Admin dashboard endpoints
  - [ ] Realtor dashboard endpoints
  - [ ] Buyer dashboard endpoints
  - [ ] Hotel dashboard endpoints

- [ ] **Contact/Inquiries**
  - [ ] POST /api/contact (submit contact form)
  - [ ] GET /api/inquiries (for realtor/admin)

### 5. Data Validation & Error Handling
- [ ] Input validation for all endpoints
- [ ] Error handling middleware
- [ ] Consistent error response format
- [ ] Logging system

### 6. Security
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SQL injection prevention (if using SQL)
- [ ] XSS protection
- [ ] HTTPS configuration

### 7. Testing
- [ ] Set up testing framework (Jest, Mocha, etc.)
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] API endpoint tests

### 8. Deployment
- [ ] Docker setup (optional)
- [ ] Environment configuration for production
- [ ] CI/CD pipeline setup
- [ ] Hosting decision (Heroku, AWS, DigitalOcean, etc.)

### 9. Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Setup instructions
- [ ] Deployment guide
- [ ] Contributing guidelines

## Getting Started
```bash
cd backend
npm install
npm run dev
```

## Environment Variables
Create a `.env` file based on `.env.example` with:
- DATABASE_URL
- JWT_SECRET
- NODE_ENV
- PORT
- And other required variables

## Useful Commands
```bash
npm install          # Install dependencies
npm run dev         # Run development server
npm run build       # Build for production
npm start           # Start production server
npm test            # Run tests
npm run lint        # Run linter
```

## Notes
- Ensure backend runs on a different port than the Next.js frontend (default 3000)
- Frontend communicates with backend via API calls
- Implement proper CORS configuration for frontend-backend communication
- Keep sensitive data (passwords, keys) in environment variables only
