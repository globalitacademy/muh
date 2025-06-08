
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, Ban, Shield, User, Eye } from 'lucide-react';
import { UserProfile, useUpdateUserRole } from '@/hooks/useAdminUsers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface UserActionsMenuProps {
  user: UserProfile;
  onActionComplete: () => void;
}

const UserActionsMenu: React.FC<UserActionsMenuProps> = ({ user, onActionComplete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const updateUserRole = useUpdateUserRole();

  const handleStatusChange = async (newStatus: 'active' | 'blocked' | 'suspended' | 'deleted') => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) throw error;

      // Log the action
      await supabase
        .from('admin_audit_logs')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          target_user_id: user.id,
          action: `status_changed_to_${newStatus}`,
          details: { 
            previous_status: user.status,
            new_status: newStatus,
            user_name: user.name,
            user_role: user.role 
          }
        });

      const statusText = {
        active: 'ակտիվացվել',
        blocked: 'արգելափակվել',
        suspended: 'կասեցվել',
        deleted: 'ջնջվել'
      };

      toast.success(`Օգտատերը հաջողությամբ ${statusText[newStatus]} է`);
      
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminInstructors'] });
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
      queryClient.invalidateQueries({ queryKey: ['adminEmployers'] });
      
      onActionComplete();
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast.error('Օգտատիրոջ կարգավիճակի փոփոխման սխալ');
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setShowBlockDialog(false);
    }
  };

  const handleRoleChange = (newRole: 'admin' | 'instructor' | 'student' | 'employer') => {
    updateUserRole.mutate({ userId: user.id, role: newRole });
  };

  const isBlocked = user.status === 'blocked' || user.status === 'suspended';
  const isDeleted = user.status === 'deleted';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isLoading}>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="font-armenian">
            <Eye className="w-4 h-4 mr-2" />
            Դիտել պրոֆիլը
          </DropdownMenuItem>
          <DropdownMenuItem className="font-armenian">
            <Edit className="w-4 h-4 mr-2" />
            Խմբագրել
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Role Change Options */}
          <DropdownMenuItem 
            onClick={() => handleRoleChange('admin')}
            disabled={user.role === 'admin'}
            className="font-armenian"
          >
            <Shield className="w-4 h-4 mr-2" />
            Դարձնել ադմին
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleRoleChange('instructor')}
            disabled={user.role === 'instructor'}
            className="font-armenian"
          >
            <User className="w-4 h-4 mr-2" />
            Դարձնել դասախոս
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleRoleChange('student')}
            disabled={user.role === 'student'}
            className="font-armenian"
          >
            <User className="w-4 h-4 mr-2" />
            Դարձնել ուսանող
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleRoleChange('employer')}
            disabled={user.role === 'employer'}
            className="font-armenian"
          >
            <User className="w-4 h-4 mr-2" />
            Դարձնել գործատու
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Status Change Options */}
          {isBlocked ? (
            <DropdownMenuItem 
              onClick={() => handleStatusChange('active')}
              className="font-armenian text-green-600"
            >
              <Shield className="w-4 h-4 mr-2" />
              Ակտիվացնել
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={() => setShowBlockDialog(true)}
              className="font-armenian text-orange-600"
            >
              <Ban className="w-4 h-4 mr-2" />
              Արգելափակել
            </DropdownMenuItem>
          )}
          
          {!isDeleted && (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="font-armenian text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Ջնջել
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-armenian">Հաստատել ջնջումը</AlertDialogTitle>
            <AlertDialogDescription className="font-armenian">
              Դուք վստա՞հ եք, որ ցանկանում եք ջնջել "{user.name}" օգտատիրոջը: 
              Այս գործողությունը կարող է հետադարձելի լինել, բայց օգտատերը չի կարողանա մուտք գործել համակարգ:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-armenian">Չեղարկել</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleStatusChange('deleted')}
              className="bg-red-600 hover:bg-red-700 font-armenian"
            >
              Ջնջել
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Confirmation Dialog */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-armenian">Հաստատել արգելափակումը</AlertDialogTitle>
            <AlertDialogDescription className="font-armenian">
              Դուք վստա՞հ եք, որ ցանկանում եք արգելափակել "{user.name}" օգտատիրոջը: 
              Նա չի կարողանա մուտք գործել համակարգ, մինչև այս կարգավիճակը չփոխվի:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-armenian">Չեղարկել</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleStatusChange('blocked')}
              className="bg-orange-600 hover:bg-orange-700 font-armenian"
            >
              Արգելափակել
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActionsMenu;
