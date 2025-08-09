import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  availableCategories: string[];
  availableSkills: string[];
  onClear: () => void;
}

const PROJECT_STATUSES = [
  { value: 'all', label: 'Բոլոր ստատուսները' },
  { value: 'active', label: 'Ակտիվ' },
  { value: 'completed', label: 'Ավարտված' },
  { value: 'cancelled', label: 'Չեղարկված' }
];

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedSkills,
  onSkillsChange,
  availableCategories,
  availableSkills,
  onClear
}) => {
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedSkills.length > 0;

  return (
    <Card className="modern-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Ֆիլտրեր
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="h-4 w-4 mr-1" />
              Մաքրել
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Որոնում</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Որոնել նախագծեր..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 input-modern"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Կատեգորիա</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="input-modern">
              <SelectValue placeholder="Ընտրել կատեգորիա" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Բոլոր կատեգորիաները</SelectItem>
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Ստատուս</Label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="input-modern">
              <SelectValue placeholder="Ընտրել ստատուս" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills Filter */}
        <div className="space-y-2">
          <Label>Հմտություններ</Label>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {availableSkills.map((skill) => (
              <div
                key={skill}
                className={`p-2 rounded-md border cursor-pointer transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-border'
                }`}
                onClick={() => handleSkillToggle(skill)}
              >
                <div className="text-sm">{skill}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Skills */}
        {selectedSkills.length > 0 && (
          <div className="space-y-2">
            <Label>Ընտրված հմտություններ</Label>
            <div className="flex flex-wrap gap-1">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectFilters;