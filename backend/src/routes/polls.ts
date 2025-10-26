import express from 'express';
import {
  getAllPolls,
  getPoll,
  createPoll,
  votePoll,
  likePoll,
  checkUserVote
} from '../controllers/pollController';

const router = express.Router();

// Get all polls
router.get('/', getAllPolls);

// Get single poll
router.get('/:id', getPoll);

// Create poll
router.post('/', createPoll);

// Vote on poll
router.post('/vote', votePoll);

// Like/Unlike poll
router.post('/like', likePoll);

// Check if user voted
router.get('/:pollId/vote/:userId', checkUserVote);

export default router;