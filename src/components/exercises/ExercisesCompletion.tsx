
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const ExercisesCompletion = () => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="pt-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-800 font-armenian mb-2">
            Գեղեցիկ! Բոլոր վարժությունները ավարտված են
          </h3>
          <p className="text-green-700 font-armenian">
            Կարող եք անցնել ստուգողական թեստին:
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExercisesCompletion;
