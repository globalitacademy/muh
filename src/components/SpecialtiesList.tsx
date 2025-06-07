
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Shield, 
  Palette, 
  Network, 
  Bot, 
  Brain,
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModules } from '@/hooks/useModules';

const specialties = [
  {
    id: 'programming',
    title: 'Ծրագրավորում',
    description: 'Սովորեք ժամանակակից ծրագրավորման լեզուներ և տեխնոլոգիաներ',
    icon: Code,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'cybersecurity',
    title: 'Կիբեռանվտանգություն',
    description: 'Պաշտպանեք համակարգերը և տվյալները կիբեր սպառնալիքներից',
    icon: Shield,
    moduleCount: 0,
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'design',
    title: 'Վեբ և գրաֆիկ դիզայն',
    description: 'Ստեղծեք գեղեցիկ և ֆունկցիոնալ դիզայններ',
    icon: Palette,
    moduleCount: 0,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'networking',
    title: 'Համակարգչային ցանցեր',
    description: 'Կառավարեք և կարգավորեք համակարգչային ցանցերը',
    icon: Network,
    moduleCount: 0,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'robotics',
    title: 'Ռոբոտաշինություն',
    description: 'Նախագծեք և ստեղծեք ինտելեկտուալ ռոբոտային համակարգեր',
    icon: Bot,
    moduleCount: 0,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'ai',
    title: 'Արհեստական Բանականություն',
    description: 'Ուսումնասիրեք մեքենայական ուսուցման և AI տեխնոլոգիաները',
    icon: Brain,
    moduleCount: 0,
    color: 'from-yellow-500 to-amber-500'
  }
];

const SpecialtiesList = () => {
  const navigate = useNavigate();
  const { data: modules, isLoading } = useModules();

  const handleSpecialtyClick = (specialtyId: string) => {
    if (specialtyId === 'programming') {
      navigate('/courses');
    } else {
      // Հետագայում այլ մասնագիտությունների համար էջեր
      console.log(`Navigating to ${specialtyId} specialty`);
    }
  };

  // Ծրագրավորման մասնագիտության համար մոդուլների քանակը
  const programmingModuleCount = modules ? modules.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {specialties.map((specialty) => {
        const IconComponent = specialty.icon;
        const moduleCount = specialty.id === 'programming' ? programmingModuleCount : specialty.moduleCount || 0;
        
        return (
          <Card key={specialty.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card h-full flex flex-col">
            <CardHeader className="text-center pb-4 flex-shrink-0">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${specialty.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-armenian text-card-foreground h-12 flex items-center justify-center">
                {specialty.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 flex-grow flex flex-col justify-between p-6 pt-0">
              <div className="space-y-4">
                <p className="text-muted-foreground font-armenian leading-relaxed h-12 flex items-center justify-center">
                  {specialty.description}
                </p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground h-6">
                  <span className="font-armenian">
                    {isLoading && specialty.id === 'programming' ? 'Բեռնվում է...' : `${moduleCount} մոդուլ`}
                  </span>
                </div>
              </div>

              <Button 
                onClick={() => handleSpecialtyClick(specialty.id)}
                className="w-full btn-modern text-white font-armenian group-hover:scale-105 transition-transform mt-auto"
                disabled={moduleCount === 0}
              >
                {moduleCount > 0 ? 'Սկսել ուսումը' : 'Շուտով'}
                {moduleCount > 0 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SpecialtiesList;
