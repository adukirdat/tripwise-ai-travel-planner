# TripWise AI Travel Planner

<div align="center">

**An Intelligent Full-Stack Travel Planning Platform Powered by Google Gemini AI**

[![Frontend: Vercel] (https://tripwise-ai-travel-planner.vercel.app/)]
[![Backend: Render]]
[![Database: MongoDB Atlas]]
[![AI: Google Gemini]]

</div>

---

## 📋 Project Overview

**TripWise** is a full-stack AI-powered travel planning platform that revolutionizes how users plan trips by leveraging Google Gemini AI to generate personalized itineraries instantly. The platform provides comprehensive trip creation with day-by-day activities, hotel recommendations, budget breakdowns, and intelligent packing lists tailored to individual preferences.

### Problem Solved

Travel planning traditionally requires:

- Hours of research across multiple platforms
- Difficulty estimating accurate budgets
- Overwhelming choices and decision fatigue
- Manual itinerary creation prone to errors
- Information fragmented across different sources

**TripWise solves this** by providing an AI assistant that generates complete travel plans in seconds, with customizable itineraries, accurate budget estimation, and verified recommendations—all in one secure platform.

### Key Highlights

- 🤖 **AI-Powered Intelligence**: Google Gemini API for smart, contextual itinerary generation
- 🔐 **Secure Authentication**: JWT-based authentication with bcryptjs password hashing
- 📱 **Responsive Design**: Mobile-first UI optimized for phones, tablets, and desktops
- ⚡ **Production-Ready**: Deployed on Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)
- 🎯 **User-Specific Data**: Complete data isolation and privacy per user with userId filtering
- 💾 **Real-Time Customization**: Regenerate individual days with custom instructions while preserving trip context
- 🌍 **Scalable Architecture**: Stateless API design enables horizontal scaling

---

## 🛠️ Tech Stack & Justification

### Frontend Stack

| Technology           | Purpose                                 | Why Chosen                                                                                   |
| -------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Next.js 15**       | React framework with file-based routing | SSR/SSG capability, automatic optimization, built-in performance features with Turbopack     |
| **TypeScript**       | Type-safe JavaScript development        | Catches bugs at compile time, improves IDE support, reduces runtime errors                   |
| **Tailwind CSS 3.4** | Utility-first CSS framework             | Rapid UI development, consistent design system, smaller bundle size than component libraries |
| **React 19**         | Component-based UI library              | Industry standard, large ecosystem, excellent documentation                                  |
| **Radix UI**         | Accessible component library            | Built on accessibility standards, unstyled for maximum customization with Tailwind           |
| **Lucide React**     | Icon library                            | Consistent, lightweight, supports tree-shaking for smaller bundle                            |

**Justification**: This combination prioritizes developer experience, type safety, and performance. TypeScript prevents entire classes of bugs, Next.js provides automatic optimizations, and Tailwind reduces CSS complexity. The stack is modern, production-tested, and widely adopted.

### Backend Stack

| Technology         | Purpose                        | Why Chosen                                                                                     |
| ------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Node.js 18+**    | JavaScript runtime environment | JavaScript across full stack reduces context switching, large ecosystem                        |
| **Express.js 5.2** | Minimalist web framework       | Lightweight, flexible, well-documented, perfect for REST APIs                                  |
| **MongoDB 7.3**    | NoSQL document database        | Flexible schema matches AI-generated JSON, scales horizontally, Atlas provides managed service |
| **Mongoose 9.7**   | MongoDB object modeling        | Schema validation, middleware support, relationship handling                                   |
| **bcryptjs 3.0**   | Password hashing library       | Industry standard, resistant to brute-force attacks, 12 salt rounds for security               |
| **JWT 9.0**        | JSON Web Token authentication  | Stateless authentication enables scaling, no server-side session storage needed                |

**Justification**: Express + Node.js provides a lightweight, flexible backend suitable for AI integrations. MongoDB's document model is ideal for storing AI-generated JSON responses without transformation. The tech stack avoids unnecessary complexity while maintaining production reliability.

### AI & External Services

| Service                     | Purpose                              | Why Chosen                                                                                   |
| --------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Google Gemini 3.5 Flash** | Structured JSON generation for trips | Fast inference, cost-effective, excellent JSON schema support, proven for travel itineraries |

**Justification**: Gemini 3.5 Flash is optimized for structured outputs. Unlike text-only models, it understands and generates valid JSON matching our schema, reducing validation errors. Flash variant provides better cost-to-performance ratio than standard models.

### Infrastructure & Deployment

| Platform          | Purpose          | Why Chosen                                                                                            |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| **Vercel**        | Frontend hosting | Native Next.js optimization, global CDN, automatic deployments, free tier adequate                    |
| **Render**        | Backend hosting  | Simple deployment, auto-scaling, health checks, free tier suitable for MVP                            |
| **MongoDB Atlas** | Database hosting | Managed service eliminates DevOps overhead, automatic backups, high availability, free tier available |

**Justification**: Managed services minimize operational overhead. Vercel and Render provide auto-scaling and health monitoring without manual infrastructure management. MongoDB Atlas eliminates database administration tasks, allowing focus on product development.

### Stack Trade-offs

| Trade-off                       | Decision              | Reasoning                                                                               |
| ------------------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| **SQL vs NoSQL**                | Chose MongoDB (NoSQL) | AI-generated data is JSON-structured; flexible schema better than rigid SQL tables      |
| **REST vs GraphQL**             | Chose REST            | Simpler for MVP; GraphQL overhead not justified for current query patterns              |
| **Monolithic vs Microservices** | Chose Monolith        | Single Express app simpler to deploy; microservices add complexity not yet needed       |
| **JWT vs Sessions**             | Chose JWT (stateless) | Enables horizontal scaling without session replication; no server-side storage required |
| **Tailwind vs CSS-in-JS**       | Chose Tailwind        | Smaller final bundle; utility-first approach faster than styled-components for rapid UI |

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   FRONTEND (Vercel)                          │
│            Next.js 15 + TypeScript + Tailwind CSS            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Pages: Dashboard, Trip Creation, Customization         │ │
│  │  Components: Trip Cards, Forms, UI Widgets              │ │
│  │  Auth: JWT Token Storage, Protected Routes              │ │
│  │  State: Client-side with localStorage for auth          │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
                           │
                   (REST API + JWT Token)
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                  BACKEND API (Render)                        │
│            Node.js + Express.js + Mongoose                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Routes: Auth, Trips, AI Services                         │ │
│  │ Controllers: Request handling & business logic           │ │
│  │ Middleware: JWT verification, Error handling            │ │
│  │ Services: AI integration, Trip operations                │ │
│  │ Models: Mongoose schemas with validation                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                    │
│              ┌────────────┴──────────────┐                    │
│              │                           │                    │
│         ┌────▼──────┐          ┌────────▼─────────┐         │
│         │  Database │          │  Gemini AI API   │         │
│         │  Queries  │          │  Integration     │         │
│         └────┬──────┘          └──────────────────┘         │
└──────────────┼────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│         DATABASE (MongoDB Atlas)                            │
│  Collections: Users, Trips, Plans, Purchases               │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow & Data Flow

```
1. User Action (Frontend)
   ├── Fill form (destination, duration, preferences)
   └── Click "Generate Trip"
   ↓
2. API Call with JWT Token
   ├── Headers: Authorization: Bearer [JWT_TOKEN]
   ├── Body: Trip parameters
   └── Target: POST /api/ai/generate-trip
   ↓
3. Backend Auth Middleware
   ├── Extract token from Authorization header
   ├── Verify JWT signature using JWT_SECRET
   ├── Load User from database by decoded userId
   └── Attach user context to request
   ↓
4. Route Handler (Controller)
   ├── Validate input parameters
   ├── Delegate to service layer
   └── Prepare response
   ↓
5. Service Layer (Business Logic)
   ├── Call Gemini AI with trip parameters
   ├── Receive structured JSON response
   ├── Validate response against schema
   └── Create Trip document with userId
   ↓
6. Database Persistence
   ├── Save Trip to MongoDB
   ├── Index by userId for fast queries
   └── Ensure data isolation
   ↓
7. Response to Frontend
   ├── Return full Trip object with generated data
   ├── Status: 201 Created
   └── Include success message
   ↓
8. Frontend Updates UI
   ├── Store trip in component state
   ├── Redirect to trip details page
   └── Display AI-generated itinerary
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

**Registration**:

```
User fills form (name, email, password)
    ↓
POST /api/auth/register
    ↓
Backend validates input (non-empty, password ≥ 6 chars)
    ↓
Check email not already registered
    ↓
Hash password with bcryptjs (12 salt rounds)
    ↓
Create User document in MongoDB
    ↓
Generate JWT token (payload: userId, expires: 7 days)
    ↓
Return { token, user }
    ↓
Frontend stores token in localStorage
    ↓
Frontend redirects to /dashboard
```

**Login**:

```
User fills form (email, password)
    ↓
POST /api/auth/login
    ↓
Backend loads User by email
    ↓
Compare submitted password with hashed password (bcryptjs)
    ↓
If match: Generate JWT token
If mismatch: Return 401 Unauthorized
    ↓
Return { token, user }
    ↓
Frontend stores token in localStorage
    ↓
Frontend redirects to /dashboard
```

**Protected Requests**:

```
Frontend includes Authorization header:
Authorization: Bearer [JWT_TOKEN]
    ↓
Backend protect middleware:
  - Extract token from "Bearer [token]" format
  - Verify JWT signature with JWT_SECRET
  - Decode userId from payload
  - Load User from database
    ↓
If valid: Attach user to req.user, continue
If invalid/expired: Return 401, frontend clears token, redirects to /login
```

### Authorization Strategy

| Type                      | Implementation                 | Examples                                       |
| ------------------------- | ------------------------------ | ---------------------------------------------- |
| **User-Owned Resources**  | userId matching on every query | User can only access/modify their own trips    |
| **Protected Routes**      | JWT middleware on backend      | All /api/trips endpoints require valid token   |
| **Frontend Route Guards** | Redirects based on auth state  | Redirect to /login if no token in localStorage |
| **Data Isolation**        | Database query filtering       | `Trip.find({ userId: req.user.id })`           |

### Security Features

| Feature                 | Implementation                  | Details                                                     |
| ----------------------- | ------------------------------- | ----------------------------------------------------------- |
| **Password Hashing**    | bcryptjs with 12 salt rounds    | Prevents plaintext storage, resistant to rainbow tables     |
| **Token Storage**       | localStorage in browser         | Accessible via JavaScript, cleared on logout                |
| **Token Validation**    | Server-side JWT verification    | Signature checked with JWT_SECRET, prevents token tampering |
| **CORS Protection**     | Whitelist CLIENT_URL            | Only frontend origin can make API requests                  |
| **User Data Isolation** | userId filtering in all queries | Every database query includes userId condition              |
| **Token Expiration**    | 7 days (configurable)           | Forces periodic re-authentication                           |
| **HTTP-Only Cookies**   | Not used (localStorage instead) | Simpler implementation for MVP, acceptable for SPA          |

### Public vs Protected Endpoints

**Public** (no authentication):

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`
- `GET /api/plans` (returns 501 - Phase 2)

**Protected** (JWT required):

- `GET /api/auth/me`
- `GET /api/trips`
- `GET /api/trips/:id`
- `POST /api/trips`
- `PUT /api/trips/:id`
- `DELETE /api/trips/:id`
- `POST /api/ai/generate-trip`
- `POST /api/ai/regenerate-day`
- `POST /api/plans` (returns 501)
- `POST /api/plans/:id/purchase` (returns 501)

---

## 🤖 AI Agent Design

### AI Architecture Overview

TripWise implements **Generative AI for Structured Output**, not traditional autonomous agents. The AI generates trip data according to strict schemas and user preferences.

### Gemini AI Model Selection

**Model**: Google Gemini 3.5 Flash

- **Why Gemini**: Optimized for structured JSON generation with schema support
- **Why Flash**: Cost-effective, faster inference than standard models, suitable for real-time requests
- **Context Window**: Sufficient for trip context in day regeneration

### Trip Generation Agent

```
Input Layer:
├─ destination: String ("Tokyo, Japan")
├─ durationDays: Number (1-30)
├─ budgetTier: Enum ("Low", "Medium", "High")
├─ travelerType: Enum ("Solo", "Couple", "Friends", "Family")
├─ interests: Array of Strings (["Food", "Culture", "Shopping"])
└─ additionalNotes: String (optional)
    ↓
Prompt Engineering Layer:
├─ System prompt: "You are TripWise, an AI travel planner"
├─ Input specification: Detailed trip parameters
├─ Schema constraint: Strict JSON structure requirements
├─ Cost guidelines: USD-based realistic pricing
└─ Validation rules: Explicit field requirements
    ↓
Generation Layer (Gemini API):
├─ Send structured prompt with JSON schema
├─ Receive JSON response with:
│  ├─ itinerary: N days with activities
│  ├─ hotels: Accommodations with ratings
│  ├─ estimatedBudget: Breakdown by category
│  └─ packingList: Categorized items
    ↓
Validation Layer:
├─ Check itinerary has exactly N days
├─ Verify each day has activities with required fields
├─ Validate hotel data (names, pricing, ratings)
├─ Verify budget totals are non-negative
├─ Confirm packing items have all fields
    ↓
Storage Layer:
├─ Create Trip document in MongoDB
├─ Include userId for data isolation
├─ Store complete generated data
└─ Return to frontend
```

### Day Regeneration Agent

```
Input:
├─ tripId: ObjectId (which trip to modify)
├─ dayNumber: Number (which day to regenerate)
└─ instruction: String ("Make this day more adventurous")
    ↓
Context Retrieval:
├─ Load existing trip from database
├─ Preserve destination, budget, interests
├─ Keep other days unchanged
└─ Extract current day details
    ↓
Prompt Construction:
├─ Full trip context (destination, budget, type)
├─ Current day activities
├─ User instruction for changes
└─ Constraint: Only regenerate this specific day
    ↓
Generation:
├─ Send to Gemini with context preservation
├─ Receive replacement day with new activities
    ↓
Validation:
├─ Verify day structure matches schema
├─ Check activities have required fields
    ↓
Update:
├─ Replace specific day in itinerary array
├─ Preserve all other trip data
└─ Save to database
```

### Schema Validation Process

All Gemini responses undergo validation before database persistence:

```javascript
// Validate itinerary
✓ Has exactly durationDays entries
✓ Each day has dayNumber and activities array
✓ Each activity has: title, description, estimatedCost (≥0), timeOfDay

// Validate hotels
✓ Array of hotel objects
✓ Each has: name, tier, estimatedCostNight (≥0), rating (0-5)

// Validate budget
✓ All fields present: transport, accommodation, food, activities, total
✓ All values ≥ 0
✓ Total ≥ sum of categories

// Validate packing list
✓ Array of items
✓ Each item has: item, category, isPacked (false initially)
```

### Key Design Principles

| Principle                | Implementation                                         |
| ------------------------ | ------------------------------------------------------ |
| **Determinism**          | Multiple calls with same input produce similar outputs |
| **Schema Fidelity**      | All outputs strictly match predefined JSON schema      |
| **Cost Optimization**    | Use Flash model for cost-effectiveness                 |
| **Error Handling**       | Invalid responses rejected, user notified              |
| **Context Preservation** | Day regeneration maintains trip context                |
| **User Control**         | Users can customize any aspect via regeneration        |

### Creative Feature: Intelligent Day Regeneration

**Unique Capability**: Unlike typical travel planners that regenerate entire trips, TripWise preserves trip context while regenerating individual days. This enables:

1. **Precision Customization**: "Make Day 3 more outdoor-focused" without affecting Days 1-2 and 4-7
2. **Context Awareness**: Gemini receives full trip context (destination, budget, traveler type) for coherent regeneration
3. **Iterative Refinement**: Users can regenerate multiple days independently until satisfied
4. **No Waste**: Preserved data (hotels, budget categories) remains consistent

**Example Flow**:

```
User creates 5-day Bali trip (auto-generated)
  ↓
User views Day 3: "Relax at beach"
  ↓
User requests: "Regenerate Day 3 - more adventure activities"
  ↓
AI receives:
  - Full trip context (Bali, 5 days, Medium budget, Couple)
  - Current Day 3 (for reference)
  - User instruction
  ↓
AI generates: New Day 3 with hiking, water sports, adventure activities
  ↓
Days 1, 2, 4, 5 remain unchanged
  ↓
User can iterate: regenerate Day 4 independently, etc.
```

---

## 📊 Database Design

### Entity Relationships

```
┌─────────┐
│  User   │
│---------|─────────┐
│ _id     │         │
│ name    │         │ 1:N
│ email   │         │
│ password│         │
│ avatar  │         │
└─────────┘         │
                    │
              ┌─────▼──────┐
              │   Trip     │
              │ ---------- │
              │ _id        │
              │ userId (FK)│──────────┐
              │ destination│          │
              │ itinerary[]│          │ 1:N
              │ hotels[]   │          │
              │ budget     │          │
              │ packingList│          │
              └────────────┘          │
                                      │
                           ┌──────────▼────┐
                           │     Plan      │
                           │ ------------- │
                           │ _id           │
                           │ tripId (FK)   │
                           │ creatorId (FK)│
                           │ title         │
                           │ price         │
                           └───────────────┘

Purchase Model:
- userId (FK → User)
- planId (FK → Plan)
- unique(userId, planId)
```

### Collections

#### Users

```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcryptjs),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
unique: email
```

#### Trips

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required, indexed),
  destination: String (required, trimmed),
  durationDays: Number (required, min: 1),
  budgetTier: String (enum: ["Low", "Medium", "High"]),
  travelerType: String (enum: ["Solo", "Couple", "Friends", "Family"]),
  interests: [String],
  additionalNotes: String,
  status: String (enum: ["draft", "active", "completed"], default: "draft"),

  // AI-Generated Content
  itinerary: [{
    dayNumber: Number,
    activities: [{
      title: String,
      description: String,
      estimatedCost: Number,
      timeOfDay: String
    }]
  }],

  hotels: [{
    name: String,
    tier: String,
    estimatedCostNight: Number,
    rating: Number (0-5)
  }],

  estimatedBudget: {
    transport: Number,
    accommodation: Number,
    food: Number,
    activities: Number,
    total: Number
  },

  packingList: [{
    item: String,
    category: String,
    isPacked: Boolean (default: false)
  }],

  isPublished: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
