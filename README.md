# 🎮 PixelGate — MERN Gaming Blog

<img width="1299" height="527" alt="image" src="https://github.com/user-attachments/assets/16d965d1-18e2-4e35-8e49-154249845899" />

A full-stack gaming blog built with MongoDB, Express.js, React.js, and Node.js.  
Features a dark neon UI, JWT-secured admin panel, CRUD posts, categories, comments, likes, search, and pagination.

---

## 📁 Folder Structure

```
gaming-blog/
├── backend/                    ← Node.js + Express API
│   ├── models/
│   │   ├── User.js             ← Admin user schema
│   │   ├── Post.js             ← Blog post schema (slug, SEO, likes)
│   │   ├── Category.js         ← Category schema
│   │   └── Comment.js          ← Comment schema
│   ├── routes/
│   │   ├── authRoutes.js       ← Login, register, /me
│   │   ├── postRoutes.js       ← CRUD + like toggle
│   │   ├── categoryRoutes.js   ← CRUD categories
│   │   └── commentRoutes.js    ← Add/list/delete comments
│   ├── middleware/
│   │   ├── authMiddleware.js   ← JWT protect + adminOnly
│   │   └── uploadMiddleware.js ← Multer image uploads
│   ├── uploads/                ← Uploaded images (auto-created)
│   ├── server.js               ← Express app entry point
│   ├── seed.js                 ← Database seeder
│   ├── .env.example            ← Copy to .env and fill in
│   └── package.json
│
└── frontend/                   ← React app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js           ← Logo, nav links, search, mobile menu
    │   │   ├── Footer.js           ← Social links, category links
    │   │   ├── PostCard.js         ← Card (normal + featured variant)
    │   │   ├── Pagination.js       ← Page number controls
    │   │   ├── LoadingSkeleton.js  ← Skeleton cards + page spinner
    │   │   ├── ProtectedRoute.js   ← Admin auth guard
    │   │   └── SEO.js              ← react-helmet-async meta tags
    │   ├── context/
    │   │   └── AuthContext.js      ← Global auth state + login/logout
    │   ├── hooks/
    │   │   └── usePosts.js         ← usePosts, usePost, useCategories, useComments
    │   ├── pages/
    │   │   ├── HomePage.js         ← Hero, featured post, post grid
    │   │   ├── PostPage.js         ← Single post + likes + comments
    │   │   ├── CategoryPage.js     ← Posts filtered by category
    │   │   ├── SearchPage.js       ← Search results
    │   │   └── admin/
    │   │       ├── LoginPage.js        ← Admin sign-in
    │   │       ├── DashboardPage.js    ← Stats, post/category tables
    │   │       ├── PostEditorPage.js   ← Create/edit post form
    │   │       └── NewCategoryPage.js  ← Create category
    │   ├── utils/
    │   │   └── api.js              ← Axios instance with JWT interceptor
    │   ├── App.js                  ← Routes + layout
    │   ├── index.js                ← React DOM entry point
    │   └── index.css               ← Tailwind + custom CSS/fonts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── package.json
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community  
  OR a free **MongoDB Atlas** cluster → https://www.mongodb.com/atlas

---

### 1. Clone / Download the project

```bash
# If using git
git clone <your-repo-url> gaming-blog
cd gaming-blog
```

---

### 2. Set up the Backend

```bash
cd backend

# Install dependencies
npm install

# Copy the example env file and fill in your values
cp .env.example .env
```

**Edit `backend/.env`:**
```env
MONGO_URI=mongodb://localhost:27017/gaming-blog
JWT_SECRET=change_this_to_a_long_random_string
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=admin@gamingblog.com
ADMIN_PASSWORD=Admin@123456
FRONTEND_URL=http://localhost:3000
```

> 💡 For MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

```bash
# Seed the database (creates admin user + sample posts)
node seed.js

# Start the development server
npm run dev
```

Backend will run at **http://localhost:5000**

---

### 3. Set up the Frontend

Open a **new terminal tab/window**:

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure env
cp .env.example .env
```

**Edit `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
# Start the React app
npm start
```

Frontend will run at **http://localhost:3000**

---

### 4. Access the App

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin/login |
| Admin Dashboard | http://localhost:3000/admin/dashboard |
| API Health | http://localhost:5000/api/health |

**Default admin credentials** (from seed):
- Email: `admin@gamingblog.com`
- Password: `Admin@123456`

