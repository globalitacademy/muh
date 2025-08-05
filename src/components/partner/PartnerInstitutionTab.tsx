import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Building2, Globe, Mail, Phone, MapPin, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PartnerInstitution {
  id: string;
  partner_id: string;
  institution_name: string;
  institution_type: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_verified: boolean;
  is_active: boolean;
}

export default function PartnerInstitutionTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    institution_name: '',
    institution_type: 'educational',
    description: '',
    website_url: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  });

  const { data: institution, isLoading } = useQuery({
    queryKey: ['partner-institution', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_institutions')
        .select('*')
        .eq('partner_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: result, error } = await supabase
        .from('partner_institutions')
        .insert({
          partner_id: user?.id,
          ...data
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Հաջողություն",
        description: "Հաստատությունը բարեհաջող ստեղծվել է",
      });
      queryClient.invalidateQueries({ queryKey: ['partner-institution'] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ստեղծել հաստատությունը",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: result, error } = await supabase
        .from('partner_institutions')
        .update(data)
        .eq('id', institution?.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Հաջողություն",
        description: "Հաստատությունը բարեհաջող թարմացվել է",
      });
      queryClient.invalidateQueries({ queryKey: ['partner-institution'] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց թարմացնել հաստատությունը",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (institution) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք ընտրել նկարի ֆայլ",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Սխալ",
        description: "Ֆայլի չափը չպետք է գերազանցի 5 ՄԲ-ը",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/logo.${fileExt}`;

      // Delete existing logo if any
      if (institution?.logo_url) {
        const oldPath = institution.logo_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('institution-logos')
            .remove([`${user?.id}/${oldPath}`]);
        }
      }

      // Upload new logo
      const { error: uploadError } = await supabase.storage
        .from('institution-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('institution-logos')
        .getPublicUrl(fileName);

      // Update institution with new logo URL
      if (institution) {
        const { error: updateError } = await supabase
          .from('partner_institutions')
          .update({ logo_url: data.publicUrl })
          .eq('id', institution.id);

        if (updateError) throw updateError;

        toast({
          title: "Հաջողություն",
          description: "Լոգոն բարեհաջող վերբեռնվել է",
        });
        queryClient.invalidateQueries({ queryKey: ['partner-institution'] });
      }
    } catch (error: any) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց վերբեռնել լոգոն",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogoRemove = async () => {
    if (!institution?.logo_url) return;

    try {
      const path = institution.logo_url.split('/').pop();
      if (path) {
        await supabase.storage
          .from('institution-logos')
          .remove([`${user?.id}/${path}`]);
      }

      const { error } = await supabase
        .from('partner_institutions')
        .update({ logo_url: null })
        .eq('id', institution.id);

      if (error) throw error;

      toast({
        title: "Հաջողություն",
        description: "Լոգոն հեռացվել է",
      });
      queryClient.invalidateQueries({ queryKey: ['partner-institution'] });
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց հեռացնել լոգոն",
        variant: "destructive",
      });
    }
  };

  const startEditing = () => {
    if (institution) {
      setFormData({
        institution_name: institution.institution_name,
        institution_type: institution.institution_type,
        description: institution.description || '',
        website_url: institution.website_url || '',
        contact_email: institution.contact_email || '',
        contact_phone: institution.contact_phone || '',
        address: institution.address || ''
      });
    }
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!institution && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Կրթական հաստատություն
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Դուք դեռ չեք ստեղծել ձեր կրթական հաստատությունը
            </p>
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ստեղծել հաստատություն
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {institution ? 'Խմբագրել հաստատությունը' : 'Ստեղծել նոր հաստատություն'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="logo-upload">Հաստատության լոգո</Label>
              <div className="mt-2 flex items-center gap-4">
                {formData.institution_name && (
                  <div className="relative">
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Վերբեռնում...' : 'Ընտրել լոգո'}
                    </Button>
                  </div>
                )}
                {!formData.institution_name && (
                  <p className="text-sm text-muted-foreground">
                    Նախ լրացրեք հաստատության անունը
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="institution_name">Հաստատության անվանումը *</Label>
              <Input
                id="institution_name"
                value={formData.institution_name}
                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Նկարագրություն</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="website_url">Կայքի հասցե</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Կապի էլեկտրոնային հասցե</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="contact_phone">Հեռախոսահամար</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="address">Հասցե</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? 'Պահում...' : 'Պահել'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Չեղարկել
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {institution.institution_name}
          </div>
          <Button onClick={startEditing} variant="outline">
            Խմբագրել
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Institution Logo */}
        {institution.logo_url && (
          <div className="flex items-center gap-4">
            <img 
              src={institution.logo_url} 
              alt={`${institution.institution_name} լոգո`}
              className="h-16 w-16 object-contain rounded-lg border"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">Հաստատության լոգո</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogoRemove}
                className="text-red-600 hover:text-red-700 p-0 h-auto"
              >
                <X className="h-4 w-4 mr-1" />
                Հեռացնել
              </Button>
            </div>
          </div>
        )}

        {/* Upload logo section */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
          <input
            id="logo-upload-view"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('logo-upload-view')?.click()}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Վերբեռնում...' : institution.logo_url ? 'Փոխել լոգոն' : 'Վերբեռնել լոգո'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            PNG, JPG մինչև 5ՄԲ
          </p>
        </div>

        {institution.description && (
          <p className="text-muted-foreground">{institution.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {institution.website_url && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a 
                href={institution.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {institution.website_url}
              </a>
            </div>
          )}

          {institution.contact_email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{institution.contact_email}</span>
            </div>
          )}

          {institution.contact_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{institution.contact_phone}</span>
            </div>
          )}

          {institution.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{institution.address}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <div className={`px-2 py-1 rounded text-sm ${
            institution.is_verified 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {institution.is_verified ? 'Վավերացված' : 'Սպասում է վավերացմանը'}
          </div>
          <div className={`px-2 py-1 rounded text-sm ${
            institution.is_active 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {institution.is_active ? 'Ակտիվ' : 'Անակտիվ'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}