compound: userId + status
```

#### Plans & Purchases

```javascript
// Plans (Marketplace - Phase 2)
{
  _id: ObjectId,
  tripId: ObjectId (ref: Trip),
  creatorId: ObjectId (ref: User),
  title: String (required),
  description: String,
  price: Number (min: 0),
  createdAt: Date
}

// Purchases
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  planId: ObjectId (ref: Plan),
  purchasedAt: Date (default: now)
}

// Indexes
Purchases: unique(userId, planId)
```

---

## 🚀 Setup Instructions

### Local Setup

#### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **MongoDB** (local or MongoDB Atlas connection string)
- **Git** for version control
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/apikey))

#### Step 1: Clone Repository

```bash
git clone https://github.com/adukirdat/Trip_planner.git
cd Trip_planner
```

#### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/tripwise
JWT_SECRET=your_super_secret_key_min_32_characters_for_testing
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_google_api_key_here
CLIENT_URL=http://localhost:3000
EOF

# Start backend server
npm start
```

Backend runs on `http://localhost:5000`

**Check backend health**:

```bash
curl http://localhost:5000/api/health
```

#### Step 3: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

#### Step 4: Verify Installation

1. Open `http://localhost:3000` in browser
2. Click "Sign Up"
3. Register with test account
4. Click "Create Trip"
5. Fill form and submit
6. Verify AI-generated itinerary appears

