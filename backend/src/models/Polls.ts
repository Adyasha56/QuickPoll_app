import mongoose, { Schema, Document } from 'mongoose';
import { IPoll, IPollOption } from '../types';

interface IPollDocument extends Omit<IPoll, '_id' | 'id'>, Document {}

const PollOptionSchema = new Schema<IPollOption>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const PollSchema = new Schema<IPollDocument>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  options: [PollOptionSchema],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  totalVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPollDocument>('Poll', PollSchema);