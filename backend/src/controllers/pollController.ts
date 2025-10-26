import { Request, Response } from 'express';
import Poll from '../models/Polls';
import Vote from '../models/Vote';
import Like from '../models/Like';
import { v4 as uuidv4 } from 'uuid';

// Get all polls
export const getAllPolls = async (req: Request, res: Response) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json({ success: true, data: polls });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get single poll
export const getPoll = async (req: Request, res: Response) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ success: false, error: 'Poll not found' });
    }
    res.json({ success: true, data: poll });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Create poll
export const createPoll = async (req: Request, res: Response) => {
  try {
    const { title, description, options } = req.body;

    if (!title || !options || options.length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and at least 2 options required' 
      });
    }

    const pollOptions = options.map((text: string) => ({
      id: uuidv4(),
      text,
      votes: 0
    }));

    const poll = await Poll.create({
      title,
      description,
      options: pollOptions,
      likes: 0,
      likedBy: [],
      totalVotes: 0
    });

    res.status(201).json({ success: true, data: poll });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Vote on poll
export const votePoll = async (req: Request, res: Response) => {
  try {
    const { pollId, optionId, userId } = req.body;

    if (!pollId || !optionId || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'PollId, optionId, and userId required' 
      });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ pollId, userId });
    if (existingVote) {
      return res.status(400).json({ 
        success: false, 
        error: 'Already voted on this poll' 
      });
    }

    // Create vote
    await Vote.create({ pollId, optionId, userId });

    // Update poll
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, error: 'Poll not found' });
    }

    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      return res.status(404).json({ success: false, error: 'Option not found' });
    }

    option.votes += 1;
    poll.totalVotes += 1;
    await poll.save();

    res.json({ 
      success: true, 
      data: { 
        pollId, 
        optionId, 
        votes: option.votes,
        totalVotes: poll.totalVotes 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Like poll
export const likePoll = async (req: Request, res: Response) => {
  try {
    const { pollId, userId } = req.body;

    if (!pollId || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'PollId and userId required' 
      });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, error: 'Poll not found' });
    }

    // Check if already liked
    const alreadyLiked = poll.likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Unlike
      await Like.deleteOne({ pollId, userId });
      poll.likes -= 1;
      poll.likedBy = poll.likedBy.filter(id => id !== userId);
    } else {
      // Like
      await Like.create({ pollId, userId });
      poll.likes += 1;
      poll.likedBy.push(userId);
    }

    await poll.save();

    res.json({ 
      success: true, 
      data: { 
        pollId, 
        likes: poll.likes,
        liked: !alreadyLiked 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Check if user voted
export const checkUserVote = async (req: Request, res: Response) => {
  try {
    const { pollId, userId } = req.params;
    const vote = await Vote.findOne({ pollId, userId });
    
    res.json({ 
      success: true, 
      data: { 
        hasVoted: !!vote,
        optionId: vote?.optionId 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};