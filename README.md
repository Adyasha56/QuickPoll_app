# 🗳️ QuickPoll - Real-Time Opinion Polling Platform

A modern, feature-rich polling platform built with Express.js, Socket.IO, Next.js 14, and MongoDB Atlas. Create polls, vote in real-time, and see live updates across all connected users.

---

## 🌐 Live Demo

- **Frontend:** [https://quick-poll-app-six.vercel.app](https://quick-poll-app-six.vercel.app)
- **Backend API:** [https://quickpoll-app.onrender.com](https://quickpoll-app.onrender.com)
- **API Health Check:** [https://quickpoll-app.onrender.com/health](https://quickpoll-app.onrender.com/health)

---

## ✨ Features

### Core Functionality
- ✅ **Create Polls** - Create custom polls with 2-6 answer options
- ✅ **Real-Time Voting** - Vote on polls with instant updates across all users
- ✅ **Like System** - Like/unlike polls with live counter updates
- ✅ **User Tracking** - One vote per user per poll (localStorage-based)
- ✅ **Live Updates** - Socket.IO powered real-time synchronization
- ✅ **Progress Visualization** - Visual percentage bars for vote distribution

### UI/UX
- 🎨 **Clean Design** - Minimalist black, white, and gray color scheme
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🌙 **Dark Mode Ready** - Built-in dark mode support
- ⚡ **Fast & Smooth** - Optimized performance with Next.js 14
- 💫 **Interactive Animations** - Smooth transitions and hover effects

### Technical
- **Type-Safe** - Full TypeScript implementation
- **Cloud Database** - MongoDB Atlas for reliable data storage
- **Production Ready** - Deployed on Render (backend) and Vercel (frontend)
- **Real-Time Architecture** - WebSocket connections for instant updates
- **Error Handling** - Comprehensive error handling and validation

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Real-Time:** Socket.IO Client
- **Deployment:** [Vercel](https://vercel.com/)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** TypeScript
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **ODM:** [Mongoose](https://mongoosejs.com/)
- **Real-Time:** [Socket.IO](https://socket.io/)
- **Deployment:** [Render](https://render.com/)

---

---

## 📊 System Workflow (Text Diagram)
```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│  ┌────────────────┐                   ┌──────────────────┐  │
│  │  Next.js App   │ ←──────────────→  │  Socket.IO       │  │
│  │  (Frontend)    │    WebSocket      │  Client          │  │
│  └────────────────┘                   └──────────────────┘  │
│         ↕ HTTP/HTTPS                           ↕             │
└─────────────────────────────────────────────────────────────┘
                         ↕                        ↕
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (Render)                   │
│  ┌────────────────┐                   ┌──────────────────┐  │
│  │  Express.js    │ ←──────────────→  │  Socket.IO       │  │
│  │  REST API      │                   │  Server          │  │
│  └────────────────┘                   └──────────────────┘  │
│         ↕                                                    │
│  ┌────────────────┐                                         │
│  │  Controllers   │                                         │
│  │  & Routes      │                                         │
│  └────────────────┘                                         │
│         ↕                                                    │
└─────────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas (Cloud)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Polls    │  │   Votes    │  │   Likes    │           │
│  │ Collection │  │ Collection │  │ Collection │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────┘

REAL-TIME FLOW:
1. User A creates poll → Backend → Database
2. Backend emits event → Socket.IO
3. Socket.IO broadcasts → All connected users
4. User B's browser updates automatically ✨
```

---

## 🔄 Poll Creation Flow
```
User                Frontend              Backend              Database
 │                     │                     │                     │
 │  Fill Form          │                     │                     │
 ├────────────────────>│                     │                     │
 │                     │  POST /api/polls    │                     │
 │                     ├────────────────────>│                     │
 │                     │                     │  Insert Poll        │
 │                     │                     ├────────────────────>│
 │                     │                     │                     │
 │                     │                     │<────────────────────┤
 │                     │  Poll Data          │   Poll Created      │
 │                     │<────────────────────┤                     │
 │                     │                     │                     │
 │                     │  Socket Emit        │                     │
 │                     ├────────────────────>│                     │
 │  Show Success       │                     │                     │
 │<────────────────────┤  Broadcast Event    │                     │
 │                     │<────────────────────┤                     │
 │                     │                     │                     │
 │  Poll Appears! ✨   │                     │                     │
 │<────────────────────┤                     │                     │
```

---

## 📁 Project Structure
```
quickpoll-app/
├── backend/                    # Express.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts    # MongoDB connection
│   │   ├── models/
│   │   │   ├── Poll.ts        # Poll schema
│   │   │   ├── Vote.ts        # Vote schema
│   │   │   └── Like.ts        # Like schema
│   │   ├── controllers/
│   │   │   └── pollController.ts  # Business logic
│   │   ├── routes/
│   │   │   └── polls.ts       # API routes
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript types
│   │   └── server.ts          # Main server file
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                   # Next.js Frontend
    ├── app/
    │   ├── page.tsx           # Home page
    │   ├── layout.tsx         # Root layout
    │   ├── globals.css        # Global styles
    │   ├── loading.tsx        # Loading state
    │   └── error.tsx          # Error boundary
    ├── components/
    │   ├── ui/                # Shadcn components
    │   ├── CreatePoll.tsx     # Poll creation form
    │   └── PollCard.tsx       # Poll display card
    ├── lib/
    │   ├── socket.ts          # Socket.IO client
    │   ├── api.ts             # API utility functions
    │   ├── types.ts           # TypeScript interfaces
    │   └── user.ts            # User ID management
    ├── .env.local             # Environment variables
    ├── package.json
    └── tailwind.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **MongoDB Atlas** account (free tier works)
- **Git** installed

### Installation

#### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/quickpoll-app.git
cd quickpoll-app
```

#### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3️⃣ Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start frontend server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📡 API Documentation

### Base URL
- **Local:** `http://localhost:5000/api`
- **Production:** `https://quickpoll-app.onrender.com/api`

### Endpoints

#### **Get All Polls**
```http
GET /polls
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "poll_id",
      "title": "Poll title",
      "description": "Optional description",
      "options": [
        {
          "id": "option_id",
          "text": "Option text",
          "votes": 0
        }
      ],
      "likes": 0,
      "likedBy": [],
      "totalVotes": 0,
      "createdAt": "2025-01-27T..."
    }
  ]
}
```

#### **Get Single Poll**
```http
GET /polls/:id
```

#### **Create Poll**
```http
POST /polls
Content-Type: application/json

{
  "title": "Your poll question?",
  "description": "Optional description",
  "options": ["Option 1", "Option 2", "Option 3"]
}
```

#### **Vote on Poll**
```http
POST /polls/vote
Content-Type: application/json

{
  "pollId": "poll_id",
  "optionId": "option_id",
  "userId": "user_id"
}
```

#### **Like/Unlike Poll**
```http
POST /polls/like
Content-Type: application/json

{
  "pollId": "poll_id",
  "userId": "user_id"
}
```

#### **Check User Vote**
```http
GET /polls/:pollId/vote/:userId
```

---

## 🔌 Socket.IO Events

### Client → Server

| Event | Description | Payload |
|-------|-------------|---------|
| `join-poll` | Join a poll room | `pollId: string` |
| `leave-poll` | Leave a poll room | `pollId: string` |
| `poll-created` | Broadcast new poll | `poll: Poll` |
| `poll-voted` | Broadcast vote update | `{pollId, optionId, votes, totalVotes}` |
| `poll-liked` | Broadcast like update | `{pollId, likes}` |

### Server → Client

| Event | Description | Payload |
|-------|-------------|---------|
| `poll-created` | New poll created | `poll: Poll` |
| `poll-voted` | Vote recorded | `{pollId, optionId, votes, totalVotes}` |
| `poll-liked` | Like/unlike recorded | `{pollId, likes}` |
| `connect` | Socket connected | `socket.id` |
| `disconnect` | Socket disconnected | - |

---

---

## 🧪 Testing

### Test Real-Time Features

1. Open the app in **two browser windows/tabs**
2. Create a poll in **Tab 1**
3. ✅ Poll should appear instantly in **Tab 2**
4. Vote in **Tab 1**
5. ✅ Vote count updates live in **Tab 2**
6. Like a poll in **Tab 2**
7. ✅ Like count updates instantly in **Tab 1**

### Test Responsive Design

1. Press `F12` in browser → Toggle device toolbar
2. Test mobile (375px), tablet (768px), desktop (1440px)
3. All features should work seamlessly

---

## 🚀 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables
6. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Next.js
4. Add environment variables
5. Deploy

---

## 📝 Environment Variables

### Backend (`.env`)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.onrender.com
```

---

## 🐛 Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your Vercel URL exactly
- No trailing slashes in URLs
- Check Render logs for blocked origins

### Socket Connection Issues
- Ensure `NEXT_PUBLIC_SOCKET_URL` is correct
- Check browser console for connection errors
- Verify Socket.IO versions match (client & server)

### MongoDB Connection Failed
- Check connection string format
- Verify IP whitelist includes `0.0.0.0/0` in Atlas
- Ensure database user has read/write permissions

### Render Cold Starts
- First request may take 30-60 seconds (free tier)
- Subsequent requests will be fast
- Consider upgrading for always-on instances

---

## 🎯 Features Roadmap

- [ ] User authentication
- [ ] Poll categories/tags
- [ ] Share poll via link
- [ ] Poll expiration/scheduling
- [ ] Comments on polls
- [ ] User profiles
- [ ] Poll analytics dashboard
- [ ] Export results to CSV
- [ ] Email notifications
- [ ] Multiple choice voting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Socket.IO](https://socket.io/) - Real-time engine
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database
- [Vercel](https://vercel.com/) - Frontend hosting
- [Render](https://render.com/) - Backend hosting

---



---

<div align="center">

**⭐ If you like this project, please give it a star! ⭐**

Made with ❤️ and ☕

</div>