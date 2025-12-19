import { AlertTriangle, MapPin, Shield, X } from 'lucide-react';
import { SuspiciousAttempt } from '@/types/identity';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SuspiciousMapProps {
  attempts: SuspiciousAttempt[];
}

export function SuspiciousMap({ attempts }: SuspiciousMapProps) {
  const [selectedAttempt, setSelectedAttempt] = useState<SuspiciousAttempt | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // User location (Malaysia - Kuala Lumpur)
  const userLocation = { lat: 3.1390, lng: 101.6869 };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on user location
    const map = L.map(mapRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 2,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles with dark style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create custom icons
    const threatIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="relative">
        <span class="absolute inset-0 w-6 h-6 -m-1 rounded-full bg-red-500/30 animate-ping"></span>
        <div class="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50 flex items-center justify-center border-2 border-white">
          <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
        </div>
      </div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const blockedIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50 flex items-center justify-center border-2 border-white">
        <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
      </div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const userIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-6 h-6 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 flex items-center justify-center border-2 border-white">
        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Add user location marker
    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<div class="text-center font-semibold text-emerald-600">Your Location<br/><span class="text-gray-600 font-normal">Malaysia</span></div>');
    markersRef.current.push(userMarker);

    // Add attempt markers
    attempts.forEach((attempt) => {
      const icon = attempt.blocked ? blockedIcon : threatIcon;
      const marker = L.marker([attempt.coordinates.lat, attempt.coordinates.lng], { icon })
        .addTo(map)
        .on('click', () => setSelectedAttempt(attempt));
      
      marker.bindPopup(`
        <div class="min-w-[150px]">
          <div class="font-semibold ${attempt.blocked ? 'text-yellow-600' : 'text-red-600'}">${attempt.platform}</div>
          <div class="text-sm text-gray-600">${attempt.city}, ${attempt.country}</div>
          <div class="text-xs text-gray-500 mt-1">${attempt.blocked ? 'Blocked' : 'Active Threat'}</div>
        </div>
      `);
      
      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (attempts.length > 0) {
      const allPoints: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        ...attempts.map(a => [a.coordinates.lat, a.coordinates.lng] as [number, number])
      ];
      map.fitBounds(allPoints, { padding: [50, 50] });
    }
  }, [attempts]);

  return (
    <div className="glass-elevated rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold">Suspicious Activity Map</h3>
            <p className="text-xs text-muted-foreground">{attempts.length} suspicious attempts detected</p>
          </div>
        </div>
        <Badge variant={attempts.some(a => !a.blocked) ? "destructive" : "success"}>
          {attempts.filter(a => a.blocked).length} Blocked
        </Badge>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border/50">
        <div ref={mapRef} className="w-full h-full z-0" />
        
        {/* Legend */}
        <div className="absolute bottom-2 left-2 z-[1000] flex gap-3 text-[10px] bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Active Threat</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Blocked</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Your Location</span>
          </div>
        </div>
      </div>

      {/* Selected Attempt Details */}
      {selectedAttempt && (
        <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 relative">
          <button
            onClick={() => setSelectedAttempt(null)}
            className="absolute top-2 right-2 p-1 hover:bg-destructive/20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{selectedAttempt.platform}</h4>
                <Badge variant={selectedAttempt.blocked ? "warning" : "destructive"}>
                  {selectedAttempt.blocked ? 'Blocked' : 'Active Threat'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedAttempt.attemptType.charAt(0).toUpperCase() + selectedAttempt.attemptType.slice(1)} attempt from{' '}
                <span className="font-medium text-foreground">{selectedAttempt.city}, {selectedAttempt.country}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-muted-foreground">IP Address:</span>
                  <p className="font-mono">{selectedAttempt.ipAddress}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <p>{format(selectedAttempt.timestamp, 'PPp')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Risk Score:</span>
                  <p className={selectedAttempt.riskScore > 70 ? 'text-destructive font-bold' : 'text-warning'}>
                    {selectedAttempt.riskScore}/100
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className={selectedAttempt.blocked ? 'text-success' : 'text-destructive'}>
                    {selectedAttempt.blocked ? 'Successfully Blocked' : 'Requires Attention'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
