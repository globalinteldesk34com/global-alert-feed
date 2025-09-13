import { Brain, Filter, Globe, Clock, AlertTriangle, Target, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { regions, severityLevels, timeRanges } from '@/data/sampleEvents';
import { AIInsights } from './AIInsights';

interface SidebarProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedSeverities: string[];
  onSeverityChange: (severities: string[]) => void;
  selectedTimeRange: string;
  onTimeRangeChange: (timeRange: string) => void;
  eventCounts: Record<string, number>;
  events?: any[];
}

export const Sidebar = ({
  selectedRegion,
  onRegionChange,
  selectedSeverities,
  onSeverityChange,
  selectedTimeRange,
  onTimeRangeChange,
  eventCounts,
  events = []
}: SidebarProps) => {
  return (
    <div className="w-80 h-full bg-[hsl(var(--sidebar))] border-r border-border p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Intelligence Control Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg ai-indicator">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Intelligence Control</h2>
            <p className="text-xs text-muted-foreground">AI-Enhanced Filtering</p>
          </div>
        </div>

        {/* AI Quick Actions */}
        <Card className="glass-card neural-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Target className="h-4 w-4 text-[hsl(var(--ai-primary))]" />
              <span>AI Operations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" className="w-full ai-indicator text-xs">
              <Brain className="h-3 w-3 mr-2" />
              Auto-Classify Threats
            </Button>
            <Button size="sm" variant="outline" className="w-full text-xs">
              <Shield className="h-3 w-3 mr-2" />
              Generate Risk Matrix
            </Button>
          </CardContent>
        </Card>

        {/* Region Filter */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Globe className="h-4 w-4 text-[hsl(var(--intelligence))]" />
              <span>Geographic Intelligence</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedRegion} onValueChange={onRegionChange}>
              <SelectTrigger className="neural-border">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Threat Classification */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-[hsl(var(--high))]" />
              <span>Threat Classification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {severityLevels.map((severity) => (
              <div key={severity} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={severity}
                    checked={selectedSeverities.includes(severity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onSeverityChange([...selectedSeverities, severity]);
                      } else {
                        onSeverityChange(selectedSeverities.filter(s => s !== severity));
                      }
                    }}
                  />
                  <label
                    htmlFor={severity}
                    className="text-sm font-medium capitalize cursor-pointer"
                  >
                    {severity.toUpperCase()}
                  </label>
                </div>
                <Badge 
                  className={`text-xs ${
                    severity === 'critical' ? 'status-critical' :
                    severity === 'high' ? 'status-high' :
                    severity === 'medium' ? 'status-medium' :
                    'status-low'
                  }`}
                >
                  {eventCounts[severity] || 0}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Temporal Analysis */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Clock className="h-4 w-4 text-[hsl(var(--ai-accent))]" />
              <span>Temporal Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="neural-border">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* AI Insights Component */}
        <div className="pt-2">
          <AIInsights events={events} />
        </div>
      </div>
    </div>
  );
};