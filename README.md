# LuckSport - Golf Charity Subscription Platform

This is a full-stack MERN application built for the Golf Charity Platform. It features a complete subscription engine, golf score tracking with rolling-five logic, a mathematics-driven lottery/draw system with jackpot rollovers, and a robust winner verification system.

## 🛠 Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons
- **Backend**: Node.js + Express (Controller-based Architecture)
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: JWT & bcrypt (with enhanced password complexity)
- **File Uploads**: Cloudinary (for secure, scalable winner verification proofs)
- **Payments**: Stripe (with built-in Mock fallback)

---

## 🚀 Getting Started

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file with the following keys:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://.../LuckSport?...
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. **Seed the Database (Recommended)**: Run the following to create default charities and an admin user (`admin@digitalheroes.com` / `Admin@123`):
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

## 📖 Feature Highlights

### 🔐 Enhanced Security
- **Password Policy**: Passwords must be at least 8 characters and contain a mix of alphabets, numbers, and special characters. 
- **Role-Based Access**: Specialized `isAdmin` middleware protects sensitive endpoints.

### 🎯 Score & Draw Engine
- **Rolling Five**: Users maintain exactly 5 active scores; the oldest score automatically drops when a new one is added.
- **Fair Draws**: Admin can choose between purely Random or Frequency-based (Algorithmic) draws.
- **Jackpot Rollovers**: If a draw has no Match-5 winners, the jackpot pool automatically rolls over to the next scheduled draw.

### ☁️ Cloud-Ready Verification
- **Cloudinary Integration**: Proof of winning screenshots are uploaded directly to Cloudinary, ensuring the platform remains lightweight and ready for production deployment.

---

## 📂 Project Architecture
The backend follows a modular **Controller-Route** pattern for clean separation of concerns:
- **`routes/`**: Defines API endpoints and applies middleware (`auth`, `isAdmin`).
- **`controllers/`**: Contains the core business logic and database interactions.
- **`middleware/`**: Centralized authentication and role verification.
- **`models/`**: Structured Mongoose schemas with built-in validation.

---

## 🏁 Testing the Workflow
1. **Login as Admin**: Use the credentials from `seed.js`.
2. **Review Charities**: Ensure charities are active in the Admin Dashboard.
3. **User Journey**: Register a new user, subscribe (Mock or Stripe), and log 5 scores.
4. **Draw Phase**: Perform an Admin Draw simulation and Publish it.
5. **Winner Phase**: Log in as a winning user, upload a screenshot proof, and verify it as an Admin to see "Total Won" update!
