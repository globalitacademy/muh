import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Users, 
  FileText, 
  Calendar,
  MapPin,
  Globe,
  Linkedin,
  GraduationCap,
  Shield,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile;
}

const ViewUserDialog: React.FC<ViewUserDialogProps> = ({ open, onOpenChange, user }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'instructor': return <GraduationCap className="w-4 h-4" />;
      case 'student': return <User className="w-4 h-4" />;
      case 'employer': return <Building className="w-4 h-4" />;
      case 'partner': return <Users className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Ադմին';
      case 'instructor': return 'Դասախոս';
      case 'student': return 'Ուսանող';
      case 'employer': return 'Գործատու';
      case 'partner': return 'Գործընկեր';
      default: return role;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Ակտիվ</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Ընթացքի մեջ</Badge>;
      case 'suspended':
        return <Badge className="bg-orange-500 text-white">Կասեցված</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500 text-white">Արգելափակված</Badge>;
      case 'deleted':
        return <Badge className="bg-gray-500 text-white">Ջնջված</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback className="bg-gradient-to-br from-edu-blue to-edu-orange text-white">
                {user.name?.charAt(0) || user.first_name?.charAt(0) || 'Օ'}
              </AvatarFallback>
            </Avatar>
            Օգտատիրոջ պրոֆիլ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with basic info */}
          <div className="border-b pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-armenian">
                  {user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Անանուն'}
                </h2>
                <div className="flex items-center gap-2">
                  {getRoleIcon(user.role)}
                  <span className="text-lg text-muted-foreground font-armenian">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(user.status)}
                  {user.verified && (
                    <Badge className="bg-blue-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Հաստատված
                    </Badge>
                  )}
                  {user.email_verified && (
                    <Badge className="bg-green-500 text-white">
                      <Mail className="w-3 h-3 mr-1" />
                      Էլ․փոստ հաստատված
                    </Badge>
                  )}
                  {user.two_factor_enabled && (
                    <Badge className="bg-purple-500 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      2FA
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian flex items-center gap-2">
              <User className="w-5 h-5" />
              Անձնական տվյալներ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.first_name && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-armenian">Անուն</p>
                  <p className="font-medium">{user.first_name}</p>
                </div>
              )}
              
              {user.last_name && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-armenian">Ազգանուն</p>
                  <p className="font-medium">{user.last_name}</p>
                </div>
              )}

              {user.birth_date && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-armenian">Ծննդյան օր</p>
                  <p className="font-medium">{new Date(user.birth_date).toLocaleDateString('hy-AM')}</p>
                </div>
              )}

              {user.phone && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-armenian flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Հեռախոս
                  </p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}

              {user.address && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-armenian flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Հասցե
                  </p>
                  <p className="font-medium font-armenian">{user.address}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-armenian">Լեզվի նախընտրություն</p>
                <p className="font-medium">
                  {user.language_preference === 'hy' ? 'Հայերեն' : 
                   user.language_preference === 'en' ? 'English' : 
                   user.language_preference === 'ru' ? 'Русский' : user.language_preference}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian flex items-center gap-2">
              <Building className="w-5 h-5" />
              Մասնագիտական տվյալներ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.organization && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-armenian">Կազմակերպություն</p>
                  <p className="font-medium font-armenian">{user.organization}</p>
                </div>
              )}

              {user.department && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-armenian">Բաժին</p>
                  <p className="font-medium font-armenian">{user.department}</p>
                </div>
              )}

              {user.field_of_study && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-armenian">Մասնագիտություն</p>
                  <p className="font-medium font-armenian">{user.field_of_study}</p>
                </div>
              )}

              {user.group_number && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-armenian flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Խումբ
                  </p>
                  <p className="font-medium">{user.group_number}</p>
                </div>
              )}
            </div>
          </div>

          {/* Online Presence */}
          {(user.personal_website || user.linkedin_url) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-armenian flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Օնլայն ներկայություն
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.personal_website && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-armenian">Անձնական կայք</p>
                    <a 
                      href={user.personal_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {user.personal_website}
                    </a>
                  </div>
                )}

                {user.linkedin_url && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-armenian flex items-center gap-1">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </p>
                    <a 
                      href={user.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {user.linkedin_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-armenian flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Կենսագրություն
              </h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="whitespace-pre-wrap font-armenian">{user.bio}</p>
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold font-armenian flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Համակարգային տվյալներ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <p className="text-muted-foreground font-armenian">ID</p>
                <p className="font-mono bg-muted px-2 py-1 rounded text-xs break-all">{user.id}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground font-armenian">Գրանցման ամսաթիվ</p>
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString('hy-AM', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>

              {user.updated_at && (
                <div className="space-y-2">
                  <p className="text-muted-foreground font-armenian">Վերջին թարմացում</p>
                  <p className="font-medium">{new Date(user.updated_at).toLocaleDateString('hy-AM', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-muted-foreground font-armenian">Գործատուների համար տեսանելի</p>
                <div className="flex items-center gap-1">
                  {user.is_visible_to_employers ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>{user.is_visible_to_employers ? 'Այո' : 'Ոչ'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;