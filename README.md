# Amazon Clone - Full-Stack E-Commerce Platform

## 📖 Project Summary
This project is a fully functional, production-ready full-stack Amazon Clone. It simulates a modern e-commerce experience including user authentication, an extensive product catalog, shopping cart functionality, personal wishlists, secure checkout processes, and order management. 

The backend architecture is built with Node.js, Express, and PostgreSQL, utilizing Redis for high-performance caching. The frontend is a modern, responsive React application built with Vite and state managed via Zustand.

---

## 🚀 Complete Instructions for Download and Setup

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/en/) (v16 or higher)
* [PostgreSQL](https://www.postgresql.org/) (Ensure the database is running)
* [Redis](https://redis.io/) (Locally or via a service)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Amazon
```

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install all backend dependencies
npm install

# Configure Environment Variables
# Create a .env file in the `backend` directory with the following variables:
PORT=5000
DATABASE_URL=postgres://<username>:<password>@localhost:5432/amazon_clone
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key
```

**Initialize Database:**
```bash
# This will run the schema and seed the database with initial products
npm run db:init
```

**Start the Backend Server:**
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window/tab:
```bash
# Navigate back to the root, then to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the Frontend Development Server
npm run dev
```
The frontend should now be running at `http://localhost:5173` (or the port specified by Vite).

---

## 📂 Folder Structure

```text
Amazon/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route logic and handlers
│   │   ├── db/               # Database connection and initialization
│   │   ├── middleware/       # Custom Express middlewares (Auth, Error Handling)
│   │   ├── models/           # SQL Schemas (User, Product, Cart, Order)
│   │   ├── routes/           # Express API Route definitions
│   │   ├── services/         # Business logic layer
│   │   └── utils/            # Helper functions
│   ├── .env                  # Backend environment variables
│   ├── package.json          # Backend dependencies
│   └── server.js             # Backend entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/              # App routing and global configurations
│   │   ├── assets/           # Static files, images, icons
│   │   ├── components/       # Reusable React components (UI elements)
│   │   ├── features/         # Feature-based architecture (e.g., cart, wishlist, products)
│   │   └── main.jsx          # React entry point
│   ├── index.html            # HTML Template
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
└── README.md                 # Project Documentation (You are here)
```

---

## 🗄️ Database Schema Diagram

Below is the Flow Chart outlining the relational database schema used in this application:

```mermaid
erDiagram
    USERS ||--o{ CART_ITEMS : "has"
    USERS ||--o{ WISHLIST_ITEMS : "has"
    USERS ||--o{ ORDERS : "places"
    
    CATEGORIES ||--o{ PRODUCTS : "contains"
    
    PRODUCTS ||--o{ CART_ITEMS : "added as"
    PRODUCTS ||--o{ WISHLIST_ITEMS : "added as"
    PRODUCTS ||--o{ ORDER_ITEMS : "purchased as"
    
    ORDERS ||--b{ ORDER_ITEMS : "contains"

    USERS {
        int id PK
        string name
        string email
        string password_hash
        timestamp created_at
    }
    
    CATEGORIES {
        int id PK
        string name
    }

    PRODUCTS {
        int id PK
        string name
        text description
        decimal price
        int stock
        string category
        string image_url
        decimal rating
        int rating_count
        timestamp created_at
    }

    CART_ITEMS {
        int id PK
        int user_id FK
        int product_id FK
        int quantity
    }

    WISHLIST_ITEMS {
        int id PK
        int user_id FK
        int product_id FK
    }

    ORDERS {
        int id PK
        int user_id FK
        decimal total_price
        text shipping_address
        string status
        timestamp created_at
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price_at_purchase
    }
```

---

## 🛠️ Tech Stack & Important Details

### Technologies Used
* **Frontend:** React.js 18, Vite, Zustand (State Management), React Router DOM v6, Tailwind CSS / Vanilla CSS.
* **Backend:** Node.js, Express.js.
* **Database:** PostgreSQL (Relational DB for strong ACID compliance).
* **Caching:** Redis (Used for caching frequently accessed products and system configuration).
* **Security & Auth:** JWT (JSON Web Tokens), bcryptjs (Password Hashing).

### Important Architecture Details
1. **Transaction Management:** Critical operations, like order placement and stock decrement, are wrapped in PostgreSQL transactions to prevent race conditions and ensure data integrity.
2. **Feature-Based Frontend Design:** The React frontend utilizes a feature-based folder structure (e.g., `/features/cart`, `/features/wishlist`). This drastically improves scalability and code maintainability over a standard flat architecture.
3. **Optimized Indexes:** The database schema is equipped with B-tree indices on Foreign Keys and a Trigram index (`idx_products_name_trgm`) to make text-based product searches lightning-fast.
4. **Resilient Error Handling:** Global middleware catches generic throw errors, preventing the server from silently crashing and feeding standardized errors to the frontend application.
