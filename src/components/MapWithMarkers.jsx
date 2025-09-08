/**
 * MapWithMarkers component for EchoMapper
 * Displays recordings on an interactive map with species markers
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
  MapPin, 
  Calendar, 
  Target, 
  Volume2, 
  Filter,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different species types
const createCustomIcon = (color = '#10B981', species = '') => {
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      font-weight: bold;
    ">
      ${species.charAt(0).toUpperCase()}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Species color mapping
const getSpeciesColor = (species) => {
  const colorMap = {
    'American Robin': '#EF4444',
    'Great Horned Owl': '#8B5CF6',
    'Gray Wolf': '#6B7280',
    'House Sparrow': '#F59E0B',
    'Blue Jay': '#3B82F6',
    'Cardinal': '#DC2626',
    'default': '#10B981'
  };
  
  return colorMap[species] || colorMap.default;
};

// Map controls component
const MapControls = ({ onZoomIn, onZoomOut, onToggleLayer, showHeatmap }) => (
  <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
    <button
      onClick={onZoomIn}
      className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg shadow-lg transition-colors"
      title="Zoom In"
    >
      <ZoomIn className="w-4 h-4" />
    </button>
    <button
      onClick={onZoomOut}
      className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg shadow-lg transition-colors"
      title="Zoom Out"
    >
      <ZoomOut className="w-4 h-4" />
    </button>
    <button
      onClick={onToggleLayer}
      className={`p-2 rounded-lg shadow-lg transition-colors ${
        showHeatmap 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
          : 'bg-slate-800 hover:bg-slate-700 text-white'
      }`}
      title="Toggle Heatmap"
    >
      <Layers className="w-4 h-4" />
    </button>
  </div>
);

// Map event handlers
const MapEventHandler = ({ onZoomIn, onZoomOut }) => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  useEffect(() => {
    onZoomIn.current = handleZoomIn;
    onZoomOut.current = handleZoomOut;
  }, [map, onZoomIn, onZoomOut]);

  return null;
};

const MapWithMarkers = ({ 
  recordings = [], 
  selectedSpecies = null,
  onRecordingSelect = () => {},
  variant = 'default',
  className = ''
}) => {
  const [filteredRecordings, setFilteredRecordings] = useState(recordings);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [mapZoom, setMapZoom] = useState(10);

  // Filter recordings based on selected species
  useEffect(() => {
    if (selectedSpecies && selectedSpecies !== 'all') {
      setFilteredRecordings(
        recordings.filter(recording => 
          recording.analysisResults?.species === selectedSpecies
        )
      );
    } else {
      setFilteredRecordings(recordings);
    }
  }, [recordings, selectedSpecies]);

  // Calculate map center based on recordings
  useEffect(() => {
    if (filteredRecordings.length > 0) {
      const validRecordings = filteredRecordings.filter(r => r.latitude && r.longitude);
      if (validRecordings.length > 0) {
        const avgLat = validRecordings.reduce((sum, r) => sum + r.latitude, 0) / validRecordings.length;
        const avgLng = validRecordings.reduce((sum, r) => sum + r.longitude, 0) / validRecordings.length;
        setMapCenter([avgLat, avgLng]);
      }
    }
  }, [filteredRecordings]);

  // Map control handlers
  const zoomInRef = React.useRef();
  const zoomOutRef = React.useRef();

  const handleZoomIn = () => {
    if (zoomInRef.current) zoomInRef.current();
  };

  const handleZoomOut = () => {
    if (zoomOutRef.current) zoomOutRef.current();
  };

  const handleToggleLayer = () => {
    setShowHeatmap(!showHeatmap);
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique species for legend
  const uniqueSpecies = [...new Set(
    filteredRecordings
      .map(r => r.analysisResults?.species)
      .filter(Boolean)
  )];

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div className="h-96 w-full rounded-lg overflow-hidden border border-slate-700">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapEventHandler 
            onZoomIn={zoomInRef} 
            onZoomOut={zoomOutRef} 
          />

          {/* Recording Markers */}
          {filteredRecordings.map((recording) => {
            if (!recording.latitude || !recording.longitude) return null;
            
            const species = recording.analysisResults?.species || 'Unknown';
            const color = getSpeciesColor(species);
            const icon = createCustomIcon(color, species);

            return (
              <Marker
                key={recording.id}
                position={[recording.latitude, recording.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => onRecordingSelect(recording)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <h3 className="font-semibold text-slate-900">
                        {species}
                      </h3>
                    </div>
                    
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Volume2 className="w-3 h-3" />
                        <span className="capitalize">
                          {recording.analysisResults?.callType || 'Unknown call'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span>
                          {recording.analysisResults?.confidenceScore?.toFixed(1) || 0}% confidence
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(recording.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {recording.latitude.toFixed(4)}, {recording.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    {recording.analysisResults?.behavioralInsight && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-700">
                        {recording.analysisResults.behavioralInsight}
                      </div>
                    )}

                    <button
                      onClick={() => onRecordingSelect(recording)}
                      className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleLayer={handleToggleLayer}
        showHeatmap={showHeatmap}
      />

      {/* Species Legend */}
      {uniqueSpecies.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-slate-800 rounded-lg p-3 shadow-lg max-w-xs">
          <h4 className="text-sm font-semibold text-white mb-2">Species Legend</h4>
          <div className="space-y-1">
            {uniqueSpecies.slice(0, 6).map((species) => (
              <div key={species} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getSpeciesColor(species) }}
                />
                <span className="text-xs text-slate-300">{species}</span>
              </div>
            ))}
            {uniqueSpecies.length > 6 && (
              <div className="text-xs text-slate-400 mt-1">
                +{uniqueSpecies.length - 6} more species
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recording Count */}
      <div className="absolute top-4 left-4 z-[1000] bg-slate-800 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white">
            {filteredRecordings.length} recording{filteredRecordings.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* No recordings message */}
      {filteredRecordings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-[1000] bg-slate-900 bg-opacity-75 rounded-lg">
          <div className="text-center text-white">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-lg font-medium">No recordings found</p>
            <p className="text-sm text-slate-400">
              {selectedSpecies && selectedSpecies !== 'all' 
                ? `No recordings for ${selectedSpecies}` 
                : 'Start recording to see your data on the map'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapWithMarkers;
