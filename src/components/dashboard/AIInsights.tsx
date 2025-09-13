import { Brain, TrendingUp, AlertTriangle, Target, Zap, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GeopoliticalEvent } from '@/data/sampleEvents';

interface AIInsightsProps {
  events: GeopoliticalEvent[];
}

export const AIInsights = ({ events }: AIInsightsProps) => {
  // AI-generated insights and predictions
  const insights = [
    {
      type: 'pattern',
      confidence: 94,
      title: 'Military Mobilization Pattern',
      description: 'AI detected coordinated military movements across 3 regions within 48h timeframe',
      severity: 'high',
      action: 'Enhanced surveillance recommended'
    },
    {
      type: 'prediction',
      confidence: 87,
      title: 'Diplomatic Tension Escalation',
      description: 'Machine learning models predict 73% probability of diplomatic escalation within 7 days',
      severity: 'medium',
      action: 'Monitor diplomatic channels'
    },
    {
      type: 'anomaly',
      confidence: 91,
      title: 'Communication Pattern Anomaly',
      description: 'Unusual communication frequencies detected in Eastern European networks',
      severity: 'critical',
      action: 'Immediate investigation required'
    }
  ];

  const aiMetrics = {
    accuracy: 89 + Math.floor(Math.random() * 6),
    processing: events.length * 1.2,
    predictions: 15,
    patterns: 7
  };

  return (
    <div className="space-y-4">
      {/* AI Status Header */}
      <Card className="glass-card neural-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[hsl(var(--ai-primary))] animate-ai-thinking" />
            AI Intelligence Engine
            <Badge className="ai-indicator text-xs">NEURAL ACTIVE</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-[hsl(var(--ai-primary))]">{aiMetrics.accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[hsl(var(--intelligence))]">{aiMetrics.processing}</div>
              <div className="text-xs text-muted-foreground">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[hsl(var(--ai-accent))]">{aiMetrics.predictions}</div>
              <div className="text-xs text-muted-foreground">Predictions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[hsl(var(--low))]">{aiMetrics.patterns}</div>
              <div className="text-xs text-muted-foreground">Patterns</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <Card key={index} className="glass-card border-l-4 border-l-[hsl(var(--ai-primary))]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {insight.type === 'pattern' && <Target className="h-4 w-4 text-[hsl(var(--ai-primary))]" />}
                  {insight.type === 'prediction' && <TrendingUp className="h-4 w-4 text-[hsl(var(--intelligence))]" />}
                  {insight.type === 'anomaly' && <AlertTriangle className="h-4 w-4 text-[hsl(var(--high))]" />}
                  {insight.title}
                </CardTitle>
                <Badge 
                  className={
                    insight.severity === 'critical' ? 'status-critical' :
                    insight.severity === 'high' ? 'status-high' :
                    'status-medium'
                  }
                >
                  {insight.severity.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">AI Confidence:</span>
                  <Progress value={insight.confidence} className="w-20 h-1" />
                  <span className="text-xs text-[hsl(var(--ai-primary))]">{insight.confidence}%</span>
                </div>
              </div>
              
              <div className="p-2 rounded-md bg-[hsl(var(--muted))] border border-[hsl(var(--ai-primary)/0.2)]">
                <div className="text-xs font-medium text-[hsl(var(--ai-primary))]">Recommended Action:</div>
                <div className="text-xs text-muted-foreground">{insight.action}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Actions */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[hsl(var(--ai-accent))] animate-neural-pulse" />
            AI-Powered Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button size="sm" className="w-full ai-indicator text-xs">
            <Zap className="h-3 w-3 mr-2" />
            Generate Threat Forecast
          </Button>
          <Button size="sm" className="w-full" variant="outline">
            <Brain className="h-3 w-3 mr-2" />
            Deep Pattern Analysis
          </Button>
          <Button size="sm" className="w-full" variant="outline">
            <Target className="h-3 w-3 mr-2" />
            Predictive Modeling
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};