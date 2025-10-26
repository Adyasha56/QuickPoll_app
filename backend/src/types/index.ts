export interface IPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface IPoll {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  options: IPollOption[];
  likes: number;
  likedBy: string[];
  createdAt: Date;
  totalVotes: number;
}

export interface IVote {
  _id?: string;
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: Date;
}

export interface ILike {
  _id?: string;
  pollId: string;
  userId: string;
  createdAt: Date;
}

export interface SocketEvents {
  'poll:created': (poll: IPoll) => void;
  'poll:voted': (data: { pollId: string; optionId: string; votes: number; totalVotes: number }) => void;
  'poll:liked': (data: { pollId: string; likes: number }) => void;
}