### Deployment Setup

#### Frontend Deployment (Vercel)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to https://vercel.com and sign in with GitHub
# 3. Click "New Project" and select Trip_planner repository
# 4. Configure environment variable:
#    NEXT_PUBLIC_API_BASE_URL = https://your-render-backend.onrender.com/api
# 5. Click "Deploy"
```

Vercel automatically deploys on every push to main branch.

#### Backend Deployment (Render)

```bash
# 1. Push code to GitHub (same repo as frontend)

# 2. Go to https://render.com and create new account
# 3. Click "New+" → "Web Service"
# 4. Connect GitHub repository
# 5. Configure:
#    - Name: trip-planner-backend
#    - Runtime: Node
#    - Build Command: npm install
#    - Start Command: npm start
# 6. Add environment variables:
#    PORT=10000 (Render assigns port)
#    NODE_ENV=production
#    MONGO_URI=[MongoDB Atlas connection string]
#    JWT_SECRET=[strong random string]
#    JWT_EXPIRES_IN=7d
#    GEMINI_API_KEY=[your Gemini API key]
#    CLIENT_URL=[your Vercel frontend URL]
# 7. Click "Create Web Service"
```

Render automatically deploys on every push to main branch.

#### Database Deployment (MongoDB Atlas)

```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create account and sign in
# 3. Create new project: "TripWise"
# 4. Create cluster: Select M0 (free tier)
# 5. Choose provider: AWS, Region: us-east-1
# 6. Create cluster
# 7. Configure network access:
#    - IP Whitelist: Allow 0.0.0.0/0 (or your IPs)
# 8. Create database user:
#    - Username: tripwise
#    - Password: [generate strong password]
# 9. Get connection string: Database → Connect → Driver: Node.js
# 10. Connection string format:
#     mongodb+srv://tripwise:password@cluster.mongodb.net/tripwise?retryWrites=true&w=majority
# 11. Use this in backend MONGO_URI environment variable
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description       | Auth |
| ------ | -------------------- | ----------------- | ---- |
| POST   | `/api/auth/register` | Register new user | ❌   |
| POST   | `/api/auth/login`    | Login user        | ❌   |
| GET    | `/api/auth/me`       | Get current user  | ✅   |

