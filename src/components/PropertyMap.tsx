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
            style: 'mapbox://styles/mapbox/light-v11', // Changed to light
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
                        'fill-extrusion-color': '#e5e7eb', // Light gray buildings
                        'fill-extrusion-height': ['get', 'height'],
                        'fill-extrusion-base': ['get', 'min_height'],
                        'fill-extrusion-opacity': 0.8,
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
            // Teal for Venta, Emerald for Alquiler (matching global theme)
            const color1 = property.operation === 'venta' ? '#0D9488' : '#10B981'; // Teal 600
            const color2 = property.operation === 'venta' ? '#0F766E' : '#059669'; // Teal 700

            el.style.cssText = `
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, ${color1} 0%, ${color2} 100%);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
      `;

            el.addEventListener('mouseenter', () => {
                setHoveredProperty(property.id);
                el.style.transform = 'rotate(-45deg) scale(1.2)';
                el.style.zIndex = '10';
            });

            el.addEventListener('mouseleave', () => {
                setHoveredProperty(null);
                el.style.transform = 'rotate(-45deg) scale(1)';
                el.style.zIndex = '1';
            });

            el.addEventListener('click', () => {
                setSelectedProperty(property.id);
            });

            const marker = new mapboxgl.Marker(el)
                .setLngLat([property.coords_lng, property.coords_lat])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25, closeButton: false })
                        .setHTML(`
              <div style="padding: 4px;">
                <h4 style="margin: 0 0 4px; font-weight: 700; font-size: 14px; color: #1f2937; font-family: 'Poppins', sans-serif;">${property.title}</h4>
                <p style="margin: 0; color: #0D9488; font-weight: 700; font-size: 16px; font-family: 'Poppins', sans-serif;">
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
                className="w-full h-full rounded-[20px] overflow-hidden bg-gray-100" // Reduced radius to match cards
                style={{
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
            />

            {/* Loading State */}
            {!isMapLoaded && (
                <div
                    className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-gray-50/80 backdrop-blur-sm"
                >
                    <div className="text-center">
                        <div
                            className="w-12 h-12 rounded-full border-4 border-t-[#0D9488] border-r-[#0D9488] border-b-transparent border-l-transparent animate-spin mx-auto mb-4"
                        />
                        <p className="text-gray-500 font-medium">Cargando mapa...</p>
                    </div>
                </div>
            )}

            {/* Map Legend */}
            <div
                className="absolute bottom-4 left-4 p-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100"
            >
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: '#0D9488' }}
                        />
                        <span className="text-gray-700">Venta</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: '#10B981' }}
                        />
                        <span className="text-gray-700">Alquiler</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
