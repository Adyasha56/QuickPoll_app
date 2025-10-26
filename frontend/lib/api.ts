const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Get all polls
  getPolls: async () => {
    const res = await fetch(`${API_URL}/polls`);
    return res.json();
  },

  // Get single poll
  getPoll: async (id: string) => {
    const res = await fetch(`${API_URL}/polls/${id}`);
    return res.json();
  },

  // Create poll
  createPoll: async (data: { title: string; description?: string; options: string[] }) => {
    const res = await fetch(`${API_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Vote on poll
  votePoll: async (pollId: string, optionId: string, userId: string) => {
    const res = await fetch(`${API_URL}/polls/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollId, optionId, userId }),
    });
    return res.json();
  },

  // Like poll
  likePoll: async (pollId: string, userId: string) => {
    const res = await fetch(`${API_URL}/polls/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollId, userId }),
    });
    return res.json();
  },

  // Check if user voted
  checkUserVote: async (pollId: string, userId: string) => {
    const res = await fetch(`${API_URL}/polls/${pollId}/vote/${userId}`);
    return res.json();
  },
};