### Trip Management

| Method | Endpoint         | Description        | Auth |
| ------ | ---------------- | ------------------ | ---- |
| GET    | `/api/trips`     | Get all user trips | ✅   |
| POST   | `/api/trips`     | Create trip        | ✅   |
| GET    | `/api/trips/:id` | Get trip by ID     | ✅   |
| PUT    | `/api/trips/:id` | Update trip        | ✅   |
| DELETE | `/api/trips/:id` | Delete trip        | ✅   |

### AI Services

| Method | Endpoint                 | Description             | Auth |
| ------ | ------------------------ | ----------------------- | ---- |
| POST   | `/api/ai/generate-trip`  | Generate AI itinerary   | ✅   |
| POST   | `/api/ai/regenerate-day` | Regenerate specific day | ✅   |

### Health & Other

| Method | Endpoint                  | Description             | Status |
| ------ | ------------------------- | ----------------------- | ------ |
| GET    | `/api/health`             | API health check        | 200    |
| GET    | `/api/plans`              | Get plans (Phase 2)     | 501    |
| POST   | `/api/plans`              | Create plan (Phase 2)   | 501    |
| POST   | `/api/plans/:id/purchase` | Purchase plan (Phase 2) | 501    |

---

## 🔑 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development|production

# Database
MONGO_URI=mongodb://localhost:27017/tripwise
# Or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/tripwise

