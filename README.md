# Affiliate Postback Tracking MVP

This project is a full-stack affiliate tracking minimum viable product (MVP) for an affiliate tracking system that uses Server-to-Server (S2S) postbacks to track conversions.

## System Overview

### What is a Postback?

In affiliate marketing, a postback (also known as a server-to-server or S2S callback) is a server-side communication method used to track conversions without relying on browser cookies or pixels. Here's how it works:

1. **Click Tracking**: When a user clicks on an affiliate's tracking link, our system records the click with a unique identifier (`click_id`).

2. **User Journey**: The user is redirected to the advertiser's website where they may complete a purchase or desired action.

3. **Conversion Notification**: When a conversion occurs, the advertiser's server sends a request (postback) to our system's endpoint with the original `click_id` and conversion details.

4. **Conversion Attribution**: Our system matches the postback's `click_id` with the stored click data, attributing the conversion to the correct affiliate.

This server-to-server approach is more reliable than client-side tracking methods as it's not affected by ad blockers, cookie restrictions, or browser limitations.

### Technical Implementation

In this MVP:

- **Click Storage**: When a click occurs, we store the `affiliate_id`, `campaign_id`, and `click_id` in our MySQL database.

- **Postback URL**: Each affiliate has a unique postback URL in the format: `http://your-domain.com/postback?affiliate_id=X&click_id={click_id}&amount={amount}&currency={currency}`

- **Conversion Tracking**: When the advertiser calls the postback URL (replacing the placeholders with actual values), we record the conversion in our database and associate it with the original click.

- **Real-time Reporting**: The affiliate dashboard displays clicks and conversions in real-time, allowing affiliates to monitor their performance.

## Features

- **Click Tracking:** Stores affiliate clicks in a MySQL database.
- **Postback Endpoint:** Receives and logs conversions for tracked clicks.
- **Affiliate Dashboard:** Displays conversions in a frontend application.
- **Unique Postback URL Generation:** Affiliates can see their own postback URL format.

## 🏗️ Project Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   SQL           │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • Login Page    │    │ • Click Tracking│    │ • affiliates    │
│ • Dashboard     │    │ • Postbacks     │    │ • campaigns     │
│ • Postback URL  │    │ • Affiliate API │    │ • clicks        │
└─────────────────┘    └─────────────────┘    │ • conversions   │
                                              └─────────────────┘
```

### Backend (Node.js/Express)

- **Server**: Express.js REST API
- **Database**: MySQL for data persistence
- **Routes**:
  - `/click` - Records affiliate clicks
  - `/postback` - Processes conversion postbacks
  - `/affiliates` - Manages affiliate data and reporting

### Frontend (Next.js)

- **Pages**:
  - Home page with affiliate selector
  - Dashboard with click and conversion data
  - Postback URL generator
- **Components**:
  - Data tables for displaying clicks and conversions
  - Stats cards for key metrics
  - Loading and error states

### 📊 Database Schema

### Tables

#### `affiliates`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100))

#### `campaigns`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100))

#### `clicks`
- `id` (SERIAL PRIMARY KEY)
- `affiliate_id` (INT, REFERENCES affiliates.id)
- `campaign_id` (INT, REFERENCES campaigns.id)
- `click_id` (VARCHAR(100), UNIQUE per affiliate+campaign)
- `timestamp` (TIMESTAMP DEFAULT NOW())

#### `conversions`
- `id` (SERIAL PRIMARY KEY)
- `click_id` (INT, REFERENCES clicks.id)
- `amount` (FLOAT)
- `currency` (VARCHAR(10))
- `timestamp` (TIMESTAMP DEFAULT NOW())

- **affiliates**: Stores affiliate information
- **campaigns**: Tracks different marketing campaigns
- **clicks**: Records click data with affiliate and campaign references
- **conversions**: Stores conversion data linked to clicks

## Getting Started

### Prerequisites

- Docker and Docker Compose (for containerized setup)
- Node.js (v16+) and npm
- MySQL (v8.0+) (for local development without Docker)

### Installation

#### Option 1: Using Docker (Recommended)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/affiliate-tracking-mvp.git
   cd affiliate-tracking-mvp
   ```

2. **Run the application with Docker:**

   ```bash
   docker-compose up --build
   ```

   This will start the following services:
   - `mysql`: A MySQL database running on port `3306`.
   - `backend`: A Node.js/Express server running on port `3001`.
   - `frontend`: A Next.js application running on port `3000`.

#### Option 2: Local Development with MySQL

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/affiliate-tracking-mvp.git
   cd affiliate-tracking-mvp
   ```

2. **Set up MySQL:**

   - Install MySQL on your machine if not already installed
   - Create a new database:
     ```sql
     CREATE DATABASE affiliate_tracking;
     ```
   - Create a user with appropriate permissions:
     ```sql
     CREATE USER 'affiliate_user'@'localhost' IDENTIFIED BY 'your_password';
     GRANT ALL PRIVILEGES ON affiliate_tracking.* TO 'affiliate_user'@'localhost';
     FLUSH PRIVILEGES;
     ```

3. **Configure the backend:**

   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file with your MySQL credentials:
     ```
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=affiliate_user
     DB_PASSWORD=your_password
     DB_NAME=affiliate_tracking
     ```

4. **Install dependencies:**

   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

5. **Run the migration script to set up the database schema:**

   ```bash
   cd ../backend
   npm run migrate
   ```
   
   This script will:
   - Create the necessary tables (affiliates, campaigns, clicks, conversions)
   - Set up foreign key relationships
   - Insert sample data for testing

6. **Start the development servers:**

   ```bash
   # In one terminal, start the backend
   cd backend
   npm run dev
   
   # In another terminal, start the frontend
   cd frontend
   npm run dev
   ```

   The backend will run on `http://localhost:3001` and the frontend on `http://localhost:3000`.

