'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { usePropertyStore } from '@/store/propertyStore';
import { Propiedad } from '@/lib/supabase';

interface PropertyMapProps {
    properties: Propiedad[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const { hoveredPropertyId, setHoveredProperty, setSelectedProperty } = usePropertyStore();

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
            console.warn('Mapbox token not found');
            return;
        }

        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-58.3816, -34.6037], // Buenos Aires
            zoom: 11,
            pitch: 45,
            bearing: -17.6,
            antialias: true,
        });

        map.current.on('load', () => {
            setIsMapLoaded(true);

            // Add 3D buildings layer
            const layers = map.current!.getStyle()?.layers;
            const labelLayerId = layers?.find(
                (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
            )?.id;

            map.current!.addLayer(
                {
                    id: '3d-buildings',
                    source: 'composite',
                    'source-layer': 'building',
                    filter: ['==', 'extrude', 'true'],
                    type: 'fill-extrusion',
                    minzoom: 15,
                    paint: {
                        'fill-extrusion-color': '#1a1a3e',
                        'fill-extrusion-height': ['get', 'height'],
                        'fill-extrusion-base': ['get', 'min_height'],
                        'fill-extrusion-opacity': 0.6,
                    },
                },
                labelLayerId
            );
        });

        // Navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // Update markers when properties change
    useEffect(() => {
        if (!map.current || !isMapLoaded) return;

        // Clear existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        // Add new markers
        properties.forEach((property) => {
            if (!property.coords_lat || !property.coords_lng) return;

            // Create custom marker element
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.cssText = `
        width: 40px;
        height: 40px;
        background: ${property.operation === 'venta'
                    ? 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)'
                    : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      `;

            el.addEventListener('mouseenter', () => {
                setHoveredProperty(property.id);
                el.style.transform = 'rotate(-45deg) scale(1.2)';
                el.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.5)';
            });

            el.addEventListener('mouseleave', () => {
                setHoveredProperty(null);
                el.style.transform = 'rotate(-45deg) scale(1)';
                el.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            });

            el.addEventListener('click', () => {
                setSelectedProperty(property.id);
            });

            const marker = new mapboxgl.Marker(el)
                .setLngLat([property.coords_lng, property.coords_lat])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25, closeButton: false })
                        .setHTML(`
              <div style="padding: 8px;">
                <h4 style="margin: 0 0 4px; font-weight: 600; font-size: 14px;">${property.title}</h4>
                <p style="margin: 0; color: #00d4ff; font-weight: 700; font-size: 16px;">
                  $${property.price.toLocaleString('es-AR')}
                </p>
              </div>
            `)
                )
                .addTo(map.current!);

            markers.current.push(marker);
        });

        // Fit bounds to show all markers
        if (properties.length > 0 && properties.some(p => p.coords_lat && p.coords_lng)) {
            const bounds = new mapboxgl.LngLatBounds();
            properties.forEach(property => {
                if (property.coords_lat && property.coords_lng) {
                    bounds.extend([property.coords_lng, property.coords_lat]);
                }
            });

            map.current.fitBounds(bounds, {
                padding: 60,
                maxZoom: 14,
            });
        }
    }, [properties, isMapLoaded, setHoveredProperty, setSelectedProperty]);

    // Fly to hovered property
    useEffect(() => {
        if (!map.current || !isMapLoaded || !hoveredPropertyId) return;

        const property = properties.find(p => p.id === hoveredPropertyId);
        if (property?.coords_lat && property?.coords_lng) {
            map.current.flyTo({
                center: [property.coords_lng, property.coords_lat],
                zoom: 15,
                pitch: 45,
                duration: 1000,
                essential: true,
            });
        }
    }, [hoveredPropertyId, properties, isMapLoaded]);

    return (
        <div className="relative w-full h-full">
            <div
                ref={mapContainer}
                className="w-full h-full rounded-[2rem] overflow-hidden"
                style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                }}
            />

            {/* Loading State */}
            {!isMapLoaded && (
                <div
                    className="absolute inset-0 flex items-center justify-center rounded-[2rem]"
                    style={{
                        background: 'rgba(10, 10, 26, 0.9)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <div className="text-center">
                        <div
                            className="w-12 h-12 rounded-full border-4 border-t-[#00d4ff] border-r-[#00d4ff] border-b-transparent border-l-transparent animate-spin mx-auto mb-4"
                        />
                        <p className="text-neutral-400">Cargando mapa...</p>
                    </div>
                </div>
            )}

            {/* Map Legend */}
            <div
                className="absolute bottom-4 left-4 p-4 rounded-2xl"
                style={{
                    background: 'rgba(10, 10, 26, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)' }}
                        />
                        <span className="text-neutral-300">Venta</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}
                        />
                        <span className="text-neutral-300">Alquiler</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
