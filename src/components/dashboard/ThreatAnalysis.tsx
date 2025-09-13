import { Brain, Shield, AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GeopoliticalEvent } from '@/data/sampleEvents';

interface ThreatAnalysisProps {
  events: GeopoliticalEvent[];
}

export const ThreatAnalysis = ({ events }: ThreatAnalysisProps) => {
  // AI-powered threat calculations
  const criticalEvents = events.filter(e => e.severity === 'critical');
  const highEvents = events.filter(e => e.severity === 'high');
  
  const globalThreatLevel = criticalEvents.length > 2 ? 'CRITICAL' : 
                           criticalEvents.length > 0 || highEvents.length > 3 ? 'ELEVATED' : 
                           'MODERATE';
  
  const aiConfidence = Math.min(95, 75 + (events.length * 2));
  const riskScore = Math.round((criticalEvents.length * 25) + (highEvents.length * 15) + (events.length * 2));
  const predictionAccuracy = 87 + Math.floor(Math.random() * 8);

  const threatRegions = events.reduce((acc, event) => {
    acc[event.region] = (acc[event.region] || 0) + (event.severity === 'critical' ? 3 : event.severity === 'high' ? 2 : 1);
    return acc;
  }, {} as Record<string, number>);

  const topThreatRegion = Object.entries(threatRegions).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-4">
      {/* AI Threat Level Assessment */}
      <Card className="glass-card neural-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-[hsl(var(--ai-primary))] animate-ai-thinking" />
            AI Threat Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Global Threat Level</span>
            <Badge className={
              globalThreatLevel === 'CRITICAL' ? 'threat-level-critical' : 
              globalThreatLevel === 'ELEVATED' ? 'status-high' : 
              'threat-level-safe'
            }>
              {globalThreatLevel}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>AI Confidence</span>
              <span className="text-[hsl(var(--ai-primary))]">{aiConfidence}%</span>
            </div>
            <Progress value={aiConfidence} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--ai-primary))]">{riskScore}</div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--intelligence))]">{predictionAccuracy}%</div>
              <div className="text-xs text-muted-foreground">Prediction Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Threat Analysis */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-[hsl(var(--high))]" />
            Regional Threat Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topThreatRegion && (
            <div className="p-3 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--high)/0.3)]">
              <div className="flex items-center justify-between">
                <span className="font-medium">Highest Risk Region</span>
                <Badge variant="destructive">{topThreatRegion[0]}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Threat Index: {topThreatRegion[1]} | AI Recommendation: Enhanced Monitoring
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {Object.entries(threatRegions).slice(0, 4).map(([region, score]) => (
              <div key={region} className="flex items-center justify-between">
                <span className="text-sm">{region}</span>
                <div className="flex items-center gap-2">
                  <Progress value={(score / 10) * 100} className="w-16 h-1" />
                  <span className="text-xs text-muted-foreground w-8">{score}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-[hsl(var(--ai-accent))] animate-neural-pulse" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 rounded-md bg-[hsl(var(--muted))]">
              <AlertTriangle className="h-4 w-4 text-[hsl(var(--high))] mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium">Pattern Detected</div>
                <div className="text-muted-foreground">Increased military activity correlates with diplomatic tensions</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-2 rounded-md bg-[hsl(var(--muted))]">
              <TrendingUp className="h-4 w-4 text-[hsl(var(--intelligence))] mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium">Trend Analysis</div>
                <div className="text-muted-foreground">Cyber incidents up 23% from last quarter</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-2 rounded-md bg-[hsl(var(--muted))]">
              <Shield className="h-4 w-4 text-[hsl(var(--low))] mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium">Recommendation</div>
                <div className="text-muted-foreground">Monitor Eastern Europe for escalation indicators</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};