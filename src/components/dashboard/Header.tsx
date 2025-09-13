import { Search, RefreshCw, Settings, Plus, BarChart3, Brain, Shield, Satellite, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

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
    <header className="h-18 bg-[hsl(var(--header))] border-b border-border flex items-center justify-between px-6 z-10 glass-card">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg ai-indicator">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Global Intelligence Desk</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Geopolitical Analysis Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-[hsl(var(--muted))] neural-border">
            <div className="w-2 h-2 bg-[hsl(var(--low))] rounded-full animate-pulse-glow" />
            <span className="text-xs font-medium">NEURAL SYSTEMS ONLINE</span>
          </div>
          
          <Badge className="threat-level-critical px-3 py-1 animate-neural-pulse">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span className="text-xs font-semibold">{criticalCount} CRITICAL THREATS</span>
          </Badge>

          <Badge className="ai-indicator px-3 py-1">
            <Brain className="h-3 w-3 mr-1 animate-ai-thinking" />
            <span className="text-xs font-semibold">AI ACTIVE</span>
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threats, regions, intelligence..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-80 pl-10 bg-[hsl(var(--input))] border-[hsl(var(--border))] neural-border"
          />
        </div>

        <div className="flex items-center space-x-2 p-2 rounded-lg bg-[hsl(var(--muted))]">
          <Satellite className="h-4 w-4 text-[hsl(var(--intelligence))]" />
          <div className="text-sm">
            <div className="font-medium">{totalEvents}</div>
            <div className="text-xs text-muted-foreground">Intel Sources</div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center space-x-2 neural-border"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Sync Intel</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Zap className="h-4 w-4" />
          <span>Auto Analysis</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="neural-border"
        >
          <Settings className="h-4 w-4" />
        </Button>

        <Button
          className="flex items-center space-x-2 ai-indicator"
          size="sm"
        >
          <Brain className="h-4 w-4" />
          <span>Generate Intel Report</span>
        </Button>
      </div>

      <div className="flex flex-col items-end text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-[hsl(var(--low))] rounded-full animate-pulse-glow" />
          <span className="font-mono">{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="font-mono">{new Date().toLocaleDateString()}</div>
        <div className="text-[hsl(var(--intelligence))] font-medium">CLASSIFICATION: SECRET</div>
      </div>
    </header>
  );
};