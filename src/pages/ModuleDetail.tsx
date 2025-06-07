import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Users, Star, BookOpen, User, GraduationCap } from 'lucide-react';
import { useModule } from '@/hooks/useModules';
import { useTopics } from '@/hooks/useTopics';
import { useEnrollments, useEnrollModule } from '@/hooks/useEnrollments';
import { useAuth } from '@/hooks/useAuth';
import TopicCurriculum from '@/components/TopicCurriculum';
import CompanyCodeInput from '@/components/CompanyCodeInput';
import { Loader2 } from 'lucide-react';
import { getDifficultyColor, getDifficultyText } from '@/utils/moduleUtils';

const ModuleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: module, isLoading: moduleLoading } = useModule(id!);
  const { data: topics, isLoading: topicsLoading } = useTopics(id!);
  const { data: enrollments } = useEnrollments();
  const enrollModule = useEnrollModule();
  const [hasValidCompanyCode, setHasValidCompanyCode] = useState(false);

  const isEnrolled = enrollments?.some(e => e.module_id === id);
  const hasFullAccess = isEnrolled || hasValidCompanyCode;

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    await enrollModule.mutateAsync(id!);
  };

  const handleTopicClick = (topicId: string) => {
    navigate(`/topic/${topicId}`);
  };

  const handleCompanyCodeVerified = (isValid: boolean) => {
    setHasValidCompanyCode(isValid);
  };

  if (moduleLoading || topicsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-edu-blue" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-armenian">Դասընթացը չի գտնվել</h2>
          <Button onClick={() => navigate('/')} className="mt-4 font-armenian">
            Վերադառնալ գլխավոր էջ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Վերադառնալ գլխավոր էջ
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Module Header */}
            <div className="mb-8">
              {module.image_url && (
                <img
                  src={module.image_url}
                  alt={module.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}
              
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold font-armenian">{module.title}</h1>
                <Badge className={getDifficultyColor(module.difficulty_level)}>
                  {getDifficultyText(module.difficulty_level)}
                </Badge>
              </div>

              <p className="text-lg text-muted-foreground font-armenian mb-6">
                {module.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{module.duration_weeks}</div>
                    <div className="text-sm text-muted-foreground font-armenian">շաբաթ</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{topics?.length || 0}</div>
                    <div className="text-sm text-muted-foreground font-armenian">դաս</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{module.students_count}</div>
                    <div className="text-sm text-muted-foreground font-armenian">ուսանող</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning-yellow fill-current" />
                  <div>
                    <div className="font-semibold">{module.rating?.toFixed(1) || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground font-armenian">գնահատական</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-8">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-armenian">Մասնագետ: {module.instructor}</span>
              </div>
            </div>

            {/* Curriculum Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-armenian mb-6 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-edu-blue" />
                Դասընթացի ծրագիր
              </h2>
              
              {topics && topics.length > 0 ? (
                <TopicCurriculum
                  topics={topics}
                  isEnrolled={hasFullAccess}
                  onTopicClick={handleTopicClick}
                />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-armenian">
                      Դասերը շուտով կլինեն հասանելի
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center font-armenian">
                  Ծրագրային մանրամասներ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-edu-blue">
                    {module.price.toLocaleString()} ֏
                  </div>
                  <div className="text-sm text-muted-foreground font-armenian">
                    Ամբողջ դասընթացի համար
                  </div>
                </div>

                {user ? (
                  <div className="space-y-4">
                    {hasFullAccess ? (
                      <>
                        <div className="text-center">
                          <div className="text-sm font-armenian mb-2">Ձեր առաջընթացը</div>
                          <Progress value={0} className="mb-2" />
                          <div className="text-xs text-muted-foreground">0% ավարտված</div>
                        </div>
                        <Button className="w-full btn-modern font-armenian" onClick={() => {
                          const firstTopic = topics?.find(t => t.is_free) || topics?.[0];
                          if (firstTopic) {
                            handleTopicClick(firstTopic.id);
                          }
                        }}>
                          Շարունակել ուսումը
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={handleEnroll}
                          disabled={enrollModule.isPending}
                          className="w-full btn-modern font-armenian"
                        >
                          {enrollModule.isPending ? 'Գրանցվում է...' : 'Գրանցվել հիմա'}
                        </Button>
                        
                        {/* Company Code Input for authenticated users too */}
                        <CompanyCodeInput onCodeVerified={handleCompanyCodeVerified} />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hasValidCompanyCode ? (
                      <>
                        <div className="text-center">
                          <div className="text-sm font-armenian mb-2">Ունեք անվճար մուտք</div>
                          <Progress value={0} className="mb-2" />
                          <div className="text-xs text-muted-foreground">0% ավարտված</div>
                        </div>
                        <Button className="w-full btn-modern font-armenian" onClick={() => {
                          const firstTopic = topics?.find(t => t.is_free) || topics?.[0];
                          if (firstTopic) {
                            handleTopicClick(firstTopic.id);
                          }
                        }}>
                          Շարունակել ուսումը
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={() => navigate('/auth')}
                          className="w-full btn-modern font-armenian"
                        >
                          Գրանցվել դասընթացի համար
                        </Button>
                        
                        {/* Company Code Input */}
                        <CompanyCodeInput onCodeVerified={handleCompanyCodeVerified} />
                      </>
                    )}
                  </div>
                )}

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between font-armenian">
                    <span>Վկայագիր:</span>
                    <span>Այո</span>
                  </div>
                  <div className="flex justify-between font-armenian">
                    <span>Մուտք:</span>
                    <span>Մշտապես</span>
                  </div>
                  <div className="flex justify-between font-armenian">
                    <span>Լեզու:</span>
                    <span>Հայերեն</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
