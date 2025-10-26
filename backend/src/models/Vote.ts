import mongoose, { Schema, Document } from 'mongoose';
import { IVote } from '../types';

interface IVoteDocument extends Omit<IVote, '_id'>, Document {}

const VoteSchema = new Schema<IVoteDocument>({
  pollId: { type: String, required: true },
  optionId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// User can vote only once per poll
VoteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IVoteDocument>('Vote', VoteSchema);