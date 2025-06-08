
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, Star, Target, BookOpen } from 'lucide-react';
import { Module } from '@/types/database';

interface ModuleDetailOverviewProps {
  module: Module;
  topicsCount: number;
}

const ModuleDetailOverview = ({ module, topicsCount }: ModuleDetailOverviewProps) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Նախնական';
      case 'intermediate': return 'Միջին';
      case 'advanced': return 'Բարձր';
      default: return level;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Description */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Դասընթացի մասին</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-armenian leading-relaxed">
            {module.description || 'Դասընթացի նկարագրությունը կարելի է ավելացնել ադմինի կողմից։'}
          </p>
          
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(module.difficulty_level)}>
              {getDifficultyText(module.difficulty_level)}
            </Badge>
            <Badge variant="outline" className="font-armenian">
              {module.category}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Վիճակագրություն</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-edu-blue/10 dark:bg-edu-blue/20 rounded-lg border border-edu-blue/20">
              <div className="p-2 bg-edu-blue/20 dark:bg-edu-blue/30 rounded-lg">
                <Calendar className="w-4 h-4 text-edu-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-edu-blue">{module.duration_weeks}</p>
                <p className="text-xs text-muted-foreground font-armenian">շաբաթ</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-success-green/10 dark:bg-success-green/20 rounded-lg border border-success-green/20">
              <div className="p-2 bg-success-green/20 dark:bg-success-green/30 rounded-lg">
                <BookOpen className="w-4 h-4 text-success-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success-green">{topicsCount}</p>
                <p className="text-xs text-muted-foreground font-armenian">դաս</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-edu-orange/10 dark:bg-edu-orange/20 rounded-lg border border-edu-orange/20">
              <div className="p-2 bg-edu-orange/20 dark:bg-edu-orange/30 rounded-lg">
                <Users className="w-4 h-4 text-edu-orange" />
              </div>
              <div>
                <p className="text-2xl font-bold text-edu-orange">{module.students_count}</p>
                <p className="text-xs text-muted-foreground font-armenian">ուսանող</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-warning-yellow/10 dark:bg-warning-yellow/20 rounded-lg border border-warning-yellow/20">
              <div className="p-2 bg-warning-yellow/20 dark:bg-warning-yellow/30 rounded-lg">
                <Star className="w-4 h-4 text-warning-yellow" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning-yellow">{module.rating?.toFixed(1) || '0.0'}</p>
                <p className="text-xs text-muted-foreground font-armenian">գնահատական</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Target className="w-5 h-5 text-edu-blue" />
            Սովորելու արդյունքներ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-armenian">
              Այս դասընթացն ավարտելուց հետո դուք կկարողանաք՝
            </p>
            <ul className="space-y-2 text-sm font-armenian">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-edu-blue rounded-full mt-2 flex-shrink-0"></div>
                Կիրառել ձեռք բերված գիտելիքները գործնական նախագծերում
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-edu-blue rounded-full mt-2 flex-shrink-0"></div>
                Լուծել բարդ խնդիրներ և խնդրանքներ
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-edu-blue rounded-full mt-2 flex-shrink-0"></div>
                Աշխատել թիմային նախագծերում
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-edu-blue rounded-full mt-2 flex-shrink-0"></div>
                Պատրաստ լինել հաջորդ մակարդակի դասընթացների համար
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Clock className="w-5 h-5 text-edu-orange" />
            Նախնական գիտելիքներ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-armenian">
              Այս դասընթացին մասնակցելու համար անհրաժեշտ է՝
            </p>
            <ul className="space-y-2 text-sm font-armenian">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-edu-orange rounded-full mt-2 flex-shrink-0"></div>
                Համակարգչային հիմնական գիտելիքներ
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-edu-orange rounded-full mt-2 flex-shrink-0"></div>
                Ցանկություն սովորելու և զարգանալու
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-edu-orange rounded-full mt-2 flex-shrink-0"></div>
                Օրական 1-2 ժամ ժամանակ ունենալ ուսումնասիրության համար
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleDetailOverview;
