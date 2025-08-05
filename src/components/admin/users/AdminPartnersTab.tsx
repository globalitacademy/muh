import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import UserActionsMenu from './shared/UserActionsMenu';

const AdminPartnersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: partners, isLoading, refetch } = useQuery({
    queryKey: ['admin-partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'partner')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const filteredPartners = partners?.filter(partner =>
    partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full sm:w-80" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-edu-blue to-edu-orange rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-armenian">Գործընկերներ</h3>
            <p className="text-sm text-muted-foreground font-armenian">
              {filteredPartners.length} գործընկեր
            </p>
          </div>
        </div>

        <Button className="font-armenian">
          <Plus className="w-4 h-4 mr-2" />
          Ավելացնել գործընկեր
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Որոնել գործընկերների մեջ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 font-armenian"
        />
      </div>

      {/* Partners List */}
      {filteredPartners.length === 0 && !isLoading ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold font-armenian">Գործընկերներ չեն գտնվել</h3>
              <p className="text-muted-foreground font-armenian">
                {searchTerm ? 'Փորձեք փոխել որոնման պարամետրերը' : 'Դեռ գործընկերներ չկան համակարգում'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Organization Logo */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                        <AvatarImage src={partner.avatar_url} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-bold">
                          {partner.organization?.charAt(0) || partner.name?.charAt(0) || 'Գ'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Organization Information */}
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* Header with Organization Name and Status */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-xl text-foreground font-armenian">
                            {partner.organization || 'Կազմակերպություն նշված չէ'}
                          </h3>
                          <Badge 
                            variant={partner.status === 'active' ? 'default' : 'secondary'} 
                            className="text-xs font-medium"
                          >
                            {partner.status === 'active' ? 'Ակտիվ' : 'Ապաակտիվ'}
                          </Badge>
                        </div>
                        
                        {/* Director Information */}
                        {partner.name && (
                          <div className="flex items-center gap-2 text-base">
                            <span className="font-semibold text-muted-foreground font-armenian">Տնօրեն:</span>
                            <span className="font-medium text-foreground font-armenian">{partner.name}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Contact Information Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {partner.phone && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Հեռախոս:</span>
                            <span className="font-medium text-foreground">{partner.phone}</span>
                          </div>
                        )}
                        
                        {partner.address && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Հասցե:</span>
                            <span className="font-medium text-foreground font-armenian truncate">{partner.address}</span>
                          </div>
                        )}
                        
                        {partner.department && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Բաժին:</span>
                            <span className="font-medium text-foreground font-armenian">{partner.department}</span>
                          </div>
                        )}
                        
                        {partner.group_number && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Խումբ:</span>
                            <span className="font-medium text-foreground">{partner.group_number}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Description */}
                      {partner.bio && (
                        <div className="border-t pt-3">
                          <div className="space-y-2">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Նկարագրություն:</span>
                            <p className="text-foreground font-armenian text-sm leading-relaxed">{partner.bio}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions Menu */}
                  <div className="flex-shrink-0 ml-4">
                    <UserActionsMenu 
                      user={partner} 
                      onActionComplete={() => refetch()} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPartnersTab;