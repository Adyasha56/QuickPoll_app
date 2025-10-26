'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';

export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('At least 2 options required!');
      return;
    }

    setLoading(true);
    try {
      const response = await api.createPoll({
        title,
        description,
        options: validOptions,
      });

      if (response.success) {
        const socket = getSocket();
        socket.emit('poll-created', response.data);

        setTitle('');
        setDescription('');
        setOptions(['', '']);
        alert('Poll created successfully! 🎉');
      } else {
        alert('Error creating poll: ' + response.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-2 shadow-sm">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="text-2xl text-gray-900">Create New Poll</CardTitle>
        <CardDescription className="text-gray-600">
          Ask a question and add options for people to vote
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Poll Question
            </label>
            <Input
              placeholder="e.g., What's your favorite programming language?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-base border-gray-300 focus:border-gray-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Description (optional)
            </label>
            <Textarea
              placeholder="Add more context to your poll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="border-gray-300 focus:border-gray-900 resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">
              Answer Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                  className="border-gray-300 focus:border-gray-900"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </Button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full border-gray-300 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gray-900 hover:bg-gray-800 text-white" 
            disabled={loading}
            size="lg"
          >
            {loading ? 'Creating...' : 'Create Poll'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}