# JWT
JWT_SECRET=your_secret_key_32_characters_minimum
JWT_EXPIRES_IN=7d

# AI
GEMINI_API_KEY=your_google_api_key

# CORS
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

**Important**:

- ⚠️ Never commit `.env` files to git
- ⚠️ Add to `.gitignore`
- ⚠️ Use strong random JWT_SECRET
- ⚠️ Keep API keys private

---

## 🔑 Key Design Decisions and Trade-Offs

### 1. **Stateless JWT Authentication vs Server-Side Sessions**

**Decision**: Stateless JWT tokens

**Pros**:

- Enables horizontal scaling without session replication
- No server-side storage needed
- Simpler deployment on managed services
- Works well for SPA architecture

**Cons**:

- Cannot revoke tokens before expiration (mitigated by 7-day expiry)
- Larger token payload increases request size
- Requires client-side storage (localStorage)

**Trade-off**: Chose stateless for simplicity and scalability. 7-day expiration balances security with user experience.

---

### 2. **MongoDB vs Relational Database (SQL)**

**Decision**: MongoDB (NoSQL)

**Pros**:

- Flexible schema matches AI-generated JSON (no transformation needed)
- Document model aligns with trip data structure
- Horizontal scaling easier than traditional SQL
- Easier to add fields without migrations

