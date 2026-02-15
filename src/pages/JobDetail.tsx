import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useJobPostings } from '@/hooks/useJobPostings';
import { MapPin, Building, Calendar, ArrowLeft, Briefcase, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: jobPostings, isLoading } = useJobPostings();
  
  const posting = jobPostings?.find(p => p.id === id);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center font-armenian">Բեռնվում է...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!posting) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold font-armenian">Առաջարկը չգտնվեց</h1>
            <Button onClick={() => navigate('/jobs')} className="font-armenian">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Վերադառնալ առաջարկներին
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/jobs')} 
            className="font-armenian"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Վերադառնալ առաջարկներին
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2">
                    <Badge className={`${getPostingTypeColor(posting.posting_type)} font-armenian`}>
                      {getPostingTypeLabel(posting.posting_type)}
                    </Badge>
                    {posting.is_remote && (
                      <Badge variant="outline" className="font-armenian">
                        Հեռակա
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="font-armenian text-3xl mb-2">
                  {posting.title}
                </CardTitle>
                {posting.profiles?.organization && (
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    <Building className="w-5 h-5" />
                    <span>{posting.profiles.organization}</span>
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Description */}
            {posting.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-armenian">Նկարագրություն</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {posting.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {posting.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-armenian">Պահանջներ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {posting.requirements}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-armenian">Հիմնական տվյալներ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {posting.salary_range && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium font-armenian">Աշխատավարձ</p>
                      <p className="text-sm text-muted-foreground">{posting.salary_range}</p>
                    </div>
                  </div>
                )}

                {posting.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium font-armenian">Գտնվելու վայր</p>
                      <p className="text-sm text-muted-foreground">{posting.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium font-armenian">Տեսակ</p>
                    <p className="text-sm text-muted-foreground">
                      {getPostingTypeLabel(posting.posting_type)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium font-armenian">Ստեղծվել է</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(posting.created_at), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>

                {posting.expires_at && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium font-armenian">Ծանղավարտ</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(posting.expires_at), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Apply Button */}
            <Card>
              <CardContent className="pt-6">
                <Button className="w-full font-armenian" size="lg">
                  Դիմել
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Դիմելու համար անհրաժեշտ է մուտք գործել
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetail;