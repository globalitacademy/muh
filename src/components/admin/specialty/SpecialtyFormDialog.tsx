
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Specialty, CreateSpecialtyData } from '@/types/specialty';
import { iconOptions, colorOptions } from './SpecialtyConstants';

interface SpecialtyFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingSpecialty: Specialty | null;
  formData: CreateSpecialtyData;
  setFormData: React.Dispatch<React.SetStateAction<CreateSpecialtyData>>;
  isLoading: boolean;
}

const SpecialtyFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  editingSpecialty,
  formData,
  setFormData,
  isLoading
}: SpecialtyFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">
            {editingSpecialty ? 'Խմբագրել մասնագիտությունը' : 'Նոր մասնագիտություն ստեղծել'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name" className="font-armenian">Անուն (հայերեն)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="name_en" className="font-armenian">Անուն (անգլերեն)</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="name_ru" className="font-armenian">Անուն (ռուսերեն)</Label>
              <Input
                id="name_ru"
                value={formData.name_ru}
                onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="font-armenian">Նկարագրություն (հայերեն)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description_en" className="font-armenian">Նկարագրություն (անգլերեն)</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="description_ru" className="font-armenian">Նկարագրություն (ռուսերեն)</Label>
              <Textarea
                id="description_ru"
                value={formData.description_ru}
                onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="icon" className="font-armenian">Պատկերակ</Label>
              <Select 
                value={formData.icon} 
                onValueChange={(value) => {
                  if (value && value.trim() !== '') {
                    setFormData({ ...formData, icon: value });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    if (!option.value || option.value.trim() === '') {
                      return null;
                    }
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color" className="font-armenian">Գույն</Label>
              <Select 
                value={formData.color} 
                onValueChange={(value) => {
                  if (value && value.trim() !== '') {
                    setFormData({ ...formData, color: value });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => {
                    if (!option.value || option.value.trim() === '') {
                      return null;
                    }
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${option.value}`}></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="order_index" className="font-armenian">Հերթականություն</Label>
              <Input
                id="order_index"
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="font-armenian"
            >
              {isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingSpecialty ? 'Թարմացնել' : 'Ստեղծել'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="font-armenian"
            >
              Չեղարկել
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialtyFormDialog;
