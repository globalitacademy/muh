import React from 'react';
import { format } from 'date-fns';
import { hy } from 'date-fns/locale';
import { Clock, User, Monitor, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAccessCodeUsage } from '@/hooks/usePartnerAccessCodes';

interface AccessCodeUsageDialogProps {
  accessCodeId: string | null;
  open: boolean;
  onClose: () => void;
}

export const AccessCodeUsageDialog: React.FC<AccessCodeUsageDialogProps> = ({
  accessCodeId,
  open,
  onClose,
}) => {
  const { data: usageData = [], isLoading } = useAccessCodeUsage(accessCodeId || '');

  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes) return 'Անհայտ';
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}ժ ${remainingMinutes > 0 ? `${remainingMinutes}ր` : ''}`;
    }
    return `${minutes}ր`;
  };

  const getSessionStatus = (startedAt: string | null, endedAt: string | null) => {
    if (!startedAt) return { status: 'unknown', label: 'Անհայտ', color: 'secondary' };
    if (!endedAt) return { status: 'active', label: 'Ակտիվ', color: 'default' };
    return { status: 'completed', label: 'Ավարտված', color: 'success' };
  };

  const totalUsages = usageData.length;
  const activeSessions = usageData.filter(u => u.session_started_at && !u.session_ended_at).length;
  const completedSessions = usageData.filter(u => u.session_ended_at).length;
  const averageDuration = usageData.reduce((sum, usage) => {
    return sum + (usage.session_duration_minutes || 0);
  }, 0) / (completedSessions || 1);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">Օգտագործման պատմություն</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Բեռնվում է...</div>
        ) : (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ընդամենը օգտագործումներ</p>
                      <p className="text-2xl font-bold">{totalUsages}</p>
                    </div>
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ակտիվ նիստեր</p>
                      <p className="text-2xl font-bold text-green-600">{activeSessions}</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Monitor className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ավարտված նիստեր</p>
                      <p className="text-2xl font-bold text-blue-600">{completedSessions}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Միջին տևողություն</p>
                      <p className="text-2xl font-bold">{formatDuration(Math.round(averageDuration))}</p>
                    </div>
                    <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-armenian">Օգտագործման մանրամասներ</CardTitle>
              </CardHeader>
              <CardContent>
                {usageData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Այս կոդը դեռ օգտագործված չէ
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-armenian">Օգտագործված</TableHead>
                        <TableHead className="font-armenian">Նիստի սկիզբ</TableHead>
                        <TableHead className="font-armenian">Նիստի ավարտ</TableHead>
                        <TableHead className="font-armenian">Տևողություն</TableHead>
                        <TableHead className="font-armenian">Կարգավիճակ</TableHead>
                        <TableHead className="font-armenian">IP հասցե</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usageData.map((usage) => {
                        const sessionStatus = getSessionStatus(usage.session_started_at, usage.session_ended_at);
                        return (
                          <TableRow key={usage.id}>
                            <TableCell>
                              <div className="text-sm">
                                {format(new Date(usage.used_at), 'dd MMM yyyy, HH:mm', { locale: hy })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {usage.session_started_at 
                                  ? format(new Date(usage.session_started_at), 'dd MMM yyyy, HH:mm', { locale: hy })
                                  : 'Չի սկսվել'
                                }
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {usage.session_ended_at 
                                  ? format(new Date(usage.session_ended_at), 'dd MMM yyyy, HH:mm', { locale: hy })
                                  : 'Ընթացքի մեջ'
                                }
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatDuration(usage.session_duration_minutes)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={sessionStatus.color as any}>
                                {sessionStatus.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-mono">
                                {usage.ip_address || 'Անհայտ'}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};