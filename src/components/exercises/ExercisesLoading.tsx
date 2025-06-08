
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ExercisesLoading = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse font-armenian">Բեռնվում են վարժությունները...</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisesLoading;