## Troubleshooting

### Database Connection Issues

- **Error**: `ER_ACCESS_DENIED_ERROR` - Check your MySQL credentials in the `.env` file.
- **Error**: `ER_BAD_DB_ERROR` - Make sure the database exists. Run `CREATE DATABASE affiliate_tracking;` in MySQL.

### Server Startup Issues

- **Error**: `EADDRINUSE` - Another process is using the required port. Find and terminate the process, or change the port in your configuration.
- **Error**: `Cannot find module` - Run `npm install` in both the backend and frontend directories.

### Migration Issues

- If the migration fails, you can manually execute the SQL commands from `backend/migrations/schema.sql` in your MySQL client.

##🔌API Endpoints

### Click Tracking

- **URL:** `/click`
- **Method:** `GET`
- **Query Parameters:**
  - `affiliate_id`: The ID of the affiliate.
  - `campaign_id`: The ID of the campaign.
  - `click_id`: A unique ID for the click.
- **Example Request:**
  ```
  http://localhost:3001/click?affiliate_id=1&campaign_id=10&click_id=abc123
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Click tracked successfully",
    "data": {
      "click_id": "abc123",
      "affiliate_id": 1,
      "campaign_id": 10,
      "timestamp": "2023-08-23T15:30:45.123Z"
    }
  }
  ```

### Postback

- **URL:** `/postback`
- **Method:** `GET`
- **Query Parameters:**
  - `affiliate_id`: The ID of the affiliate.
  - `click_id`: The ID of the click to associate the conversion with.
  - `amount`: The conversion amount.
  - `currency`: The currency of the conversion.
- **Example Request:**
  ```
  http://localhost:3001/postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Conversion tracked successfully",
    "data": {
      "conversion_id": 42,
      "click_id": "abc123",
      "affiliate_id": 1,
      "amount": 100,
      "currency": "USD",
      "timestamp": "2023-08-23T16:45:30.456Z"
    }
  }
  ```

### Get Affiliate Data

- **URL:** `/affiliates/:affiliate_id/clicks`
- **Method:** `GET`
- **URL Parameters:**
  - `affiliate_id`: The ID of the affiliate.
- **Example Request:**
  ```
  http://localhost:3001/affiliates/1/clicks
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "click_id": "abc123",
        "campaign_id": 10,
        "created_at": "2023-08-23T15:30:45.123Z"
      },
      {
        "id": 2,
        "click_id": "def456",
        "campaign_id": 10,
        "created_at": "2023-08-23T15:45:12.789Z"
      }
    ]
  }
  ```

- **URL:** `/affiliates/:affiliate_id/conversions`
- **Method:** `GET`
- **URL Parameters:**
  - `affiliate_id`: The ID of the affiliate.
- **Example Request:**
  ```
  http://localhost:3001/affiliates/1/conversions
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 42,
        "click_id": "abc123",
        "amount": 100,
        "currency": "USD",
        "created_at": "2023-08-23T16:45:30.456Z"
      }
    ]
  }
  ```

## 🔧 Development

### Backend Structure
```
backend/
├── server.js          # Main Express server
├── database.js        # PostgreSQL connection
├── routes/
│   ├── clicks.js      # Click tracking routes
│   ├── postbacks.js   # Conversion postback routes
│   └── affiliates.js  # Affiliate data routes
├── migrations.sql     # Database schema
└── package.json
```
### Frontend Structure
```
frontend/
├── src/app/
│   ├── page.tsx                           # Login page
│   ├── dashboard/[affiliate_id]/page.tsx   # Dashboard
│   └── postback-url/[affiliate_id]/page.tsx # Postback URL
├── tailwind.config.js
└── package.json
```

## Affiliate Dashboard

The affiliate dashboard is available at `http://localhost:3000`. This user-friendly interface provides affiliates with real-time data and tracking tools.

### Dashboard Features

- **Affiliate Selection**: Choose an affiliate from the dropdown menu to view their specific data.
- **Performance Overview**: View key metrics including total clicks, conversions, and conversion rate.
- **Data Tables**: Detailed tables showing recent clicks and conversions with timestamps.
- **Postback URL Generation**: Each affiliate has a unique postback URL displayed on their dashboard for easy integration with advertiser systems.

### Accessing the Dashboard

1. Ensure both the backend and frontend servers are running.
2. Open your browser and navigate to `http://localhost:3000`.
3. Select an affiliate from the dropdown menu to load their data.
4. The dashboard will display the affiliate's clicks, conversions, and their unique postback URL format.

**Happy Tracking! 🎯**
