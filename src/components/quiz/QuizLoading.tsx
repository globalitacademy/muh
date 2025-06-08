
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const QuizLoading = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="animate-pulse font-armenian">Բեռնվում է թեստը...</div>
      </CardContent>
    </Card>
  );
};

export default QuizLoading;
