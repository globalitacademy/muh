import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useJobPostings } from '@/hooks/useJobPostings';
import { MapPin, Building, Calendar, Search, Filter, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

const Jobs = () => {
  const { data: jobPostings, isLoading } = useJobPostings();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

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

  const filteredPostings = jobPostings?.filter(posting => {
    const matchesSearch = posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.profiles?.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || posting.posting_type === typeFilter;
    
    const matchesLocation = locationFilter === 'all' || 
                           locationFilter === 'remote' && posting.is_remote ||
                           posting.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  }) || [];

  const uniqueLocations = [...new Set(jobPostings?.map(p => p.location).filter(Boolean))];

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-armenian mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Աշխատանքային հնարավորություններ
          </h1>
          <p className="text-lg text-muted-foreground font-armenian max-w-2xl mx-auto">
            Գտեք ձեր մասնագիտությանը համապատասխան աշխատանքներ, պրակտիկաներ և նախագծեր
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-armenian">
              <Filter className="w-5 h-5" />
              Զտիչներ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Փնտրել առաջարկներ..."
                  className="pl-10 font-armenian"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրել տեսակը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-armenian">Բոլոր տեսակները</SelectItem>
                  <SelectItem value="job" className="font-armenian">Աշխատանք</SelectItem>
                  <SelectItem value="internship" className="font-armenian">Պրակտիկա</SelectItem>
                  <SelectItem value="project" className="font-armenian">Նախագիծ</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրել վայրը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-armenian">Բոլոր վայրերը</SelectItem>
                  <SelectItem value="remote" className="font-armenian">Հեռակա աշխատանք</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location!.toLowerCase()}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground font-armenian">
            Գտնվել է {filteredPostings.length} առաջարկ
          </p>
        </div>

        {filteredPostings.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Briefcase className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold font-armenian">Առաջարկներ չգտնվեցին</h3>
                <p className="text-muted-foreground font-armenian">
                  {searchTerm || typeFilter !== 'all' || locationFilter !== 'all' 
                    ? 'Փորձեք փոխել զտիչները կամ փնտրման բանալի բառերը'
                    : 'Դեռ առաջարկներ չկան'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPostings.map((posting) => (
              <Card key={posting.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
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
                  <CardTitle className="font-armenian text-xl">
                    {posting.title}
                  </CardTitle>
                  {posting.profiles?.organization && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span>{posting.profiles.organization}</span>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {posting.description && (
                    <p className="text-muted-foreground line-clamp-3">
                      {posting.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {posting.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{posting.location}</span>
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

                  {posting.requirements && (
                    <div>
                      <h4 className="font-medium font-armenian mb-1">Պահանջներ:</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {posting.requirements}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button className="font-armenian flex-1">
                      Դիտել մանրամասն
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;