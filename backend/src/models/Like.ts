import mongoose, { Schema, Document } from 'mongoose';
import { ILike } from '../types';

interface ILikeDocument extends Omit<ILike, '_id'>, Document {}

const LikeSchema = new Schema<ILikeDocument>({
  pollId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// User can like only once per poll
LikeSchema.index({ pollId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ILikeDocument>('Like', LikeSchema);