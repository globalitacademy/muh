
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Code, Database, Globe, Palette } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
  category: 'technical' | 'design' | 'business' | 'language';
}

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', level: 85, category: 'technical' },
    { id: '2', name: 'TypeScript', level: 80, category: 'technical' },
    { id: '3', name: 'UI/UX Design', level: 75, category: 'design' },
    { id: '4', name: 'Project Management', level: 70, category: 'business' },
  ]);
  
  const [newSkill, setNewSkill] = useState({ name: '', level: 50, category: 'technical' as const });
  const [isAdding, setIsAdding] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Code className="w-4 h-4" />;
      case 'design': return <Palette className="w-4 h-4" />;
      case 'business': return <Globe className="w-4 h-4" />;
      case 'language': return <Database className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'design': return 'bg-purple-100 text-purple-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'language': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addSkill = () => {
    if (newSkill.name) {
      setSkills([...skills, { ...newSkill, id: Date.now().toString() }]);
      setNewSkill({ name: '', level: 50, category: 'technical' });
      setIsAdding(false);
    }
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-armenian flex items-center gap-2">
          <Code className="w-5 h-5" />
          Հմտություններ և ունակություններ
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(true)}
          className="font-armenian"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ավելացնել
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding && (
          <Card className="p-4 border-dashed">
            <div className="space-y-3">
              <Input
                placeholder="Հմտության անունը"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
              <div className="flex gap-2">
                <Select value={newSkill.category} onValueChange={(value: any) => setNewSkill({ ...newSkill, category: value })}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Տեխնիկական</SelectItem>
                    <SelectItem value="design">Դիզայն</SelectItem>
                    <SelectItem value="business">Բիզնես</SelectItem>
                    <SelectItem value="language">Լեզուներ</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Progress value={newSkill.level} className="flex-1" />
                    <span className="text-sm w-12">{newSkill.level}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                    className="w-full mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addSkill}>Ավելացնել</Button>
                <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>Չեղարկել</Button>
              </div>
            </div>
          </Card>
        )}

        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              {getCategoryIcon(category)}
              <h4 className="font-semibold capitalize">{category}</h4>
              <Badge variant="secondary" className={getCategoryColor(category)}>
                {categorySkills.length}
              </Badge>
            </div>
            <div className="grid gap-3">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-armenian">Հմտություններ չեն ավելացվել</p>
            <p className="text-sm">Ավելացրեք ձեր հմտությունները՝ պրոֆիլը լրացնելու համար</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