**Cons**:

- No ACID transactions across collections (less critical for MVP)
- Requires denormalization (higher storage)
- Fewer query optimization strategies

**Trade-off**: AI generates JSON data naturally; storing directly in MongoDB eliminates serialization/deserialization overhead.

---

### 3. **REST API vs GraphQL**

**Decision**: REST API

**Pros**:

- Simpler implementation for MVP
- Caching with HTTP headers (CDN-friendly)
- Easier to debug (standard HTTP tools)
- Lower learning curve

**Cons**:

- Over-fetching data in some queries
- Multiple round-trips for related data
- Less flexible client queries

**Trade-off**: REST is sufficient for current use cases. GraphQL adds complexity without proportional benefit at this stage.

---

### 4. **Frontend State Management: Client-Side vs Server-Side Caching**

**Decision**: Client-side state (localStorage + React state)

**Pros**:

- No server-side storage burden
- Fast local access
- Works offline for cached data
- Simpler deployment

**Cons**:

- Potential data inconsistency
- Limited storage (5-10MB typical)
- User can manually clear localStorage

**Trade-off**: MVP requirements met by client-side caching. Server-side caching adds complexity not yet needed.

---

### 5. **Monolithic Backend vs Microservices**

**Decision**: Monolithic Express.js backend

**Pros**:

- Simpler deployment and debugging
- Easier data consistency
- Lower operational overhead
- Sufficient for current scale

**Cons**:

- Harder to scale individual services
- Single point of failure
- Coupling between features

**Trade-off**: Monolith appropriate for MVP. Microservices pattern can be adopted later if needed.

