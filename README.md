# Real Estate CRM System

A comprehensive Customer Relationship Management (CRM) system designed specifically for real estate professionals. This system helps real estate agents manage their properties, clients, and leads effectively.

## Features

- **User Authentication**
  - Secure login and registration
  - Role-based access control (Admin, Agent, User)
  - Password management

- **Property Management**
  - Add, edit, and delete properties
  - Property search and filtering
  - Property status tracking
  - Image upload and management
  - Property details and features

- **Client Management**
  - Client profiles and information
  - Client preferences and requirements
  - Document management
  - Communication history
  - Client status tracking

- **Lead Management**
  - Lead capture and tracking
  - Lead conversion to clients
  - Lead status updates
  - Follow-up scheduling
  - Lead source tracking

- **Dashboard**
  - Overview of key metrics
  - Recent activities
  - Performance indicators
  - Quick access to important features

## Tech Stack

- **Frontend**
  - HTML5
  - CSS3 (with Bootstrap 5)
  - JavaScript (ES6+)
  - Font Awesome icons

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/real-estate-crm.git
   cd real-estate-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/real-estate-crm
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/search` - Search properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/agent/properties` - Get agent's properties
- `POST /api/properties/:id/favorite` - Toggle property favorite

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/search` - Search clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `POST /api/clients/:id/notes` - Add note to client
- `POST /api/clients/:id/documents` - Add document to client
- `GET /api/clients/agent` - Get agent's clients

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/search` - Search leads
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `POST /api/leads/:id/notes` - Add note to lead
- `POST /api/leads/:id/convert` - Convert lead to client
- `GET /api/leads/agent` - Get agent's leads

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
