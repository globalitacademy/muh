
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool } from 'lucide-react';

const ExercisesEmpty = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <PenTool className="w-5 h-5 text-edu-blue" />
            Գործնական վարժություններ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground font-armenian text-center">
            Վարժությունները շուտով կլինեն հասանելի
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisesEmpty;
