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

// Socket.IO setup with CORS
// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://quickpoll-frontend.vercel.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://quickpoll-frontend.vercel.app', 
  ],
  credentials: true
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/polls', pollRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Join poll room
  socket.on('join-poll', (pollId: string) => {
    socket.join(`poll-${pollId}`);
    console.log(`User ${socket.id} joined poll room: ${pollId}`);
  });

  // Leave poll room
  socket.on('leave-poll', (pollId: string) => {
    socket.leave(`poll-${pollId}`);
    console.log(`User ${socket.id} left poll room: ${pollId}`);
  });

  // Broadcast new poll created
  socket.on('poll-created', (poll) => {
    io.emit('poll-created', poll);
    console.log('New poll created:', poll.title);
  });

  // Broadcast vote
  socket.on('poll-voted', (data) => {
    io.to(`poll-${data.pollId}`).emit('poll-voted', data);
    io.emit('poll-voted', data); // Also broadcast to main feed
    console.log('Vote recorded:', data);
  });

  // Broadcast like
  socket.on('poll-liked', (data) => {
    io.to(`poll-${data.pollId}`).emit('poll-liked', data);
    io.emit('poll-liked', data); // Also broadcast to main feed
    console.log('Poll liked:', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
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
});