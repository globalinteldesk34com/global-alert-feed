import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeopoliticalEvent } from '@/data/sampleEvents';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  events: GeopoliticalEvent[];
  onEventSelect: (event: GeopoliticalEvent) => void;
  selectedEvent?: GeopoliticalEvent;
}

export const InteractiveMap = ({ events, onEventSelect, selectedEvent }: InteractiveMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup>(new L.LayerGroup());

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'; // red
      case 'high': return '#ea580c'; // orange
      case 'medium': return '#ca8a04'; // yellow
      case 'low': return '#16a34a'; // green
      default: return '#6b7280'; // gray
    }
  };

  const createCustomIcon = (severity: string, isSelected: boolean = false) => {
    const color = getMarkerColor(severity);
    const size = isSelected ? 20 : 12;
    const pulse = severity === 'critical' ? 'animate-pulse' : '';
    
    return L.divIcon({
      className: `custom-marker ${pulse}`,
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ${isSelected ? 'box-shadow: 0 0 20px ' + color + '80;' : ''}
        "></div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [30, 15],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      worldCopyJump: true,
      zoomControl: true,
    });

    // Add tile layer with dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapRef.current);

    // Add markers layer
    markersRef.current.addTo(mapRef.current);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    // Add new markers
    events.forEach((event) => {
      const isSelected = selectedEvent?.id === event.id;
      const icon = createCustomIcon(event.severity, isSelected);
      
      const marker = L.marker(event.coordinates, { icon })
        .on('click', () => onEventSelect(event));

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="
              background-color: ${getMarkerColor(event.severity)};
              color: white;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
            ">${event.severity}</span>
            <span style="font-size: 11px; color: #666;">
              ${new Date(event.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
            ${event.title}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #555; line-height: 1.4;">
            ${event.description.substring(0, 120)}${event.description.length > 120 ? '...' : ''}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span style="font-size: 11px; color: #666;">
              📍 ${event.country}
            </span>
            <span style="font-size: 11px; color: #0066cc; font-weight: bold;">
              ${event.source}
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      markersRef.current.addLayer(marker);
    });
  }, [events, selectedEvent, onEventSelect]);

  // Auto-fit bounds when events change
  useEffect(() => {
    if (!mapRef.current || events.length === 0) return;

    const group = new L.FeatureGroup(Object.values(markersRef.current.getLayers()));
    if (group.getLayers().length > 0) {
      mapRef.current.fitBounds(group.getBounds(), { 
        padding: [20, 20],
        maxZoom: 5 
      });
    }
  }, [events]);

  return (
    <div className="flex-1 relative bg-map-bg">
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 space-y-2 z-[1000]">
        <h4 className="text-sm font-semibold text-foreground mb-2">Severity Levels</h4>
        {[
          { level: 'critical', color: '#dc2626', count: events.filter(e => e.severity === 'critical').length },
          { level: 'high', color: '#ea580c', count: events.filter(e => e.severity === 'high').length },
          { level: 'medium', color: '#ca8a04', count: events.filter(e => e.severity === 'medium').length },
          { level: 'low', color: '#16a34a', count: events.filter(e => e.severity === 'low').length },
        ].map(({ level, color, count }) => (
          <div key={level} className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full border border-white" 
              style={{ backgroundColor: color }}
            />
            <span className="capitalize text-foreground">{level}</span>
            <span className="text-muted-foreground">({count})</span>
          </div>
        ))}
      </div>

      {/* Map Controls Info */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 z-[1000]">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>🗺️ <span className="text-foreground">Click markers for details</span></div>
          <div>🔍 <span className="text-foreground">Zoom in/out with mouse wheel</span></div>
          <div>🌍 <span className="text-foreground">Drag to pan the map</span></div>
        </div>
      </div>
    </div>
  );
};