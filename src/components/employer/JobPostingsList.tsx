import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEmployerJobPostings } from '@/hooks/useJobPostings';
import { Calendar, MapPin, Users, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

const JobPostingsList = () => {
  const { data: jobPostings, isLoading } = useEmployerJobPostings();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center font-armenian">Բեռնվում է...</div>
        </CardContent>
      </Card>
    );
  }

  if (!jobPostings || jobPostings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-2">
            <Users className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold font-armenian">Դեռ առաջարկներ չկան</h3>
            <p className="text-muted-foreground font-armenian">
              Ստեղծեք ձեր առաջին առաջարկը ուսանողների հետ կապ հաստատելու համար
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPostingTypeLabel = (type: string) => {
    switch (type) {
      case 'job': return 'Աշխատանք';
      case 'internship': return 'Պրակտիկա';
      case 'project': return 'Նախագիծ';
      default: return type;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {jobPostings.map((posting) => (
        <Card key={posting.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="font-armenian text-lg">{posting.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-armenian">
                    {getPostingTypeLabel(posting.posting_type)}
                  </Badge>
                  <Badge className={getStatusColor(posting.is_active)}>
                    {posting.is_active ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Ակտիվ
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Ապաակտիվ
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {posting.description && (
              <p className="text-muted-foreground line-clamp-2">{posting.description}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {posting.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{posting.location}</span>
                  {posting.is_remote && <span>(Հեռակա)</span>}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Ստեղծվել է {format(new Date(posting.created_at), 'dd/MM/yyyy')}</span>
              </div>
              
              {posting.expires_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Ծանղավարտ {format(new Date(posting.expires_at), 'dd/MM/yyyy')}</span>
                </div>
              )}
            </div>

            {posting.salary_range && (
              <div className="font-medium text-primary">
                {posting.salary_range}
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="font-armenian">
                Խմբագրել
              </Button>
              <Button variant="outline" size="sm" className="font-armenian">
                Դիմումներ
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobPostingsList;