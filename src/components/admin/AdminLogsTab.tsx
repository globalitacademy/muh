
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, Info, CheckCircle, XCircle, Filter, RefreshCw } from 'lucide-react';

const AdminLogsTab = () => {
  const [filter, setFilter] = useState('all');

  const logs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:22',
      level: 'info',
      message: 'Օգտատեր user@example.com-ը հաջողությամբ մուտք է գործել',
      source: 'Auth',
      details: 'IP: 192.168.1.100, Browser: Chrome 120.0'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:28:15',
      level: 'warning',
      message: 'Անհաջող մուտքի փորձ user@test.com հաշվով',
      source: 'Auth',
      details: 'IP: 192.168.1.50, Attempts: 3'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:25:10',
      level: 'error',
      message: 'Տվյալների բազայի կապի սխալ',
      source: 'Database',
      details: 'Connection timeout after 30s'
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:20:05',
      level: 'success',
      message: 'Նոր մոդուլ "React Basics" ստեղծվել է',
      source: 'Modules',
      details: 'Created by admin@example.com'
    },
    {
      id: 5,
      timestamp: '2024-01-15 14:15:30',
      level: 'info',
      message: 'Ստեղծվել է տվյալների բազայի պահուստային պատճեն',
      source: 'System',
      details: 'Size: 1.2GB, Duration: 45s'
    }
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogBadgeColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
    }
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.level === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-armenian text-gradient">Համակարգի մատյաններ</h2>
              <p className="text-muted-foreground font-armenian">Նայեք համակարգի գործունեության պատմությունը</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-armenian">
              <Filter className="w-4 h-4 mr-2" />
              Զտել
            </Button>
            <Button variant="outline" className="font-armenian">
              <RefreshCw className="w-4 h-4 mr-2" />
              Թարմացնել
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="font-armenian"
        >
          Բոլորը
        </Button>
        <Button
          variant={filter === 'info' ? 'default' : 'outline'}
          onClick={() => setFilter('info')}
          className="font-armenian"
        >
          Տեղեկություն
        </Button>
        <Button
          variant={filter === 'success' ? 'default' : 'outline'}
          onClick={() => setFilter('success')}
          className="font-armenian"
        >
          Հաջողություն
        </Button>
        <Button
          variant={filter === 'warning' ? 'default' : 'outline'}
          onClick={() => setFilter('warning')}
          className="font-armenian"
        >
          Նախազգուշացում
        </Button>
        <Button
          variant={filter === 'error' ? 'default' : 'outline'}
          onClick={() => setFilter('error')}
          className="font-armenian"
        >
          Սխալ
        </Button>
      </div>

      {/* Log Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm font-armenian text-muted-foreground">Տեղեկություններ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm font-armenian text-muted-foreground">Նախազգուշացումներ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm font-armenian text-muted-foreground">Սխալներ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">456</div>
                <div className="text-sm font-armenian text-muted-foreground">Հաջող գործողություններ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map((log, index) => (
          <Card key={log.id} className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 6)}s` }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-3">
                  {getLogIcon(log.level)}
                  <Badge className={`${getLogBadgeColor(log.level)} px-3 py-1 text-xs font-semibold`}>
                    {log.level.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{log.message}</h3>
                    <div className="text-sm text-muted-foreground font-mono">
                      {log.timestamp}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium font-armenian text-muted-foreground">Աղբյուր:</span>
                      <span className="ml-2 font-semibold">{log.source}</span>
                    </div>
                    <div>
                      <span className="font-medium font-armenian text-muted-foreground">Մանրամասներ:</span>
                      <span className="ml-2 text-muted-foreground">{log.details}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card className="modern-card animate-fade-in-up">
          <CardContent className="p-12 text-center">
            <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold font-armenian mb-2">Գրանցումներ չեն գտնվել</h3>
            <p className="text-muted-foreground font-armenian">
              Ընտրված զտիչի համար գրանցումներ չկան
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminLogsTab;
