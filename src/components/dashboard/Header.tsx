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
    <header className="h-20 bg-[hsl(var(--header))] border-b border-border flex items-center justify-between px-8 z-10 glass-card professional-gradient">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg ai-indicator animate-enterprise-glow">
            <Shield className="h-7 w-7" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-enterprise-heading tracking-tight">Global Intelligence Desk</h1>
            <p className="text-sm text-intelligence font-medium">Professional OSINT Analysis Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-3 px-4 py-2 rounded-lg enterprise-card neural-border">
            <div className="w-2.5 h-2.5 bg-[hsl(var(--low))] rounded-full animate-pulse-glow" />
            <span className="text-sm font-semibold text-intelligence">NEURAL SYSTEMS ONLINE</span>
          </div>
          
          <Badge className="threat-level-critical px-4 py-2 animate-neural-pulse">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="text-sm font-bold">{criticalCount} CRITICAL THREATS</span>
          </Badge>

          <Badge className="ai-indicator px-4 py-2">
            <Brain className="h-4 w-4 mr-2 animate-ai-thinking" />
            <span className="text-sm font-bold">AI ACTIVE</span>
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-intelligence" />
          <Input
            placeholder="Search global threats, regions, intelligence sources..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-96 pl-12 h-11 bg-[hsl(var(--input))] border-[hsl(var(--border))] neural-border text-base font-medium"
          />
        </div>

        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg enterprise-card">
          <Satellite className="h-5 w-5 text-intelligence animate-pulse-glow" />
          <div className="text-sm">
            <div className="font-bold text-lg">{totalEvents}</div>
            <div className="text-xs text-intelligence font-medium">Intel Sources</div>
          </div>
        </div>

        <Button
          variant="outline"
          size="default"
          onClick={onRefresh}
          className="flex items-center space-x-2 neural-border h-11 px-5 font-semibold"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Sync Intel</span>
        </Button>

        <Button
          variant="outline"
          size="default"
          className="flex items-center space-x-2 h-11 px-5 font-semibold enterprise-card"
        >
          <Zap className="h-5 w-5" />
          <span>Auto Analysis</span>
        </Button>

        <Button
          variant="outline"
          size="default"
          className="neural-border h-11 px-4"
        >
          <Settings className="h-5 w-5" />
        </Button>

        <Button
          className="flex items-center space-x-2 ai-indicator h-11 px-6 font-bold"
          size="default"
        >
          <Brain className="h-5 w-5" />
          <span>Generate Intel Report</span>
        </Button>
      </div>

      <div className="flex flex-col items-end text-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-[hsl(var(--low))] rounded-full animate-pulse-glow" />
          <span className="font-mono font-semibold text-foreground">{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="font-mono font-medium text-muted-foreground mb-2">{new Date().toLocaleDateString()}</div>
        <div className="intel-classification px-3 py-1 rounded text-xs font-bold">CLASSIFICATION: SECRET</div>
      </div>
    </header>
  );
};