import { useState } from 'react';
import { Search, Clock, MapPin, ExternalLink, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GeopoliticalEvent } from '@/data/sampleEvents';

interface EventsListProps {
  events: GeopoliticalEvent[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEventSelect: (event: GeopoliticalEvent) => void;
}

export const EventsList = ({ 
  events, 
  searchQuery, 
  onSearchChange, 
  onEventSelect 
}: EventsListProps) => {
  const [sortBy, setSortBy] = useState<'time' | 'severity'>('time');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'status-critical';
      case 'high': return 'status-high';
      case 'medium': return 'status-medium';
      case 'low': return 'status-low';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now.getTime() - eventTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'time') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
  });

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Recent Events</h3>
          <div className="text-xs text-muted-foreground">
            {new Date().toLocaleTimeString()} {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted border-border"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant={sortBy === 'time' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('time')}
            className="flex items-center space-x-1"
          >
            <Clock className="h-3 w-3" />
            <span>Time</span>
          </Button>
          <Button
            variant={sortBy === 'severity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('severity')}
            className="flex items-center space-x-1"
          >
            <Filter className="h-3 w-3" />
            <span>Severity</span>
          </Button>
        </div>
      </div>

      {/* Events List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="p-3 bg-muted hover:bg-accent rounded-lg cursor-pointer transition-colors border border-border"
              onClick={() => onEventSelect(event)}
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-2">
                <Badge 
                  className={`${getSeverityColor(event.severity)} text-xs font-semibold uppercase`}
                >
                  {event.severity}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {getTimeAgo(event.timestamp)}
                </span>
              </div>

              {/* Event Title */}
              <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
                {event.title}
              </h4>

              {/* Event Description */}
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                {event.description}
              </p>

              {/* Event Meta */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{event.country}</span>
                </div>
                <div className="text-primary font-medium">
                  {event.source}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {event.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* View Source Link */}
              <div className="flex items-center justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Source
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};