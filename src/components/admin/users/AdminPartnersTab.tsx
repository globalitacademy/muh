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

interface PartnerInstitution {
  id: string;
  institution_name: string;
  institution_type: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  is_verified: boolean;
  is_active: boolean;
}

interface PartnerProfile {
  id: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  role: string;
  phone: string | null;
  address: string | null;
  department: string | null;
  group_number: string | null;
  avatar_url: string | null;
  cover_photo_url: string | null;
  bio: string | null;
  status: string;
  verified: boolean;
  email_verified: boolean;
  two_factor_enabled: boolean;
  birth_date: string | null;
  field_of_study: string | null;
  personal_website: string | null;
  linkedin_url: string | null;
  language_preference: string;
  is_visible_to_employers: boolean;
  created_at: string;
  updated_at: string;
  partner_institutions: PartnerInstitution[];
}

const AdminPartnersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: partners, isLoading, refetch } = useQuery({
    queryKey: ['admin-partners'],
    queryFn: async () => {
      // First get partners data
      const { data: partnersData, error: partnersError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          first_name,
          last_name,
          organization,
          role,
          phone,
          address,
          department,
          group_number,
          avatar_url,
          cover_photo_url,
          bio,
          status,
          verified,
          email_verified,
          two_factor_enabled,
          birth_date,
          field_of_study,
          personal_website,
          linkedin_url,
          language_preference,
          is_visible_to_employers,
          created_at,
          updated_at
        `)
        .eq('role', 'partner')
        .order('created_at', { ascending: false });

      if (partnersError) throw partnersError;

      // Then get institutions data separately
      const { data: institutionsData, error: institutionsError } = await supabase
        .from('partner_institutions')
        .select('*');

      if (institutionsError) throw institutionsError;

      // Merge the data
      const partnersWithInstitutions = (partnersData || []).map(partner => ({
        ...partner,
        partner_institutions: (institutionsData || []).filter(inst => inst.partner_id === partner.id)
      }));

      return partnersWithInstitutions as any;
    },
  });

  const filteredPartners = partners?.filter(partner =>
    partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.field_of_study?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.partner_institutions?.[0]?.institution_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.partner_institutions?.[0]?.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.partner_institutions?.[0]?.website_url?.toLowerCase().includes(searchTerm.toLowerCase())
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
        {filteredPartners.map((partner) => {
          const institution = partner.partner_institutions?.[0];
          
          return (
            <Card key={partner.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Organization Logo */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                        <AvatarImage 
                          src={institution?.logo_url || partner.avatar_url} 
                          className="object-cover" 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-bold">
                          {institution?.institution_name?.charAt(0) || partner.organization?.charAt(0) || partner.name?.charAt(0) || 'Գ'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Organization Information */}
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* Header with Organization Name and Status */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-xl text-foreground font-armenian">
                            {institution?.institution_name || partner.organization || 'Կազմակերպություն նշված չէ'}
                          </h3>
                          <div className="flex gap-2">
                            <Badge 
                              variant={partner.status === 'active' ? 'default' : 'secondary'} 
                              className="text-xs font-medium"
                            >
                              {partner.status === 'active' ? 'Ակտիվ' : 'Ապաակտիվ'}
                            </Badge>
                            {(partner.verified || institution?.is_verified) && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                Հաստատված
                              </Badge>
                            )}
                            {partner.email_verified && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                Էլ.փոստ հաստատված
                              </Badge>
                            )}
                            {institution?.institution_type && (
                              <Badge variant="outline" className="text-xs">
                                {institution.institution_type === 'educational' ? 'Կրթական' : institution.institution_type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Director Information */}
                        {(partner.name || partner.first_name || partner.last_name) && (
                          <div className="flex items-center gap-2 text-base">
                            <span className="font-semibold text-muted-foreground font-armenian">Տնօրեն:</span>
                            <span className="font-medium text-foreground font-armenian">
                              {partner.name || `${partner.first_name || ''} ${partner.last_name || ''}`.trim()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Institution Description */}
                      {institution?.description && (
                        <div className="space-y-2">
                          <span className="font-medium text-muted-foreground font-armenian text-sm">Նկարագրություն:</span>
                          <p className="text-foreground font-armenian text-sm leading-relaxed">{institution.description}</p>
                        </div>
                      )}
                      
                      {/* Contact Information Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Institution Contact Email */}
                        {institution?.contact_email && (
                          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <span className="font-medium text-blue-700 font-armenian text-sm">Էլ. փոստ:</span>
                            <a 
                              href={`mailto:${institution.contact_email}`}
                              className="font-medium text-blue-600 hover:text-blue-800 underline"
                            >
                              {institution.contact_email}
                            </a>
                          </div>
                        )}
                        
                        {/* Institution Contact Phone */}
                        {institution?.contact_phone && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                            <span className="font-medium text-green-700 font-armenian text-sm">Հեռախոս:</span>
                            <a 
                              href={`tel:${institution.contact_phone}`}
                              className="font-medium text-green-600 hover:text-green-800"
                            >
                              {institution.contact_phone}
                            </a>
                          </div>
                        )}
                        
                        {/* Institution Website */}
                        {institution?.website_url && (
                          <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
                            <span className="font-medium text-purple-700 font-armenian text-sm">Վեբկայք:</span>
                            <a 
                              href={institution.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-purple-600 hover:text-purple-800 underline truncate"
                            >
                              {institution.website_url.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                        
                        {/* Institution Address */}
                        {institution?.address && (
                          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                            <span className="font-medium text-orange-700 font-armenian text-sm">Հասցե:</span>
                            <span className="font-medium text-orange-600 font-armenian truncate">{institution.address}</span>
                          </div>
                        )}
                        
                        {/* Partner Personal Phone */}
                        {partner.phone && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Անձնական հեռախոս:</span>
                            <span className="font-medium text-foreground">{partner.phone}</span>
                          </div>
                        )}
                        
                        {partner.department && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Բաժին:</span>
                            <span className="font-medium text-foreground font-armenian">{partner.department}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Personal Information */}
                      {partner.bio && (
                        <div className="border-t pt-3">
                          <div className="space-y-2">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Անձնական ինֆո:</span>
                            <p className="text-foreground font-armenian text-sm leading-relaxed">{partner.bio}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Additional Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {partner.field_of_study && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Ոլորտ:</span>
                            <span className="font-medium text-foreground font-armenian">{partner.field_of_study}</span>
                          </div>
                        )}
                        
                        {partner.personal_website && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Անձնական կայք:</span>
                            <a 
                              href={partner.personal_website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-800 underline truncate"
                            >
                              {partner.personal_website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                        
                        {partner.linkedin_url && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">LinkedIn:</span>
                            <a 
                              href={partner.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-800 underline"
                            >
                              LinkedIn պրոֆիլ
                            </a>
                          </div>
                        )}
                        
                        {partner.language_preference && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Լեզու:</span>
                            <span className="font-medium text-foreground">
                              {partner.language_preference === 'hy' ? 'Հայերեն' : 
                               partner.language_preference === 'en' ? 'English' : 
                               partner.language_preference === 'ru' ? 'Русский' : partner.language_preference}
                            </span>
                          </div>
                        )}
                        
                        {/* Registration Date */}
                        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                          <span className="font-medium text-muted-foreground font-armenian text-sm">Գրանցման ամսաթիվ:</span>
                          <span className="font-medium text-foreground">
                            {new Date(partner.created_at).toLocaleDateString('hy-AM')}
                          </span>
                        </div>
                      </div>
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
          );
        })}
      </div>
      )}
    </div>
  );
};

export default AdminPartnersTab;