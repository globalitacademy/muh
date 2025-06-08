
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool } from 'lucide-react';

interface ExercisesHeaderProps {
  completedCount: number;
  totalCount: number;
}

const ExercisesHeader = ({ completedCount, totalCount }: ExercisesHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-armenian">
          <PenTool className="w-5 h-5 text-edu-blue" />
          Գործնական վարժություններ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground font-armenian mb-4">
          Լուծեք հետևյալ վարժությունները՝ ամրապնդելու համար ստացած գիտելիքները:
        </p>
        <div className="text-sm text-muted-foreground font-armenian">
          Ավարտված՝ {completedCount}/{totalCount}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExercisesHeader;
