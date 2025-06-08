
import React from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ className }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3047.7234567890123!2d44.512345678901234!3d40.17890123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abcdefghijklm%3A0x1234567890abcdef!2sMamikonyanc%2052%2C%20Yerevan%2C%20Armenia!5e0!3m2!1sen!2sam!4v1234567890123!5m2!1sen!2sam"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Limitless Learning - Mamikonyanc 52, Yerevan"
        className="absolute inset-0 rounded-2xl"
      />
      
      {/* Overlay with location info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-edu-blue to-purple-500 rounded-lg flex items-center justify-center text-white">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Limitless Learning</h3>
            <p className="text-xs text-muted-foreground">Մամիկոնյանց 52, Երևան</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;
