import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import pollRoutes from './routes/polls';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// ✅ CORS Origins - properly typed
const allowedOrigins: string[] = [
  'http://localhost:3000',
  'https://quick-poll-app-six.vercel.app',
  process.env.FRONTEND_URL || '',
].filter((origin): origin is string => Boolean(origin) && origin !== '');

console.log('Allowed CORS Origins:', allowedOrigins);

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Middleware - CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/polls', pollRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'QuickPoll API', 
    version: '1.0.0',
    endpoints: {
      health: '/health',
      polls: '/api/polls',
    },
    allowedOrigins: allowedOrigins
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  socket.on('join-poll', (pollId: string) => {
    socket.join(`poll-${pollId}`);
    console.log(`User ${socket.id} joined poll room: ${pollId}`);
  });

  socket.on('leave-poll', (pollId: string) => {
    socket.leave(`poll-${pollId}`);
    console.log(`User ${socket.id} left poll room: ${pollId}`);
  });

  socket.on('poll-created', (poll) => {
    io.emit('poll-created', poll);
    console.log('New poll created:', poll.title);
  });

  socket.on('poll-voted', (data) => {
    io.to(`poll-${data.pollId}`).emit('poll-voted', data);
    io.emit('poll-voted', data);
    console.log('Vote recorded:', data);
  });

  socket.on('poll-liked', (data) => {
    io.to(`poll-${data.pollId}`).emit('poll-liked', data);
    io.emit('poll-liked', data);
    console.log('Poll liked:', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal server error' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO ready for real-time updates`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});