import { useState, useMemo } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { InteractiveMap } from './InteractiveMap';
import { EventsList } from './EventsList';
import { sampleEvents, GeopoliticalEvent } from '@/data/sampleEvents';

export const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedSeverities, setSelectedSeverities] = useState(['critical', 'high', 'medium', 'low']);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 24 hours');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<GeopoliticalEvent>();

  // Filter events based on current selections
  const filteredEvents = useMemo(() => {
    let filtered = sampleEvents;

    // Filter by region
    if (selectedRegion !== 'All Regions') {
      filtered = filtered.filter(event => event.region === selectedRegion);
    }

    // Filter by severity
    filtered = filtered.filter(event => selectedSeverities.includes(event.severity));

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.country.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by time range (simplified for demo)
    const now = new Date();
    const cutoffTime = new Date();
    
    switch (selectedTimeRange) {
      case 'Last 24 hours':
        cutoffTime.setHours(now.getHours() - 24);
        break;
      case 'Last 7 days':
        cutoffTime.setDate(now.getDate() - 7);
        break;
      case 'Last 30 days':
        cutoffTime.setDate(now.getDate() - 30);
        break;
      default:
        cutoffTime.setFullYear(2000); // Show all
    }

    filtered = filtered.filter(event => new Date(event.timestamp) >= cutoffTime);

    return filtered;
  }, [selectedRegion, selectedSeverities, selectedTimeRange, searchQuery]);

  // Calculate event counts by severity
  const eventCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEvents.forEach(event => {
      counts[event.severity] = (counts[event.severity] || 0) + 1;
    });
    return counts;
  }, [filteredEvents]);

  const criticalCount = eventCounts.critical || 0;
  const totalEvents = filteredEvents.length;

  const handleRefresh = () => {
    // In a real app, this would refetch data from the API
    console.log('Refreshing events...');
  };

  const handleEventSelect = (event: GeopoliticalEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Header
        criticalCount={criticalCount}
        totalEvents={totalEvents}
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          selectedSeverities={selectedSeverities}
          onSeverityChange={setSelectedSeverities}
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={setSelectedTimeRange}
          eventCounts={eventCounts}
        />
        
        <InteractiveMap
          events={filteredEvents}
          onEventSelect={handleEventSelect}
          selectedEvent={selectedEvent}
        />
        
        <EventsList
          events={filteredEvents}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onEventSelect={handleEventSelect}
        />
      </div>
    </div>
  );
};