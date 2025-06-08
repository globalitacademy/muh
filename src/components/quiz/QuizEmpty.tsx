
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuizEmptyProps {
  onComplete: () => void;
}

const QuizEmpty = ({ onComplete }: QuizEmptyProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-armenian">
          Ստուգողական թեստ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground font-armenian text-center">
          Թեստի հարցերը շուտով կլինեն հասանելի
        </p>
        <Button onClick={onComplete} className="w-full mt-4 font-armenian">
          Ավարտել դասը
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizEmpty;
