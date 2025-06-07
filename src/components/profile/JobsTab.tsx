
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJobPostings, useJobApplications, useApplyToJob } from '@/hooks/useJobPostings';
import { Briefcase, MapPin, Building, Clock, CheckCircle, XCircle } from 'lucide-react';

const JobsTab = () => {
  const { data: jobPostings, isLoading: jobsLoading } = useJobPostings();
  const { data: applications, isLoading: applicationsLoading } = useJobApplications();
  const applyToJobMutation = useApplyToJob();

  if (jobsLoading || applicationsLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ընդունված</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Մերժված</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Քննարկման մեջ</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* My Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Իմ դիմումները</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications?.map((application) => (
              <div key={application.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{application.job_postings?.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      {application.job_postings?.profiles?.organization && (
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {application.job_postings.profiles.organization}
                        </div>
                      )}
                      {application.job_postings?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {application.job_postings.location}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Դիմել է: {new Date(application.applied_at).toLocaleDateString('hy-AM')}
                    </p>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </div>
            ))}
            
            {(!applications || applications.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Դիմումներ չկան</p>
                <p className="text-sm">Դիմեք աշխատանքի տեղերին ստորև</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Հասանելի աշխատանքներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobPostings?.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{job.title}</h4>
                      {job.is_internship && (
                        <Badge variant="outline">Պրակտիկա</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      {job.profiles?.organization && (
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {job.profiles.organization}
                        </div>
                      )}
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </div>
                      )}
                    </div>
                    
                    {job.description && (
                      <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                    )}
                    
                    {job.requirements && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Պահանջներ:</strong> {job.requirements}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => applyToJobMutation.mutate({ jobId: job.id, coverLetter: '' })}
                    disabled={applications?.some(app => app.job_posting_id === job.id)}
                  >
                    {applications?.some(app => app.job_posting_id === job.id) ? 'Դիմել եք' : 'Դիմել'}
                  </Button>
                </div>
              </div>
            ))}
            
            {(!jobPostings || jobPostings.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Աշխատանքներ չկան</p>
                <p className="text-sm">Այս պահին հասանելի աշխատանք չկա</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobsTab;
