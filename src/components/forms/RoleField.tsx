
import React from 'react';
import { Label } from '@/components/ui/label';

interface RoleFieldProps {
  role: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  language: string;
}

const RoleField = ({ role, onChange, language }: RoleFieldProps) => {
  const roles = [
    { value: 'student', label: language === 'hy' ? 'Ուսանող' : language === 'ru' ? 'Студент' : 'Student' },
    { value: 'instructor', label: language === 'hy' ? 'Դասախոս' : language === 'ru' ? 'Преподаватель' : 'Instructor' },
    { value: 'employer', label: language === 'hy' ? 'Գործատու' : language === 'ru' ? 'Работодатель' : 'Employer' }
  ];

  return (
    <div>
      <Label htmlFor="role" className="font-armenian">
        {language === 'hy' ? 'Դեր' : language === 'ru' ? 'Роль' : 'Role'}
      </Label>
      <select
        id="role"
        name="role"
        value={role}
        onChange={onChange}
        className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {roles.map((roleOption) => (
          <option key={roleOption.value} value={roleOption.value}>
            {roleOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleField;
