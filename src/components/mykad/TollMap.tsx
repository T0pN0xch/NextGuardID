import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TollTransaction } from '@/data/tollMockData';

interface TollMapProps {
  transactions: TollTransaction[];
  lostMode: boolean;
  onMarkerClick?: (transaction: TollTransaction) => void;
}

const createMarkerIcon = (riskLevel: string, lostMode: boolean, isNewSinceLost?: boolean) => {
  let color = '#22c55e'; // green

  if (lostMode && isNewSinceLost) {
    color = '#ef4444'; // red for new transactions in lost mode
  } else if (riskLevel === 'high') {
    color = '#ef4444'; // red
  } else if (riskLevel === 'medium') {
    color = '#f59e0b'; // amber
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 48px;
        height: 48px;
        background: ${color};
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 2px ${color}40;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 2px ${color}40; }
          50% { box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 6px ${color}20; }
        }
      </style>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

export function TollMap({ transactions, lostMode, onMarkerClick }: TollMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map centered on Malaysia
    mapRef.current = L.map(mapContainer.current, {
      center: [3.5, 101.5],
      zoom: 7,
      zoomControl: true,
    });

    // Add light tile layer with OpenStreetMap (more realistic)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when transactions or lostMode changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each transaction
    transactions.forEach((tx) => {
      const marker = L.marker([tx.coordinates.lat, tx.coordinates.lng], {
        icon: createMarkerIcon(tx.riskLevel, lostMode, tx.isNewSinceLost),
      });

      marker.bindPopup(`
        <div style="min-width: 200px; color: #1a1a2e;">
          <h3 style="font-weight: 600; margin-bottom: 8px; color: #1a1a2e;">${tx.tollPlaza}</h3>
          <p style="font-size: 12px; color: #666; margin: 4px 0;"><strong>Highway:</strong> ${tx.highway}</p>
          <p style="font-size: 12px; color: #666; margin: 4px 0;"><strong>State:</strong> ${tx.state}</p>
          <p style="font-size: 12px; color: #666; margin: 4px 0;"><strong>Time:</strong> ${tx.dateTime.toLocaleString()}</p>
          <p style="font-size: 12px; color: #666; margin: 4px 0;"><strong>Amount:</strong> RM ${tx.amount.toFixed(2)}</p>
          <span style="
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            margin-top: 8px;
            background: ${tx.riskLevel === 'high' ? '#fecaca' : tx.riskLevel === 'medium' ? '#fef3c7' : '#dcfce7'};
            color: ${tx.riskLevel === 'high' ? '#b91c1c' : tx.riskLevel === 'medium' ? '#b45309' : '#15803d'};
          ">
            ${tx.riskLevel.toUpperCase()} RISK
          </span>
        </div>
      `);

      marker.on('click', () => {
        if (onMarkerClick) onMarkerClick(tx);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (transactions.length > 0) {
      const bounds = L.latLngBounds(
        transactions.map(tx => [tx.coordinates.lat, tx.coordinates.lng])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [transactions, lostMode, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] rounded-xl overflow-hidden border border-border/50 bg-white"
    />
  );
}
