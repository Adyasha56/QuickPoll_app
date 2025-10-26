export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  _id: string;
  title: string;
  description?: string;
  options: PollOption[];
  likes: number;
  likedBy: string[];
  totalVotes: number;
  createdAt: string;
}

export interface VoteData {
  pollId: string;
  optionId: string;
  votes: number;
  totalVotes: number;
}

export interface LikeData {
  pollId: string;
  likes: number;
}