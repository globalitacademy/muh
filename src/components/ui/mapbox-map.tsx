
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface MapboxMapProps {
  className?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Coordinates for Mamikonyanc 52, Yerevan, Armenia
  const yerevanCoords: [number, number] = [44.5152, 40.1792]; // Approximate coordinates for Mamikonyanc street area

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: yerevanCoords,
        zoom: 15,
        pitch: 0,
        bearing: 0
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add a marker for Mamikonyanc 52
      const marker = new mapboxgl.Marker({
        color: '#3b82f6',
        scale: 1.2
      })
        .setLngLat(yerevanCoords)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold;">Limitless Learning</h3>
                <p style="margin: 0; color: #666;">Մամիկոնյանց 52, Երևան</p>
              </div>
            `)
        )
        .addTo(map.current);

      setIsTokenValid(true);

      // Cleanup
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsTokenValid(false);
    }
  }, [mapboxToken]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.startsWith('pk.')) {
      // Token looks valid, try to initialize map
    } else {
      alert('Please enter a valid Mapbox token (should start with "pk.")');
    }
  };

  if (!isTokenValid && !mapboxToken) {
    return (
      <div className={`bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-edu-blue/10"></div>
        <div className="text-center z-10 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-edu-blue rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold font-armenian text-foreground mb-4">
            Mapbox Token անհրաժեշտ է
          </h3>
          <p className="text-muted-foreground font-armenian mb-6 text-sm">
            Քարտեզը ցուցադրելու համար անհրաժեշտ է Mapbox public token: 
            Գնացեք <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-edu-blue hover:underline">mapbox.com</a> և ստեղծեք account:
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <Label htmlFor="mapbox-token" className="font-armenian text-sm">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ..."
                className="mt-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-edu-blue hover:bg-edu-blue/90 text-white px-4 py-2 rounded-lg transition-all duration-300 font-armenian"
            >
              Ցուցադրել քարտեզը
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-2xl" />
      {!isTokenValid && (
        <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive font-armenian">Invalid Mapbox token</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