---

### 6. **Custom Password Hashing vs Third-Party Auth (Auth0, Firebase)**

**Decision**: Custom bcryptjs implementation

**Pros**:

- Full control over authentication flow
- No external dependencies for core feature
- Lower cost (no Auth0/Firebase fees)
- Learning opportunity

**Cons**:

- Must handle edge cases ourselves
- More surface area for security bugs
- No advanced features (2FA, SSO)

**Trade-off**: bcryptjs with 12 salt rounds provides adequate security. Third-party auth adds complexity without current benefit.

---

### 7. **Structured AI Output vs Freeform Text Processing**

**Decision**: Structured JSON schema with Gemini

**Pros**:

- Consistent, predictable output format
- Easy validation and error handling
- Works seamlessly with database storage
- Avoids natural language parsing bugs

**Cons**:

- Less creative/varied responses
- Schema constraints limit flexibility
- More restrictive prompts

**Trade-off**: Structured output is more reliable for production. Predictability outweighs creative variation for travel planning.

---

### 8. **Day Regeneration with Full Context vs Independent Generation**

**Decision**: Preserve full trip context during day regeneration

**Pros**:

- Coherent regenerated days
- Maintains consistency with rest of trip
- User can iteratively refine
- Reduces need to regenerate entire trip

**Cons**:

- Larger context sent to Gemini (higher cost)
- Potential for contradictory suggestions
- More complex service logic

**Trade-off**: Context preservation significantly improves user experience. Slightly higher API cost is acceptable.

---

### 9. **localStorage vs sessionStorage for JWT**

**Decision**: localStorage (persists after browser close)

**Pros**:

- User stays logged in across sessions
- Better user experience
- No re-authentication on browser restart

**Cons**:

- More vulnerable to XSS attacks if token exposed
- Requires explicit logout
- Less secure than httpOnly cookies

**Trade-off**: localStorage acceptable for MVP SPA. httpOnly cookies would require server session management.

---

### 10. **Managed Services vs Self-Hosted Infrastructure**

**Decision**: Vercel + Render + MongoDB Atlas (Managed)

**Pros**:

- Zero DevOps overhead
- Automatic scaling and monitoring
- Built-in SSL/TLS
- High availability included
- Focus on product development

**Cons**:

- Less control over infrastructure
- Potential vendor lock-in
- Less cost-effective at massive scale

**Trade-off**: Managed services dramatically reduce operational burden. Appropriate for MVP and early stage.

---

## ✨ Features Implemented

### ✅ Fully Working

| Feature               | Status | Notes                                             |
| --------------------- | ------ | ------------------------------------------------- |
| User Registration     | ✅     | Email validation, password hashing                |
| User Login            | ✅     | JWT token generation and storage                  |
| Protected Routes      | ✅     | JWT middleware on all user endpoints              |
| Trip Creation         | ✅     | AI-generated via Gemini                           |
| View Trips            | ✅     | User-specific trip listing                        |
| Update Trip           | ✅     | Modify trip details and status                    |
| Delete Trip           | ✅     | Remove trips with confirmation                    |
| AI Itinerary          | ✅     | Day-by-day activities with costs                  |
| Hotel Recommendations | ✅     | AI-generated with ratings                         |
| Budget Breakdown      | ✅     | Transport, accommodation, food, activities        |
| Packing List          | ✅     | Categorized items with checkbox                   |
| Day Regeneration      | ✅     | Regenerate specific days with custom instructions |
| Responsive UI         | ✅     | Mobile, tablet, desktop optimized                 |
| Data Isolation        | ✅     | userId-based filtering on all queries             |

### ⚠️ Partially Implemented

| Feature          | Status | Notes                                    |
| ---------------- | ------ | ---------------------------------------- |
| Plan Marketplace | ⚠️     | Endpoints exist but return 501 (Phase 2) |
| Profile Editing  | ⚠️     | UI exists, backend logic missing         |
| Search           | ⚠️     | UI placeholder only                      |

### ❌ Not Implemented

| Feature                  | Status | Notes                            |
| ------------------------ | ------ | -------------------------------- |
| Payment Processing       | ❌     | Not required for MVP             |
| Email Notifications      | ❌     | Phase 2+ feature                 |
| Trip Sharing             | ❌     | Phase 2+ feature                 |
| Real-Time Updates        | ❌     | WebSocket not implemented        |
| External API Integration | ❌     | Weather, flights, hotels booking |

---

