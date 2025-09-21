# Database Integration Setup

This project is now connected to a PostgreSQL database hosted on Neon. Here's what has been set up:

## 🗄️ Database Configuration

**Connection String:**
```
postgresql://neondb_owner:npg_cuU7z3plExsy@ep-winter-shadow-ad30554v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 📊 Database Schema

The following tables have been created:

### Tours Table
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `category` (VARCHAR)
- `duration` (VARCHAR)
- `difficulty` (VARCHAR)
- `price` (DECIMAL)
- `max_participants` (INTEGER)
- `image_url` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Bookings Table
- `id` (SERIAL PRIMARY KEY)
- `tour_id` (INTEGER, FOREIGN KEY)
- `customer_name` (VARCHAR)
- `customer_email` (VARCHAR)
- `customer_phone` (VARCHAR)
- `participants` (INTEGER)
- `booking_date` (DATE)
- `total_price` (DECIMAL)
- `status` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Contact Messages Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- `message` (TEXT)
- `created_at` (TIMESTAMP)

### Blog Posts Table
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR)
- `content` (TEXT)
- `excerpt` (TEXT)
- `author` (VARCHAR)
- `image_url` (VARCHAR)
- `published` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Projects Table
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `category` (VARCHAR)
- `location` (VARCHAR)
- `start_date` (DATE)
- `end_date` (DATE)
- `budget` (DECIMAL)
- `status` (VARCHAR)
- `image_url` (VARCHAR)
- `gallery_urls` (TEXT[])
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Programs Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `description` (TEXT)
- `type` (VARCHAR)
- `duration` (VARCHAR)
- `target_audience` (VARCHAR)
- `objectives` (TEXT)
- `activities` (TEXT[])
- `status` (VARCHAR)
- `image_url` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Partners Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `type` (VARCHAR)
- `description` (TEXT)
- `website_url` (VARCHAR)
- `contact_email` (VARCHAR)
- `contact_phone` (VARCHAR)
- `logo_url` (VARCHAR)
- `partnership_type` (VARCHAR)
- `status` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tour Programs Table
- `id` (SERIAL PRIMARY KEY)
- `tour_id` (INTEGER)
- `day_number` (INTEGER)
- `day_title` (VARCHAR)
- `day_overview` (TEXT)
- `difficulty` (VARCHAR)
- `elevation` (VARCHAR)
- `distance` (VARCHAR)
- `activities` (JSONB)
- `highlights` (TEXT[])
- `meals` (TEXT[])
- `accommodation` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🚀 Available Scripts

### Database Initialization
```bash
npm run init-db
```
Initializes the database connection and creates all necessary tables.

### Database Seeding
```bash
npm run seed-db
```
Populates the database with sample data (5 tours, 3 blog posts, projects, programs, and partners).

### Tour Programs Seeding
```bash
npm run seed-programs
```
Populates the database with detailed tour program data for hiking, trekking, and wildlife tours.

### API Server
```bash
npm run server
```
Starts the Express API server on port 3001.

### Frontend Development
```bash
npm run dev
```
Starts the Vite development server on port 8080.

## 🔗 API Endpoints

### Health Check
- `GET /api/health` - Check database connection status

### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour by ID
- `GET /api/tours/category/:category` - Get tours by category

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:email` - Get bookings by email

### Contact Messages
- `POST /api/contact` - Send contact message
- `GET /api/contact/messages` - Get all contact messages

### Blog Posts
- `GET /api/blog` - Get all published blog posts
- `GET /api/blog/:id` - Get blog post by ID

### Projects
- `GET /api/projects` - Get all active projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/category/:category` - Get projects by category

### Programs
- `GET /api/programs` - Get all active programs
- `GET /api/programs/:id` - Get program by ID
- `GET /api/programs/type/:type` - Get programs by type

### Partners
- `GET /api/partners` - Get all active partners
- `GET /api/partners/:id` - Get partner by ID
- `GET /api/partners/type/:type` - Get partners by type

### Tour Programs
- `GET /api/tour-programs/:tourId` - Get tour programs by tour ID
- `GET /api/tour-programs/program/:id` - Get specific tour program
- `POST /api/tour-programs` - Create new tour program
- `PUT /api/tour-programs/:id` - Update tour program
- `DELETE /api/tour-programs/:id` - Delete tour program

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client for Node.js
- **TypeScript** - Type safety

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## 📁 Project Structure

```
src/
├── config/
│   └── database.ts          # Database configuration
├── services/
│   └── databaseService.ts   # Database operations
├── server/
│   └── index.ts            # Express API server
├── scripts/
│   ├── initDatabase.ts     # Database initialization
│   └── seedDatabase.ts     # Sample data seeding
├── hooks/
│   └── useApi.ts           # React hook for API calls
└── components/
    ├── DatabaseTours.tsx   # Component displaying tours from DB
    ├── DatabaseProjects.tsx # Component displaying projects from DB
    ├── DatabasePrograms.tsx # Component displaying programs from DB
    └── DatabasePartners.tsx # Component displaying partners from DB
```

## 🔧 Usage

1. **Start the API server:**
   ```bash
   npm run server
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Visit the website:**
   - Frontend: http://localhost:8080
   - API: http://localhost:3001/api/health

The website now displays live data from the PostgreSQL database in multiple sections on the homepage:
- **Tours from Database** - Live tour data
- **Projects from Database** - Live project data  
- **Programs from Database** - Live program data
- **Partners from Database** - Live partner data

## ✅ What's Working

- ✅ Database connection established
- ✅ All tables created successfully (tours, bookings, contact_messages, blog_posts, projects, programs, partners)
- ✅ Sample data seeded (5 tours, 3 blog posts, 3 projects, 3 programs, 5 partners)
- ✅ API server running with all endpoints
- ✅ Frontend displaying live database data in 4 sections
- ✅ All CRUD operations available via API
- ✅ Modern React components with loading states and error handling

## 📊 Database Statistics

- **Tours**: 5 active tours with categories (trekking, mountaineering, wildlife, cultural)
- **Projects**: 3 active projects (community development, conservation, research)
- **Programs**: 3 active programs (education, youth development, women empowerment)
- **Partners**: 5 active partners (government, international organizations, NGOs, tourism authorities, educational institutions)
- **Blog Posts**: 3 published articles about hiking, sustainability, and cuisine

The project is now fully integrated with the PostgreSQL database and ready for development!
