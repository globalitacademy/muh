
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ExercisesError = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground font-armenian">
            Սխալ է տեղի ունեցել վարժությունները բեռնելիս
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisesError;
