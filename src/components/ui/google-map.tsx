
import React from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ className }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3047.5!2d44.5127!3d40.1792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abd1c8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sMamikonyanc%2052%2C%20Yerevan%2C%20Armenia!5e0!3m2!1sen!2sam!4v1733660000000!5m2!1sen!2sam"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Informatics College - Mamikonyanc 52, Yerevan"
        className="absolute inset-0 rounded-2xl"
      />
      
      {/* Overlay with location info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-edu-blue rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-foreground leading-tight">Informatics College</h3>
            <p className="text-sm font-medium text-foreground/80 mb-1">Limitless Learning</p>
            <p className="text-xs text-muted-foreground leading-tight">Մամիկոնյանց 52, Երևան</p>
          </div>
        </div>
      </div>

      {/* Additional location marker overlay */}
      <div className="absolute bottom-4 right-4 bg-edu-blue/90 backdrop-blur-sm rounded-lg px-3 py-2 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-xs font-medium">Informatics College</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;
