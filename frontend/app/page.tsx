'use client';

import { useState, useEffect } from 'react';
import CreatePoll from '@/components/CreatePoll';
import PollCard from '@/components/PollCard';
import { Poll } from '@/lib/types';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Loader2 } from 'lucide-react';

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
    setupSocketListeners();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await api.getPolls();
      if (response.success) {
        setPolls(response.data);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    const socket = getSocket();

    socket.on('poll-created', (newPoll: Poll) => {
      setPolls((prev) => [newPoll, ...prev]);
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BarChart3 className="h-10 w-10 text-gray-900" />
            <h1 className="text-5xl font-bold text-gray-900">
              QuickPoll
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Real-time opinion polling platform
          </p>
          <Badge variant="outline" className="border-red-500 text-red-500">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            Live
          </Badge>
        </div>

        {/* Create Poll Section */}
        <div className="mb-16">
          <CreatePoll />
        </div>

        <Separator className="my-12" />

        {/* Polls Feed */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Active Polls</h2>
            <Badge variant="secondary" className="text-base px-4 py-1">
              {polls.length} {polls.length === 1 ? 'poll' : 'polls'}
            </Badge>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            </div>
          ) : polls.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                No polls yet
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Create the first poll above! 🚀
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {polls.map((poll) => (
                <PollCard key={poll._id} poll={poll} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}