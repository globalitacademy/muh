
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface InstructorsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const InstructorsSearch: React.FC<InstructorsSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Որոնել դասախոսների մեջ..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 font-armenian"
      />
    </div>
  );
};

export default InstructorsSearch;
