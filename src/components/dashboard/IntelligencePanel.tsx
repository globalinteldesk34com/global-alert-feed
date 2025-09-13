import { useState } from 'react';
import { Eye, Globe, Clock, Users, Shield, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeopoliticalEvent } from '@/data/sampleEvents';
import { ThreatAnalysis } from './ThreatAnalysis';

interface IntelligencePanelProps {
  events: GeopoliticalEvent[];
}

export const IntelligencePanel = ({ events }: IntelligencePanelProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Intelligence metrics
  const activeThreats = events.filter(e => e.severity === 'critical' || e.severity === 'high').length;
  const totalSources = new Set(events.map(e => e.source)).size;
  const coverageRegions = new Set(events.map(e => e.region)).size;
  const lastUpdate = new Date().toLocaleTimeString();

  // Classification levels
  const classificationLevels = [
    { level: 'UNCLASSIFIED', count: Math.floor(events.length * 0.4) },
    { level: 'CONFIDENTIAL', count: Math.floor(events.length * 0.3) },
    { level: 'SECRET', count: Math.floor(events.length * 0.2) },
    { level: 'TOP SECRET', count: Math.floor(events.length * 0.1) }
  ];

  return (
    <div className="w-80 h-full bg-[hsl(var(--intel-panel))] border-l border-border flex flex-col">
      {/* Intelligence Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg ai-indicator">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Intelligence Desk</h2>
            <p className="text-xs text-muted-foreground">Global Monitoring System</p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-md bg-[hsl(var(--muted))]">
            <div className="w-2 h-2 bg-[hsl(var(--low))] rounded-full animate-pulse-glow" />
            <span className="text-xs">SYSTEMS ONLINE</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-[hsl(var(--muted))]">
            <Activity className="h-3 w-3 text-[hsl(var(--ai-primary))]" />
            <span className="text-xs">AI ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Intelligence Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-2">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="threats" className="text-xs">Threats</TabsTrigger>
          <TabsTrigger value="intel" className="text-xs">Intel</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="overview" className="mt-0 h-full overflow-y-auto p-4 space-y-4">
            {/* Key Metrics */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Global Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[hsl(var(--primary))]">{activeThreats}</div>
                    <div className="text-xs text-muted-foreground">Active Threats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[hsl(var(--intelligence))]">{coverageRegions}</div>
                    <div className="text-xs text-muted-foreground">Regions</div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-xs">
                    <span>Data Sources</span>
                    <span className="text-[hsl(var(--ai-primary))]">{totalSources}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Last Update</span>
                    <span className="text-[hsl(var(--low))]">{lastUpdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classification Breakdown */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[hsl(var(--classified))]" />
                  Classification Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {classificationLevels.map((item) => (
                  <div key={item.level} className="flex items-center justify-between">
                    <span className="text-xs">{item.level}</span>
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" className="w-full text-xs" variant="outline">
                  Generate Intel Report
                </Button>
                <Button size="sm" className="w-full text-xs" variant="outline">
                  Export Threat Matrix
                </Button>
                <Button size="sm" className="w-full text-xs ai-indicator">
                  AI Risk Analysis
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="mt-0 h-full overflow-y-auto p-4">
            <ThreatAnalysis events={events} />
          </TabsContent>

          <TabsContent value="intel" className="mt-0 h-full overflow-y-auto p-4 space-y-4">
            {/* Intelligence Sources */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-[hsl(var(--intelligence))]" />
                  Source Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['HUMINT', 'SIGINT', 'GEOINT', 'OSINT'].map((type) => (
                  <div key={type} className="flex items-center justify-between p-2 rounded-md bg-[hsl(var(--muted))]">
                    <span className="text-xs font-medium">{type}</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-[hsl(var(--low))]" />
                      <span className="text-xs text-[hsl(var(--low))]">ACTIVE</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Priority Alerts */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[hsl(var(--high))]" />
                  Priority Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 rounded-md bg-[hsl(var(--high)/0.1)] border border-[hsl(var(--high)/0.3)]">
                  <div className="text-xs font-medium text-[hsl(var(--high))]">FLASH PRIORITY</div>
                  <div className="text-xs text-muted-foreground">Critical infrastructure threat detected</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    2 minutes ago
                  </div>
                </div>
                
                <div className="p-2 rounded-md bg-[hsl(var(--medium)/0.1)] border border-[hsl(var(--medium)/0.3)]">
                  <div className="text-xs font-medium text-[hsl(var(--medium))]">ROUTINE</div>
                  <div className="text-xs text-muted-foreground">Diplomatic movements observed</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    15 minutes ago
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};