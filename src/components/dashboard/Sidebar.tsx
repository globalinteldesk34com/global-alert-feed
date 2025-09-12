import { User, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { regions, severityLevels, timeRanges } from '@/data/sampleEvents';

interface SidebarProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedSeverities: string[];
  onSeverityChange: (severities: string[]) => void;
  selectedTimeRange: string;
  onTimeRangeChange: (timeRange: string) => void;
  eventCounts: Record<string, number>;
}

export const Sidebar = ({
  selectedRegion,
  onRegionChange,
  selectedSeverities,
  onSeverityChange,
  selectedTimeRange,
  onTimeRangeChange,
  eventCounts
}: SidebarProps) => {
  const handleSeverityToggle = (severity: string) => {
    if (selectedSeverities.includes(severity)) {
      onSeverityChange(selectedSeverities.filter(s => s !== severity));
    } else {
      onSeverityChange([...selectedSeverities, severity]);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-critical text-white';
      case 'high': return 'bg-high text-white';
      case 'medium': return 'bg-medium text-black';
      case 'low': return 'bg-low text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <aside className="w-80 bg-dashboard-sidebar border-r border-border flex flex-col">
      {/* GeoPulse Branding */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse-glow" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">GeoPulse</h2>
            <p className="text-xs text-muted-foreground">OSINT Geopolitical Dashboard</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>

        {/* Region Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Region</label>
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Severity Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Severity</label>
          <div className="space-y-2">
            {severityLevels.map(severity => (
              <div key={severity} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedSeverities.includes(severity)}
                    onCheckedChange={() => handleSeverityToggle(severity)}
                  />
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`} />
                    <span className="text-sm capitalize text-foreground">{severity}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {eventCounts[severity] || 0}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Time Range</label>
          <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="pt-4 border-t border-border space-y-2">
          <h4 className="text-sm font-medium text-foreground">Summary</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-muted rounded">
              <div className="text-lg font-bold text-critical">{eventCounts.critical || 0}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className="text-lg font-bold text-high">{eventCounts.high || 0}</div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className="text-lg font-bold text-medium">{eventCounts.medium || 0}</div>
              <div className="text-xs text-muted-foreground">Medium</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className="text-lg font-bold text-low">{eventCounts.low || 0}</div>
              <div className="text-xs text-muted-foreground">Low</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-foreground">Analyst</div>
            <div className="text-xs text-muted-foreground">Geopolitical Team</div>
          </div>
        </div>
      </div>
    </aside>
  );
};