
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoleFieldProps {
  role: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  language: string;
}

const RoleField = ({ role, onChange, language }: RoleFieldProps) => {
  const roles = [
    { value: 'student', label: language === 'hy' ? 'Ուսանող' : language === 'ru' ? 'Студент' : 'Student' },
    { value: 'instructor', label: language === 'hy' ? 'Դասախոս' : language === 'ru' ? 'Преподаватель' : 'Instructor' },
    { value: 'employer', label: language === 'hy' ? 'Գործատու' : language === 'ru' ? 'Работодатель' : 'Employer' }
  ];

  const handleValueChange = (value: string) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: {
        name: 'role',
        value: value
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
  };

  const selectedRoleLabel = roles.find(r => r.value === role)?.label || roles[0].label;

  return (
    <div>
      <Label htmlFor="role" className="font-armenian">
        {language === 'hy' ? 'Դեր' : language === 'ru' ? 'Роль' : 'Role'}
      </Label>
      <Select value={role} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full mt-1">
          <SelectValue placeholder={selectedRoleLabel} />
        </SelectTrigger>
        <SelectContent>
          {roles.map((roleOption) => (
            <SelectItem key={roleOption.value} value={roleOption.value}>
              {roleOption.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleField;
