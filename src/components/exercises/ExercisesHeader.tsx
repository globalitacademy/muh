
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool } from 'lucide-react';

interface ExercisesHeaderProps {
  totalCount: number;
}

const ExercisesHeader = ({ totalCount }: ExercisesHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-armenian">
          <PenTool className="w-5 h-5 text-primary" />
          Տնային առաջադրանք
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground font-armenian">
          Լուծեք հետևյալ {totalCount} խնդիրները՝ ամրապնդելու համար ստացած գիտելիքները։
        </p>
      </CardContent>
    </Card>
  );
};

export default ExercisesHeader;
