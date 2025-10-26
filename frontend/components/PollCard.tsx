'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Check } from 'lucide-react';
import { Poll, PollOption } from '@/lib/types';
import { api } from '@/lib/api';
import { getUserId } from '@/lib/user';
import { getSocket } from '@/lib/socket';

interface PollCardProps {
  poll: Poll;
  onUpdate?: (pollId: string) => void;
}

export default function PollCard({ poll, onUpdate }: PollCardProps) {
  const [localPoll, setLocalPoll] = useState(poll);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [voting, setVoting] = useState(false);
  const [liking, setLiking] = useState(false);
  const userId = getUserId();

  useEffect(() => {
    setLocalPoll(poll);
    checkUserStatus();
    setupSocketListeners();
  }, [poll]);

  const checkUserStatus = async () => {
    try {
      const voteRes = await api.checkUserVote(poll._id, userId);
      if (voteRes.success && voteRes.data.hasVoted) {
        setHasVoted(true);
        setSelectedOption(voteRes.data.optionId);
      }
      
      const isLiked = poll.likedBy.includes(userId);
      setHasLiked(isLiked);
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const setupSocketListeners = () => {
    const socket = getSocket();

    socket.on('poll-voted', (data) => {
      if (data.pollId === poll._id) {
        setLocalPoll((prev) => {
          const updatedOptions = prev.options.map((opt) =>
            opt.id === data.optionId ? { ...opt, votes: data.votes } : opt
          );
          return {
            ...prev,
            options: updatedOptions,
            totalVotes: data.totalVotes,
          };
        });
      }
    });

    socket.on('poll-liked', (data) => {
      if (data.pollId === poll._id) {
        setLocalPoll((prev) => ({
          ...prev,
          likes: data.likes,
        }));
      }
    });
  };

  const handleVote = async (optionId: string) => {
    if (hasVoted || voting) return;

    setVoting(true);
    try {
      const response = await api.votePoll(poll._id, optionId, userId);
      
      if (response.success) {
        setHasVoted(true);
        setSelectedOption(optionId);
        
        const socket = getSocket();
        socket.emit('poll-voted', response.data);
      } else {
        alert(response.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const handleLike = async () => {
    if (liking) return;

    setLiking(true);
    try {
      const response = await api.likePoll(poll._id, userId);
      
      if (response.success) {
        setHasLiked(response.data.liked);
        
        const socket = getSocket();
        socket.emit('poll-liked', response.data);
      }
    } catch (error) {
      console.error('Error liking:', error);
    } finally {
      setLiking(false);
    }
  };

  const getPercentage = (option: PollOption) => {
    if (localPoll.totalVotes === 0) return 0;
    return Math.round((option.votes / localPoll.totalVotes) * 100);
  };

  return (
    <Card className="w-full border-2 hover:shadow-lg transition-all duration-200">
      <CardHeader className="border-b bg-gray-50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-2">
              {localPoll.title}
            </CardTitle>
            {localPoll.description && (
              <CardDescription className="text-gray-600">
                {localPoll.description}
              </CardDescription>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0 bg-gray-200 text-gray-700 border-0">
            <Users className="h-3 w-3 mr-1" />
            {localPoll.totalVotes}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-6">
        {localPoll.options.map((option) => (
          <div key={option.id} className="space-y-2">
            <Button
              variant={selectedOption === option.id ? 'default' : 'outline'}
              className={`w-full justify-between h-auto py-3 px-4 ${
                selectedOption === option.id
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'border-2 border-gray-300 hover:bg-gray-100 text-gray-900'
              }`}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || voting}
            >
              <span className="flex items-center gap-2 font-medium">
                {selectedOption === option.id && <Check className="h-4 w-4" />}
                {option.text}
              </span>
              {hasVoted && (
                <span className="font-bold">
                  {option.votes} ({getPercentage(option)}%)
                </span>
              )}
            </Button>
            
            {hasVoted && (
              <Progress 
                value={getPercentage(option)} 
                className="h-2 bg-gray-200" 
              />
            )}
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4 bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={liking}
          className={`gap-2 ${hasLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <Heart className={`h-4 w-4 ${hasLiked ? 'fill-red-500' : ''}`} />
          <span className="font-medium">{localPoll.likes}</span>
        </Button>
        
        <span className="text-sm text-gray-500">
          {new Date(localPoll.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </CardFooter>
    </Card>
  );
}