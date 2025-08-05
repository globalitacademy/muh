import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit2, Trash2, Power, PowerOff, Copy, Clock, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePartnerAccessCodes, useToggleAccessCodeStatus, useDeleteAccessCode } from '@/hooks/usePartnerAccessCodes';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { hy } from 'date-fns/locale';
import { AccessCodeDialog } from './AccessCodeDialog';
import { AccessCodeUsageDialog } from './AccessCodeUsageDialog';

export const AdminAccessCodesTab = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [usageDialogCodeId, setUsageDialogCodeId] = useState<string | null>(null);

  const { data: accessCodes = [], isLoading } = usePartnerAccessCodes();
  const toggleStatus = useToggleAccessCodeStatus();
  const deleteCode = useDeleteAccessCode();

  const filteredCodes = accessCodes.filter(code => {
    const matchesSearch = code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || code.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'expired': return 'destructive';
      case 'exhausted': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ակտիվ';
      case 'inactive': return 'Ապաակտիվ';
      case 'expired': return 'Ավարտված';
      case 'exhausted': return 'Սպառված';
      default: return status;
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatus.mutateAsync({ id, isActive: !currentStatus });
      toast({
        title: 'Կոդի կարգավիճակը փոխվել է',
        description: `Կոդը ${!currentStatus ? 'ակտիվացվել' : 'ապաակտիվացվել'} է։`,
      });
    } catch (error) {
      toast({
        title: 'Սխալ',
        description: 'Կոդի կարգավիճակը չհաջողվեց փոխել։',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCode.mutateAsync(id);
      toast({
        title: 'Կոդը ջնջվել է',
        description: 'Հասանելիության կոդը հաջողությամբ ջնջվել է։',
      });
    } catch (error) {
      toast({
        title: 'Սխալ',
        description: 'Կոդը չհաջողվեց ջնջել։',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Պատճենավորվել է',
      description: 'Կոդը պատճենավորվել է հիշողության մեջ։',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}ժ ${remainingMinutes > 0 ? `${remainingMinutes}ր` : ''}`;
    }
    return `${minutes}ր`;
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-armenian">Հասանելիության կոդեր</h2>
          <p className="text-muted-foreground">
            Գործընկերների մոդուլային հասանելիության կոդերի կառավարում
          </p>
        </div>
        <Button onClick={() => setDialogMode('create')} className="font-armenian">
          <Plus className="mr-2 h-4 w-4" />
          Նոր կոդ
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ընդամենը կոդեր</p>
                <p className="text-2xl font-bold">{accessCodes.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ակտիվ կոդեր</p>
                <p className="text-2xl font-bold text-green-600">
                  {accessCodes.filter(c => c.is_active && c.status === 'active').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Power className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ավարտված կոդեր</p>
                <p className="text-2xl font-bold text-red-600">
                  {accessCodes.filter(c => c.status === 'expired' || isExpired(c.expires_at)).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ընդամենը օգտագործումներ</p>
                <p className="text-2xl font-bold">
                  {accessCodes.reduce((sum, code) => sum + code.current_uses, 0)}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ֆիլտրներ և որոնում</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Որոնել կոդի կամ անվանման կողմից..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="font-armenian">
                  <Filter className="mr-2 h-4 w-4" />
                  Կարգավիճակ: {statusFilter === 'all' ? 'Բոլորը' : getStatusLabel(statusFilter)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  Բոլորը
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Ակտիվ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                  Ապաակտիվ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('expired')}>
                  Ավարտված
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('exhausted')}>
                  Սպառված
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Access Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Հասանելիության կոդեր</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Բեռնվում է...</div>
          ) : filteredCodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Կոդեր չեն գտնվել
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-armenian">Կոդ</TableHead>
                  <TableHead className="font-armenian">Անվանում</TableHead>
                  <TableHead className="font-armenian">Կարգավիճակ</TableHead>
                  <TableHead className="font-armenian">Ավարտ</TableHead>
                  <TableHead className="font-armenian">Տևողություն</TableHead>
                  <TableHead className="font-armenian">Օգտագործում</TableHead>
                  <TableHead className="font-armenian">Գործողություններ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {code.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{code.name}</div>
                        {code.description && (
                          <div className="text-sm text-muted-foreground">
                            {code.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(code.status)}>
                          {getStatusLabel(code.status)}
                        </Badge>
                        {!code.is_active && (
                          <Badge variant="outline">Ապաակտիվ</Badge>
                        )}
                        {isExpired(code.expires_at) && (
                          <Badge variant="destructive">Ժամկետանց</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(code.expires_at), 'dd MMM yyyy, HH:mm', { locale: hy })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDuration(code.activity_duration_minutes)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {code.current_uses} / {code.max_uses}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Գործողություններ
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem 
                            onClick={() => setUsageDialogCodeId(code.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Օգտագործման պատմություն
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedCode(code.id);
                              setDialogMode('edit');
                            }}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Խմբագրել
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(code.id, code.is_active)}
                          >
                            {code.is_active ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Ապաակտիվացնել
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Ակտիվացնել
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(code.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Ջնջել
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AccessCodeDialog
        mode={dialogMode}
        codeId={selectedCode}
        open={dialogMode !== null}
        onClose={() => {
          setDialogMode(null);
          setSelectedCode(null);
        }}
      />

      <AccessCodeUsageDialog
        accessCodeId={usageDialogCodeId}
        open={usageDialogCodeId !== null}
        onClose={() => setUsageDialogCodeId(null)}
      />
    </div>
  );
};