## 🐛 Known Limitations

1. **Plan Marketplace Backend**: API endpoints for creating and purchasing plans return 501 (Not Implemented). This is a Phase 2 feature. Frontend shows hardcoded marketplace plans.

2. **Token Revocation**: Tokens cannot be revoked before 7-day expiration. If a token is compromised, users must wait for expiration or clear localStorage manually.

3. **No Rate Limiting**: API endpoints are not rate-limited, making them vulnerable to brute-force attacks. Should implement rate limiting in production.

4. **Profile Editing**: Edit Profile button in UI has no backend implementation. User profiles cannot be updated after creation.

5. **Search Functionality**: Search box exists in navigation but search logic not implemented.

6. **Single Modal Error Handling**: Error messages are generic. Could be more specific about validation failures.

7. **No Email Verification**: User email not verified at registration. Could result in typos going undetected.

8. **No API Documentation**: No Swagger/OpenAPI documentation. API structure must be learned from source code or this README.

9. **Limited Logging**: No centralized logging system for debugging production issues.

10. **No Input Sanitization**: Inputs not sanitized against XSS attacks. Must add input validation before production deployment.

---

## 📚 Future Enhancements

### Phase 2: Marketplace & Sharing

- [ ] Complete plan marketplace backend
- [ ] Purchase tracking
- [ ] Plan creator profiles
- [ ] Trip sharing with friends

### Phase 3: Advanced Features

- [ ] Trip collaboration (multiple users)
- [ ] Activity favoriting and templates
- [ ] User review system

### Phase 4: External Integrations

- [ ] Real-time weather API
- [ ] Flight search integration
- [ ] Hotel booking API
- [ ] Attraction recommendations

### Phase 5: Mobile & PWA

- [ ] React Native mobile app
- [ ] PWA for offline support
- [ ] Push notifications

---

## 🧪 Testing the API

### Example: Generate Trip

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Response: { "token": "eyJhbGc...", "user": { ... } }

# 2. Login and get token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' | jq -r '.token')

# 3. Generate trip
curl -X POST http://localhost:5000/api/ai/generate-trip \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Tokyo, Japan",
    "durationDays": 5,
    "budgetTier": "Medium",
    "travelerType": "Couple",
    "interests": ["Food", "Culture", "Shopping"]
  }'
```

---

## 📝 Project Structure

```
Trip_planner/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── tripController.js
│   │   │   ├── aiController.js
│   │   │   └── planController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Trip.js
│   │   │   ├── Plan.js
│   │   │   └── Purchase.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── tripRoutes.js
│   │   │   ├── aiRoutes.js
│   │   │   └── planRoutes.js
│   │   ├── services/
│   │   │   ├── tripService.js
│   │   │   ├── aiTripService.js
│   │   │   └── geminiService.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── config/
│   │   │   └── db.js
│   │   └── server.js
│   ├── package.json
│   └── .env (not in repo)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx (landing)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── create-trip/page.tsx
│   │   │   ├── my-trips/page.tsx
│   │   │   ├── trips/[id]/page.tsx
│   │   │   ├── buy-plans/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── app/
│   │   │   │   ├── app-shell.tsx
│   │   │   │   ├── trip-card.tsx
│   │   │   │   ├── destination-card.tsx
│   │   │   │   ├── logo.tsx
│   │   │   │   └── section-heading.tsx
│   │   │   └── ui/ (Radix UI components)
│   │   └── lib/
│   │       ├── api.ts
│   │       ├── data.ts
│   │       └── trip-adapters.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env.local (not in repo)
│
├── README.md (this file)
└── .gitignore
```

---

## 👨‍💻 Author

**Aditya Kirdat**

- GitHub: [https://github.com/adukirdat](https://github.com/adukirdat)
- Building full-stack applications with modern tech stack

---

## 📄 License

This project is licensed under the **MIT License**.

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Google Gemini API** for powerful structured AI capabilities
- **MongoDB Atlas** for reliable cloud database hosting
- **Vercel** for seamless Next.js deployment
- **Render** for simple backend hosting
- **Tailwind CSS** for beautiful utility-first styling
- **Radix UI** for accessible component primitives
- **Express.js** for lightweight, flexible backend framework
- **Next.js Community** for excellent documentation and tools

---

<div align="center">

**Made with ❤️ by Aditya Kirdat**

⭐ If you find this project interesting, consider giving it a star on GitHub!

[Back to Top](#tripwise-ai-travel-planner)

</div>
