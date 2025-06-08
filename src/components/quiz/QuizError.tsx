
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const QuizError = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-muted-foreground font-armenian">
          Սխալ է տեղի ունեցել թեստը բեռնելիս
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizError;
