
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Receipt, 
  FileText, 
  Plus,
  Search,
  Download,
  Filter,
  Settings,
  Loader2
} from 'lucide-react';
import { 
  useFinancialStats, 
  useFinancialTransactions, 
  useCoursePricing,
  usePaymentSettings,
  useUpdatePaymentSettings
} from '@/hooks/useFinancialData';
import IdramSettingsDialog from './IdramSettingsDialog';

const AdminFinanceTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useFinancialStats();
  const { data: transactions, isLoading: transactionsLoading } = useFinancialTransactions();
  const { data: pricing, isLoading: pricingLoading } = useCoursePricing();
  const { data: paymentSettings } = usePaymentSettings();

  const filteredTransactions = transactions?.filter(transaction =>
    transaction.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      case 'refunded':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ավարտված';
      case 'pending':
        return 'Սպասում';
      case 'failed':
        return 'Չհաջողված';
      case 'refunded':
        return 'Վերադարձված';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'idram':
        return 'Idram';
      case 'card':
        return 'Քարտ';
      case 'bank_transfer':
        return 'Բանկային փոխանցում';
      case 'cash':
        return 'Կանխիկ';
      default:
        return method;
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 md:p-6 animate-fade-in-up">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-armenian text-gradient">Ֆինանսական կառավարում</h2>
              <p className="text-sm md:text-base text-muted-foreground font-armenian">Կառավարեք վճարումները և սակագները</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Button 
              variant="outline" 
              className="font-armenian text-sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Idram կարգավորումներ
            </Button>
            <Button variant="outline" className="font-armenian text-sm">
              <Download className="w-4 h-4 mr-2" />
              Էքսպորտ
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ընդհանուր եկամուտ</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {stats?.totalRevenue?.toLocaleString('hy-AM') || 0} ֏
            </div>
            <p className="text-xs text-muted-foreground font-armenian">Ընդհանուր գումար</p>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ամսական եկամուտ</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {stats?.monthlyRevenue?.toLocaleString('hy-AM') || 0} ֏
            </div>
            <p className="text-xs text-muted-foreground font-armenian">Այս ամիս</p>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Սպասվող վճարումներ</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-warning-yellow">
              {stats?.pendingPayments?.toLocaleString('hy-AM') || 0} ֏
            </div>
            <p className="text-xs text-muted-foreground font-armenian">Չվճարված</p>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ուսանողների քանակ</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground font-armenian">Վճարող ուսանողներ</p>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Միջին եկամուտ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {Math.round(stats?.averageRevenue || 0).toLocaleString('hy-AM')} ֏
            </div>
            <p className="text-xs text-muted-foreground font-armenian">Մեկ ուսանողից</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4 md:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl min-w-max lg:min-w-0">
            <TabsTrigger value="transactions" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all text-sm whitespace-nowrap">
              Գործարքներ
            </TabsTrigger>
            <TabsTrigger value="pricing" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all text-sm whitespace-nowrap">
              Սակագներ
            </TabsTrigger>
            <TabsTrigger value="reports" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all text-sm whitespace-nowrap">
              Հաշվետվություններ
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="transactions" className="space-y-4 md:space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Որոնել գործարք..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="font-armenian text-sm w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Ֆիլտր
            </Button>
          </div>

          {/* Transactions List */}
          <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="font-armenian text-lg md:text-xl">Գործարքների պատմություն</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground font-armenian">Գործարքներ չեն գտնվել</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <p className="font-semibold truncate">{transaction.user_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.transaction_date).toLocaleDateString('hy-AM')}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 break-words">
                            {transaction.course_title || transaction.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`${getStatusColor(transaction.payment_status)} text-white text-xs`}>
                              {getStatusText(transaction.payment_status)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getPaymentMethodText(transaction.payment_method)}
                            </Badge>
                            {transaction.idram_transaction_id && (
                              <Badge variant="secondary" className="text-xs">
                                ID: {transaction.idram_transaction_id}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg md:text-xl font-bold">
                          {transaction.amount.toLocaleString('hy-AM')} {transaction.currency}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {transaction.transaction_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 md:space-y-6">
          <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="font-armenian text-lg md:text-xl">Դասընթացների գներ</CardTitle>
            </CardHeader>
            <CardContent>
              {pricingLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pricing && pricing.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground font-armenian">Գնային քաղաքականություն սահմանված չէ</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pricing?.map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{course.course_title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Ակտիվ մինչև: {course.valid_until ? 
                              new Date(course.valid_until).toLocaleDateString('hy-AM') : 
                              'Ժամկետ չկա'
                            }
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-2 flex-shrink-0">
                          Խմբագրել
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {course.discount_percentage > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              {course.base_price.toLocaleString('hy-AM')} ֏
                            </span>
                          )}
                          <span className="text-lg font-bold">
                            {course.final_price.toLocaleString('hy-AM')} ֏
                          </span>
                          {course.discount_percentage > 0 && (
                            <Badge className="bg-edu-orange text-white text-xs">
                              {course.discount_percentage}% զեղչ
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 md:space-y-6">
          <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="font-armenian text-lg md:text-xl">Ֆինանսական հաշվետվություններ</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold font-armenian mb-2">Հաշվետվությունների գեներացիա</h3>
              <p className="text-muted-foreground font-armenian mb-4">
                Ստեղծեք մանրամասն ֆինանսական հաշվետվություններ
              </p>
              <Button className="font-armenian btn-modern">
                <Plus className="w-4 h-4 mr-2" />
                Գեներացնել հաշվետվություն
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Idram Settings Dialog */}
      <IdramSettingsDialog 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={paymentSettings}
      />
    </div>
  );
};

export default AdminFinanceTab;