> ⚠️ Change these immediately in production!

---

## 🌐 API Reference

All routes are prefixed with `/api`.

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/login` | — | Admin login → returns JWT |
| GET | `/auth/me` | 🔒 JWT | Get current user |
| POST | `/auth/register` | 🔒 Admin | Create new admin |

### Posts
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/posts` | — | List posts (pagination, search, category filter) |
| GET | `/posts/admin/all` | 🔒 Admin | All posts including drafts |
| GET | `/posts/:slug` | — | Single post by slug (increments views) |
| POST | `/posts` | 🔒 Admin | Create post (multipart/form-data) |
| PUT | `/posts/:id` | 🔒 Admin | Update post |
| DELETE | `/posts/:id` | 🔒 Admin | Delete post |
| POST | `/posts/:id/like` | — | Toggle like (body: `{ sessionId }`) |

### Categories
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/categories` | — | All categories with post counts |
| GET | `/categories/:slug` | — | Single category |
| POST | `/categories` | 🔒 Admin | Create category |
| PUT | `/categories/:id` | 🔒 Admin | Update category |
| DELETE | `/categories/:id` | 🔒 Admin | Delete (fails if posts exist) |

### Comments
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/comments?postId=xxx` | — | Comments for a post |
| POST | `/comments` | — | Add comment |
| DELETE | `/comments/:id` | 🔒 Admin | Delete comment |

### Query Parameters for `GET /posts`
```
?page=1         Page number (default: 1)
?limit=9        Posts per page (default: 9)
?category=ID    Filter by category ID
?search=text    Search in title, excerpt, tags
```

---

## 🚀 Deployment

### Backend — Deploy to Render / Railway / Fly.io

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on Render (free tier works)
3. Set environment variables in the dashboard:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string
   - `NODE_ENV` = production
   - `FRONTEND_URL` = your Vercel URL (added after frontend deploy)
4. Start command: `npm start`

### Frontend — Deploy to Vercel

1. Push `frontend/` to GitHub
2. Import to **Vercel** (https://vercel.com)
3. Set environment variable:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
4. Deploy — Vercel auto-builds React apps

### After deploying both:
- Go back to your backend service on Render
- Update `FRONTEND_URL` to your Vercel URL
- Re-deploy the backend

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS |
| Fonts | Bebas Neue, Rajdhani, Exo 2 (Google Fonts) |
| HTTP Client | Axios with JWT interceptor |
| SEO | react-helmet-async |
| Notifications | react-toastify |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Uploads | Multer (local disk storage) |
| Slug Generation | slugify |

---

## 🔒 Security Notes

- JWT tokens expire in **7 days**
- Passwords are hashed with **bcrypt** (10 salt rounds)
- All admin routes are protected by `protect + adminOnly` middleware
- Image uploads are limited to **5MB** and image types only
- CORS is restricted to the configured `FRONTEND_URL`
- In production, set `NODE_ENV=production` and use a strong `JWT_SECRET`

---

## 💡 Common Issues

**"Cannot connect to MongoDB"**  
→ Make sure MongoDB is running locally (`mongod`) or your Atlas URI is correct.

**"CORS error in browser"**  
→ Check that `FRONTEND_URL` in `.env` exactly matches your React app URL (no trailing slash).

**Images not showing after upload**  
→ The backend serves images at `/uploads/`. Ensure `REACT_APP_API_URL` points to the backend root (not just `/api`).

**"Cannot find module"**  
→ Run `npm install` inside both `backend/` and `frontend/` folders.

---

## 🎮 Features Summary

- ✅ Responsive dark neon UI (Tailwind CSS + Google Fonts)
- ✅ Home page with hero, category pills, featured post, paginated grid
- ✅ Single post page with HTML content, like button, comment system
- ✅ Category pages with filtered post grids
- ✅ Full-text search across titles, excerpts, and tags
- ✅ SEO meta tags per page (Open Graph + Twitter Card)
- ✅ Clean slug-based URLs (`/post/my-post-title`)
- ✅ JWT admin authentication
- ✅ Admin dashboard: stats, post table, category manager
- ✅ Post editor: create/edit with image upload or URL
- ✅ View counter (auto-increments on post open)
- ✅ Like system (session-based, no login needed)
- ✅ Skeleton loading animations
- ✅ Mobile-responsive navbar with hamburger menu
- ✅ Deployment-ready with environment variable setup
