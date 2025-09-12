import { Search, RefreshCw, Settings, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  criticalCount: number;
  totalEvents: number;
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header = ({ 
  criticalCount, 
  totalEvents, 
  onRefresh, 
  searchQuery, 
  onSearchChange 
}: HeaderProps) => {
  return (
    <header className="h-16 bg-dashboard-header border-b border-border flex items-center justify-between px-6 z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">OSINT Geopolitical Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
          
          <Badge variant="destructive" className="px-2 py-1">
            <span className="text-xs font-semibold">{criticalCount} Critical</span>
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-80 pl-10 bg-muted border-border"
          />
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{totalEvents}</span>
          <span>Events</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span>n8n Automation</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
        >
          <Settings className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="sm"
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span>Create Analysis Report</span>
        </Button>
      </div>

      <div className="flex flex-col items-end text-xs text-muted-foreground">
        <div>{new Date().toLocaleTimeString()}</div>
        <div>{new Date().toLocaleDateString()}</div>
      </div>
    </header>
  );
};