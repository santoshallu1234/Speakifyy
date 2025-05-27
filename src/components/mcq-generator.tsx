'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function MCQGenerator() {
  const [topic, setTopic] = useState('');
  const [mcqs, setMcqs] = useState({ questions: [] }); // Initialize with empty questions array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateMCQs = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setMcqs({ questions: [] });

    try {
      const response = await fetch('/api/mcq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate MCQs');
      }

      const data = await response.json();
      if (data && data.questions) {
        setMcqs(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to generate MCQs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g., Computer Networks)"
          className="flex-grow"
        />
        <Button 
          onClick={generateMCQs}
          disabled={loading}
          className="bg-[#5e17eb] hover:bg-[#4a11c0]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate MCQs'
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {mcqs && (
        <div className="space-y-4">
          {mcqs.questions.map((mcq: any) => (
            <Card key={mcq.question_id} className="p-6 bg-gray-800">
              <div className="space-y-4">
                <p className="text-lg font-semibold">
                  {mcq.question_id}. {mcq.question}
                </p>
                <div className="grid gap-2">
                  {Object.entries(mcq.options).map(([key, value]) => (
                    <div 
                      key={key}
                      className={`p-3 rounded-lg ${
                        mcq.correct_answer === key 
                          ? 'bg-green-900/50 border border-green-500'
                          : 'bg-gray-700/50'
                      }`}
                    >
                      <span className="font-medium">{key}:</span> {value as string}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
                  <p className="font-semibold text-green-400">Explanation:</p>
                  <p className="mt-1 text-gray-300">{mcq.explanation}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

