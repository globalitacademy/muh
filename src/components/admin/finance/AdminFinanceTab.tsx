
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
  Filter
} from 'lucide-react';

const AdminFinanceTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for financial management
  const financialStats = {
    totalRevenue: 2450000,
    monthlyRevenue: 185000,
    pendingPayments: 45000,
    totalStudents: 1250,
    averageRevenue: 1960
  };

  const recentTransactions = [
    {
      id: '1',
      student: 'Արմեն Ավագյան',
      amount: 25000,
      course: 'JavaScript Հիմունքներ',
      date: '2024-01-15',
      status: 'completed',
      paymentMethod: 'card'
    },
    {
      id: '2',
      student: 'Նարե Պողոսյան',
      amount: 35000,
      course: 'React Development',
      date: '2024-01-14',
      status: 'pending',
      paymentMethod: 'bank'
    },
    {
      id: '3',
      student: 'Դավիթ Մարտիրոսյան',
      amount: 40000,
      course: 'Full Stack Development',
      date: '2024-01-13',
      status: 'completed',
      paymentMethod: 'card'
    }
  ];

  const pricing = [
    {
      id: '1',
      course: 'JavaScript Հիմունքներ',
      price: 25000,
      discount: 10,
      category: 'Ծրագրավորում',
      duration: '8 շաբաթ'
    },
    {
      id: '2',
      course: 'React Development',
      price: 35000,
      discount: 15,
      category: 'Frontend',
      duration: '12 շաբաթ'
    },
    {
      id: '3',
      course: 'Full Stack Development',
      price: 40000,
      discount: 20,
      category: 'Ծրագրավորում',
      duration: '16 շաբաթ'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-armenian">Ֆինանսական կառավարում</h3>
          <p className="text-muted-foreground font-armenian">Կառավարեք վճարումները և սակագները</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-armenian">
            <Download className="w-4 h-4 mr-2" />
            Էքսպորտ
          </Button>
          <Button className="font-armenian btn-modern">
            <Plus className="w-4 h-4 mr-2" />
            Նոր վճարում
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ընդհանուր եկամուտ</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialStats.totalRevenue.toLocaleString('hy-AM')} ֏
            </div>
            <p className="text-xs text-muted-foreground font-armenian">Ընդհանուր գումար</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ամսական եկամուտ</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialStats.monthlyRevenue.toLocaleString('hy-AM')} ֏
            </div>
            <p className="text-xs text-muted-foreground font-armenian">Այս ամիս</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Սպասվող վճարումներ</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-yellow">
              {financialStats.pendingPayments.toLocaleString('hy-AM')} ֏
            </div>
            <p className="text-xs text-muted-foreground font-armenian">Չվճարված</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ուսանողների քանակ</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground font-armenian">Վճարող ուսանողներ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Միջին եկամուտ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialStats.averageRevenue.toLocaleString('hy-AM')} ֏
            </div>
            <p className="text-xs text-muted-foreground font-armenian">Մեկ ուսանողից</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions" className="font-armenian">Գործարքներ</TabsTrigger>
          <TabsTrigger value="pricing" className="font-armenian">Սակագներ</TabsTrigger>
          <TabsTrigger value="reports" className="font-armenian">Հաշվետվություններ</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Որոնել գործարք..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="font-armenian">
              <Filter className="w-4 h-4 mr-2" />
              Ֆիլտր
            </Button>
          </div>

          {/* Transactions Table */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Վերջին գործարքները</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{transaction.student}</p>
                        <p className="text-sm text-muted-foreground">{transaction.course}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{transaction.amount.toLocaleString('hy-AM')} ֏</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={transaction.status === 'completed' ? 'bg-success-green' : 'bg-warning-yellow'}>
                        {transaction.status === 'completed' ? 'Ավարտված' : 'Սպասում'}
                      </Badge>
                      <Badge variant="outline">
                        {transaction.paymentMethod === 'card' ? 'Քարտ' : 'Բանկ'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Դասընթացների գներ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pricing.map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{course.course}</h4>
                        <p className="text-sm text-muted-foreground">{course.category} • {course.duration}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Խմբագրել
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{course.price.toLocaleString('hy-AM')} ֏</span>
                        {course.discount > 0 && (
                          <Badge className="bg-edu-orange">{course.discount}% զեղչ</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Ֆինանսական հաշվետվություններ</CardTitle>
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
    </div>
  );
};

export default AdminFinanceTab;
