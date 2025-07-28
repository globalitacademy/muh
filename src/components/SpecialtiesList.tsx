
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Shield, Palette, Network, Bot, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSpecialties } from '@/hooks/useSpecialties';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const iconMap = {
  Code,
  Shield,
  Palette,
  Network,
  Bot,
  Brain,
};

const SpecialtiesList = () => {
  const navigate = useNavigate();
  const { data: specialties, isLoading } = useSpecialties();

  // Get module counts for each specialty
  const { data: moduleCounts } = useQuery({
    queryKey: ['specialtyModuleCounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('specialty_id')
        .eq('is_active', true);

      if (error) throw error;

      const counts: Record<string, number> = {};
      data?.forEach((module) => {
        if (module.specialty_id) {
          counts[module.specialty_id] = (counts[module.specialty_id] || 0) + 1;
        }
      });

      return counts;
    },
    enabled: !!specialties,
  });

  const handleSpecialtyClick = (specialtyId: string) => {
    const moduleCount = moduleCounts?.[specialtyId] || 0;
    if (moduleCount > 0) {
      // Navigate to courses page with specialty filter
      navigate(`/courses?specialty=${specialtyId}`);
    } else {
      console.log(`Coming soon: ${specialtyId} specialty`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edu-blue"></div>
      </div>
    );
  }

  if (!specialties || specialties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground font-armenian">Մասնագիտություններ չեն գտնվել</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {specialties.map((specialty) => {
        const IconComponent = iconMap[specialty.icon as keyof typeof iconMap] || Code;
        const moduleCount = moduleCounts?.[specialty.id] || 0;
        const isProgramming = specialty.name === 'Ծրագրավորում';
        
        return (
          <Card key={specialty.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card h-full flex flex-col">
            <CardHeader className="text-center pb-4 flex-shrink-0">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${specialty.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-armenian text-card-foreground h-12 flex items-center justify-center">
                {specialty.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 flex-grow flex flex-col justify-between p-6 pt-0">
              <div className="space-y-4">
                <p className="text-muted-foreground font-armenian leading-relaxed h-12 flex items-center justify-center">
                  {specialty.description}
                </p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground h-6">
                  <span className="font-armenian">
                    {moduleCount} մոդուլ
                  </span>
                </div>
              </div>

              <Button 
                onClick={() => handleSpecialtyClick(specialty.id)}
                className="w-full btn-modern text-white font-armenian group-hover:scale-105 transition-transform mt-auto"
                disabled={!isProgramming && moduleCount === 0}
              >
                {isProgramming || moduleCount > 0 ? 'Սկսել ուսումը' : 'Շուտով'}
                {(isProgramming || moduleCount > 0) && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SpecialtiesList;
