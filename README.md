# AI Chat App 🤖

A full-stack ChatGPT-like AI chat application built with React, Express, MongoDB, and the Groq API. Features user authentication, persistent chat history, and a dark-themed responsive UI.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20MongoDB%20%7C%20Groq%20API-10a37f)

## Features

- **🔐 User Authentication** — Register and login with JWT-based auth
- **💬 ChatGPT-style Chat UI** — Real-time streaming responses with a stop-generation button
- **📚 Conversation History** — All chats saved to MongoDB, organized by date
- **🌙 Dark Theme** — Sleek, responsive dark UI inspired by ChatGPT
- **⚡ Groq AI Integration** — Powered by Llama 3.3 70B via the Groq API (model configurable via `GROQ_MODEL`)
- **📱 Responsive Design** — Works seamlessly on desktop and mobile

## Tech Stack

| Layer       | Technology                                      |
| ----------- | ----------------------------------------------- |
| Frontend    | React 18, Vite, Tailwind CSS, React Router      |
| Backend     | Node.js, Express.js                             |
| Database    | MongoDB with Mongoose ODM                       |
| AI API      | Groq SDK (llama-3.3-70b-versatile, configurable via `GROQ_MODEL`) |
| Auth        | JSON Web Tokens (JWT) + bcrypt                  |

## Project Structure

```
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── api/            # Axios API client
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth & Chat context providers
│   │   └── pages/          # Page components
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── models/             # Mongoose schemas
│   └── routes/             # API route definitions
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Groq API Key** — get one at [console.groq.com](https://console.groq.com)

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

```bash
# Navigate to the server directory
cd server

# Edit the .env file with your credentials
```

Edit `server/.env` and fill in your credentials:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/atlas) |
| `JWT_SECRET` | Secret key for signing JWT tokens (generate a strong random string) |
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com) |
| `GROQ_MODEL` | Optional — Groq model to use (defaults to `llama-3.3-70b-versatile`) |
| `CLIENT_URL` | Frontend URL for CORS (set to your deployed URL in production) |
| `NODE_ENV` | Set to `production` on deployment servers |
| `RATE_LIMIT_AUTH_MAX` | Optional — max auth requests per IP per 15 min (default: 50) |
| `RATE_LIMIT_API_MAX` | Optional — max API requests per IP per 15 min (default: 200) |

### 3. Start the Application

**Run the backend** (from `/server`):

```bash
npm run dev    # with auto-reload (nodemon)
# or
npm start      # production mode
```

**Run the frontend** (from `/client`):

```bash
npm run dev
```

The app will open at **http://localhost:5173**.

## API Endpoints

| Method | Endpoint              | Auth | Description                    |
| ------ | --------------------- | ---- | ------------------------------ |
| POST   | `/api/auth/register`  | No   | Register a new user            |
| POST   | `/api/auth/login`     | No   | Login and get JWT token        |
| DELETE | `/api/auth/account`   | Yes  | Delete account and all chats   |
| POST   | `/api/chat/send`      | Yes  | Send a message to the AI       |
| GET    | `/api/chat/history`   | Yes  | Get all user conversations     |
| GET    | `/api/chat/:id`       | Yes  | Get a specific conversation    |
| DELETE | `/api/chat/:id`       | Yes  | Delete a conversation          |
| GET    | `/api/health`         | No   | Health check                   |

## Deployment

This app is designed for a **split deployment** strategy:

- **Frontend** → [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend** → [Render](https://render.com) or [Railway](https://railway.app)
- **Database** → [MongoDB Atlas](https://www.mongodb.com/atlas) (free M0 cluster)

### Option A: Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New +** → **Web Service** → connect your repo
3. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
4. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `CLIENT_URL`, `NODE_ENV=production`)
5. Deploy → copy your Render URL (e.g. `https://your-app.onrender.com`)

> ⚠️ Free Render instances spin down after 15 min of inactivity. The first request after idle takes ~30s.

### Option B: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your GitHub repo
2. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist`
3. Add environment variable:
   - `VITE_API_URL` = `https://your-render-app.onrender.com/api`
4. Deploy

### Option C: All-in-One on Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Add a **Web Service** → root: `server`, start: `node server.js`
3. Add a **Static Site** → root: `client`, build: `npm run build`, publish: `dist`
4. Add environment variables to both services

## What I Learned

- Building a full-stack application from scratch with React and Express
- Integrating third-party AI APIs (Groq) with context-aware conversations
- Implementing JWT authentication with protected routes
- Managing complex state with React Context API
- Designing responsive dark-themed UIs with Tailwind CSS
- Structuring a production-ready Node.js + MongoDB backend

---

Built with ❤️ as a portfolio project.
