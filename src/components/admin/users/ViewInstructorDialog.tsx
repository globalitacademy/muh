
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Building, Users, FileText, Calendar } from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';

interface ViewInstructorDialogProps {
  instructor: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewInstructorDialog: React.FC<ViewInstructorDialogProps> = ({
  instructor,
  open,
  onOpenChange,
}) => {
  if (!instructor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
              {instructor.avatar_url ? (
                <img 
                  src={instructor.avatar_url} 
                  alt={instructor.name || 'Instructor'} 
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            Դասախոսի տվյալներ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian">Անձնական տվյալներ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-armenian">
                  <User className="w-4 h-4" />
                  Անուն Ազգանուն
                </div>
                <p className="font-semibold">{instructor.name || 'Չի նշված'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-armenian">
                  <Mail className="w-4 h-4" />
                  ID
                </div>
                <p className="font-mono text-sm">{instructor.id}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-armenian">
                  <Phone className="w-4 h-4" />
                  Հեռախոս
                </div>
                <p className="font-semibold">{instructor.phone || 'Չի նշված'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-armenian">
                  <Badge className="w-4 h-4" />
                  Կարգավիճակ
                </div>
                <Badge className={instructor.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0' : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0'}>
                  {instructor.status === 'active' ? 'Ակտիվ' : 'Ապաակտիվ'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian">Աշխատանքային տվյալներ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-armenian">
                  <Building className="w-4 h-4" />
                  Կազմակերպություն
                </div>
                <p className="font-semibold">{instructor.organization || 'Չի նշված'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-armenian">
                  <Building className="w-4 h-4" />
                  Բաժին
                </div>
                <p className="font-semibold">{instructor.department || 'Չի նշված'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-armenian">
                  <Users className="w-4 h-4" />
                  Խումբ
                </div>
                <p className="font-semibold">{instructor.group_number || 'Չի նշված'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-armenian">
                  <Calendar className="w-4 h-4" />
                  Գրանցման ամսաթիվ
                </div>
                <p className="font-semibold">
                  {new Date(instructor.created_at).toLocaleDateString('hy-AM')}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {instructor.bio && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-armenian">
                <FileText className="w-4 h-4" />
                Կենսագրություն
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="whitespace-pre-wrap">{instructor.bio}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInstructorDialog;
