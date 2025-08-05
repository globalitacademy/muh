import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useJobPostings } from '@/hooks/useJobPostings';
import { MapPin, Building, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const JobPostingsSection = () => {
  const { data: jobPostings, isLoading } = useJobPostings();

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center font-armenian">Բեռնվում է...</div>
        </div>
      </section>
    );
  }

  const featuredPostings = jobPostings?.slice(0, 3) || [];

  if (featuredPostings.length === 0) {
    return null;
  }

  const getPostingTypeLabel = (type: string) => {
    switch (type) {
      case 'job': return 'Աշխատանք';
      case 'internship': return 'Պրակտիկա';
      case 'project': return 'Նախագիծ';
      default: return type;
    }
  };

  const getPostingTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-primary text-primary-foreground';
      case 'internship': return 'bg-secondary text-secondary-foreground';
      case 'project': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-armenian mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Աշխատանքային հնարավորություններ
          </h2>
          <p className="text-lg text-muted-foreground font-armenian max-w-2xl mx-auto">
            Գտեք ձեր մասնագիտությանը համապատասխան աշխատանքներ, պրակտիկաներ և նախագծեր
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredPostings.map((posting) => (
            <Card key={posting.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-muted/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={`${getPostingTypeColor(posting.posting_type)} font-armenian`}>
                    {getPostingTypeLabel(posting.posting_type)}
                  </Badge>
                  {posting.is_remote && (
                    <Badge variant="outline" className="font-armenian">
                      Հեռակա
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-armenian text-xl group-hover:text-primary transition-colors">
                  {posting.title}
                </CardTitle>
                {posting.profiles?.organization && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{posting.profiles.organization}</span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-3">
                {posting.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {posting.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {posting.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{posting.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(posting.created_at), 'dd/MM/yyyy')}</span>
                  </div>
                </div>

                {posting.salary_range && (
                  <div className="font-medium text-primary text-sm">
                    {posting.salary_range === "0" || posting.salary_range === "0 դրամ" ? "անվճար" : posting.salary_range}
                  </div>
                )}
                
                <div className="pt-3">
                  <Link to={`/job/${posting.id}`}>
                    <Button 
                      size="sm" 
                      className="w-full font-armenian"
                    >
                      Դիմել
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/jobs">
            <Button size="lg" className="font-armenian group">
              Բոլոր առաջարկները
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobPostingsSection;