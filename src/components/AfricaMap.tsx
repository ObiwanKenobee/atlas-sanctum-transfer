import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Opportunity, Sector } from '../types';

interface AfricaMapProps {
  opportunities: Opportunity[];
  selectedOpportunityId?: string;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  shortlistedIds?: string[];
}

// Embedded GeoJSON Polygon for the African continent coastline and regional boundaries
// Provides reliable, zero-latency vector rendering without network dependencies.
const AFRICA_GEO_FEATURES: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Africa Continent Mainland' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Northern Coast (Morocco to Egypt)
            [-5.5, 35.8], [0.0, 36.0], [5.0, 37.0], [10.0, 37.3], [12.0, 33.0], 
            [15.0, 32.5], [20.0, 32.2], [25.0, 31.6], [30.0, 31.3], [32.5, 31.4],
            [34.0, 31.2],
            // Red Sea / Horn of Africa
            [35.0, 28.0], [37.5, 23.0], [42.5, 14.0], [43.5, 12.5], [51.2, 11.8],
            [50.5, 9.5], [49.0, 7.0], [45.0, 2.0],
            // East Coast (Somalia to South Africa)
            [41.5, -1.5], [39.5, -4.5], [39.0, -8.0], [40.5, -11.0], [40.8, -15.0],
            [35.5, -24.0], [32.5, -28.0], [29.5, -31.5], [26.0, -33.8], [20.0, -34.8],
            [18.5, -34.4],
            // West Coast (South Africa to West Africa)
            [17.8, -32.5], [15.2, -26.0], [12.0, -17.0], [13.2, -12.5], [12.2, -6.0],
            [9.0, -1.0], [8.5, 4.0], [5.0, 5.0], [2.0, 6.2], [-3.0, 5.2],
            [-7.5, 4.3], [-11.5, 7.0], [-13.2, 9.5], [-16.7, 12.0], [-17.5, 14.8],
            [-17.0, 16.5], [-16.0, 21.0], [-13.0, 27.5], [-10.0, 30.0], [-5.5, 35.8]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Madagascar' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [49.3, -12.0], [50.5, -15.5], [48.5, -22.0], [47.0, -25.5], 
            [44.5, -25.2], [43.5, -22.0], [44.0, -16.0], [47.0, -13.5], [49.3, -12.0]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Lake Victoria' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [31.8, -0.2], [33.2, -0.4], [34.5, -0.1], [34.7, -1.2], 
            [33.8, -2.5], [32.5, -2.8], [31.6, -1.8], [31.5, -0.9], [31.8, -0.2]
          ]
        ]
      }
    }
  ]
};

// Great Rift Valley geological path (Beirut to Mozambique, focused through East Africa)
const RIFT_VALLEY_PATH = [
  [39.5, 12.0], // Afar Triangle
  [38.5, 8.5],  // Ethiopian Rift
  [36.5, 4.0],  // Lake Turkana
  [36.0, 0.5],  // Baringo / Bogoria
  [36.3, -0.3], // Lake Nakuru / Naivasha
  [35.8, -2.5], // Lake Natron / Eyasi
  [34.8, -6.0], // Central Tanzania Rift
  [34.0, -11.5] // Lake Malawi
];

export const AfricaMap: React.FC<AfricaMapProps> = ({
  opportunities,
  selectedOpportunityId,
  onSelectOpportunity,
  shortlistedIds = []
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredOpportunity, setHoveredOpportunity] = useState<Opportunity | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomMode, setZoomMode] = useState<'continental' | 'east-africa'>('continental');
  const [activeSector, setActiveSector] = useState<string>('All');

  const filteredOpportunities = opportunities.filter((opp) => {
    return activeSector === 'All' || opp.sector === activeSector;
  });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 540;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Map container group for zoom & pan
    const g = svg.append('g').attr('class', 'map-viewport');

    // Define Projection
    const projection = d3.geoMercator();

    if (zoomMode === 'continental') {
      projection
        .center([18, 2])
        .scale(width < 640 ? 320 : 440)
        .translate([width / 2, height / 2 + 10]);
    } else {
      // Focused on East African Proving Ground (Kenya, Uganda, Rwanda, Tanzania)
      projection
        .center([35.5, -0.8])
        .scale(width < 640 ? 1500 : 2200)
        .translate([width / 2, height / 2]);
    }

    const pathGenerator = d3.geoPath().projection(projection);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Background ocean fill
    g.append('rect')
      .attr('x', -width * 2)
      .attr('y', -height * 2)
      .attr('width', width * 5)
      .attr('height', height * 5)
      .attr('fill', '#F4F1EA')
      .attr('opacity', 0.6);

    // Graticule (lat/long grid)
    const graticule = d3.geoGraticule().step([10, 10]);
    g.append('path')
      .datum(graticule)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#E8E4DC')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', '2,4');

    // Africa Continent Base Polygons
    g.selectAll('.land-feature')
      .data(AFRICA_GEO_FEATURES.features)
      .enter()
      .append('path')
      .attr('class', 'land-feature')
      .attr('d', pathGenerator as any)
      .attr('fill', (d) => (d.properties?.name === 'Lake Victoria' ? '#DCE8E3' : '#EBE6DF'))
      .attr('stroke', (d) => (d.properties?.name === 'Lake Victoria' ? '#2C5E4B' : '#D6CEBE'))
      .attr('stroke-width', (d) => (d.properties?.name === 'Lake Victoria' ? 1.2 : 1.5))
      .attr('stroke-linejoin', 'round');

    // Great Rift Valley Fault Line
    const riftLineGenerator = d3.line<number[]>()
      .x((d) => projection([d[0], d[1]])?.[0] || 0)
      .y((d) => projection([d[0], d[1]])?.[1] || 0)
      .curve(d3.curveBasis);

    g.append('path')
      .datum(RIFT_VALLEY_PATH)
      .attr('d', riftLineGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#C5A059')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.85);

    // East Africa Proving Ground Boundary Ring (when in continental view)
    if (zoomMode === 'continental') {
      const eastAfricaCenter = projection([36.0, -0.5]);
      if (eastAfricaCenter) {
        g.append('circle')
          .attr('cx', eastAfricaCenter[0])
          .attr('cy', eastAfricaCenter[1])
          .attr('r', 44)
          .attr('fill', '#0B241A')
          .attr('fill-opacity', 0.05)
          .attr('stroke', '#2C5E4B')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3');

        g.append('text')
          .attr('x', eastAfricaCenter[0] + 48)
          .attr('y', eastAfricaCenter[1] - 12)
          .text('East Africa Proving Ground')
          .attr('font-size', '10px')
          .attr('font-family', 'sans-serif')
          .attr('font-weight', '600')
          .attr('fill', '#0B241A')
          .attr('letter-spacing', '0.05em');
      }
    }

    // Opportunity Pin Markers
    const markersGroup = g.append('g').attr('class', 'opportunity-markers');

    filteredOpportunities.forEach((opp) => {
      const coords = projection([opp.coordinates.lng, opp.coordinates.lat]);
      if (!coords) return;

      const isSelected = selectedOpportunityId === opp.id;
      const isShortlisted = shortlistedIds.includes(opp.id);
      const isExcluded = opp.status === 'Excluded';

      const pinColor = isExcluded ? '#991B1B' : isSelected ? '#C5A059' : '#0B241A';
      const pinAccent = isExcluded ? '#EF4444' : '#2C5E4B';

      const markerG = markersGroup.append('g')
        .attr('transform', `translate(${coords[0]}, ${coords[1]})`)
        .attr('cursor', 'pointer')
        .on('click', () => onSelectOpportunity(opp))
        .on('mouseenter', (event) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltipPos({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top
            });
          }
          setHoveredOpportunity(opp);
        })
        .on('mouseleave', () => setHoveredOpportunity(null));

      // Outer animated ring for shortlisted or selected
      if (isShortlisted || isSelected) {
        markerG.append('circle')
          .attr('r', zoomMode === 'east-africa' ? 18 : 12)
          .attr('fill', pinAccent)
          .attr('fill-opacity', 0.2)
          .attr('stroke', pinAccent)
          .attr('stroke-width', 1.2);
      }

      // Main pin circle
      markerG.append('circle')
        .attr('r', zoomMode === 'east-africa' ? 9 : 6.5)
        .attr('fill', pinColor)
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.5)
        .attr('filter', 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))');

      // Center core indicator
      markerG.append('circle')
        .attr('r', zoomMode === 'east-africa' ? 3.5 : 2.5)
        .attr('fill', isExcluded ? '#FCA5A5' : '#C5A059');

      // Opportunity Name Label in East Africa Zoom View
      if (zoomMode === 'east-africa') {
        markerG.append('text')
          .attr('x', 14)
          .attr('y', 4)
          .text(opp.name.split(' ')[0] + ' ' + (opp.name.split(' ')[1] || ''))
          .attr('font-size', '11px')
          .attr('font-family', 'sans-serif')
          .attr('font-weight', isSelected ? '700' : '600')
          .attr('fill', isExcluded ? '#991B1B' : '#0B241A')
          .attr('filter', 'drop-shadow(0px 1px 2px rgba(255,255,255,0.9))');
      }
    });

  }, [filteredOpportunities, selectedOpportunityId, shortlistedIds, zoomMode, activeSector]);

  return (
    <div className="bg-white border border-[#E8E4DC] rounded-xl shadow-xs overflow-hidden">
      {/* Map Control Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#E8E4DC] bg-[#F4F1EA] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#2C5E4B]">
            <span>D3 Cartographic Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Geospatial Opportunity Distribution</span>
          </div>
          <h3 className="text-xl font-serif font-semibold text-[#0B241A] mt-0.5">
            African Continental & Rift Valley Observatory Map
          </h3>
        </div>

        {/* View Controls & Sector Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Zoom Level Switcher */}
          <div className="flex items-center p-1 bg-white border border-[#E8E4DC] rounded text-xs">
            <button
              onClick={() => setZoomMode('continental')}
              className={`px-3 py-1 font-medium rounded transition-colors cursor-pointer ${
                zoomMode === 'continental'
                  ? 'bg-[#0B241A] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#0B241A]'
              }`}
            >
              Pan-Africa Overview
            </button>
            <button
              onClick={() => setZoomMode('east-africa')}
              className={`px-3 py-1 font-medium rounded transition-colors cursor-pointer ${
                zoomMode === 'east-africa'
                  ? 'bg-[#0B241A] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#0B241A]'
              }`}
            >
              East Africa Proving Ground
            </button>
          </div>

          {/* Sector Dropdown */}
          <select
            value={activeSector}
            onChange={(e) => setActiveSector(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#E8E4DC] rounded text-[#0B241A] focus:outline-none"
          >
            <option value="All">All Sectors ({opportunities.length})</option>
            <option value="Regenerative Agriculture">Regenerative Agriculture</option>
            <option value="Watershed & Aquatic Systems">Watershed & Aquatic Systems</option>
            <option value="Decentralized Clean Energy">Decentralized Clean Energy</option>
            <option value="Community Land & Forest Trusts">Community Land Trusts</option>
            <option value="Circular Bioeconomy">Circular Bioeconomy</option>
          </select>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div ref={containerRef} className="relative w-full h-[520px] bg-[#FBF9F5] select-none">
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 left-4 p-3 bg-white/95 backdrop-blur-xs border border-[#E8E4DC] rounded-lg shadow-sm text-xs space-y-2 pointer-events-none">
          <div className="font-semibold text-[#0B241A] uppercase tracking-wider text-[10px]">
            Map Legend
          </div>
          <div className="space-y-1.5 text-[11px] text-[#57534E]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0B241A] inline-block shrink-0 border border-white"></span>
              <span>Qualified Opportunity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#991B1B] inline-block shrink-0 border border-white"></span>
              <span>Integrity Gate Rejection (Case Study)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#C5A059] border-t border-dashed border-[#C5A059] inline-block shrink-0"></span>
              <span>Great Rift Valley Fault Line</span>
            </div>
          </div>
          <div className="text-[10px] text-[#78716C] pt-1 border-t border-[#E8E4DC]">
            Scroll to zoom · Click pins to view dossiers
          </div>
        </div>

        {/* Hover Tooltip Overlay */}
        {hoveredOpportunity && (
          <div
            className="absolute z-30 pointer-events-none p-3.5 bg-[#0B241A] text-white rounded-lg shadow-xl max-w-xs space-y-1.5 -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 12}px`
            }}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">
              <span>{hoveredOpportunity.sector}</span>
              <span>RCI: {hoveredOpportunity.rciScore}/100</span>
            </div>

            <div className="font-serif font-semibold text-sm leading-snug">
              {hoveredOpportunity.name}
            </div>

            <div className="text-xs text-white/80">
              {hoveredOpportunity.county}, {hoveredOpportunity.country}
            </div>

            <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-white/20 font-mono">
              <span className="text-white/70">Capital Required:</span>
              <span className="text-[#C5A059] font-bold">
                ${(hoveredOpportunity.capitalRequirementUsd / 1000000).toFixed(1)}M USD
              </span>
            </div>

            <div className="text-[10px] text-white/60 italic pt-0.5">
              Click marker to inspect full dossier
            </div>
          </div>
        )}
      </div>

      {/* Map Sub-Bar with Quick Opportunity Strip */}
      <div className="p-4 border-t border-[#E8E4DC] bg-[#F4F1EA] flex flex-wrap items-center justify-between gap-3 text-xs text-[#57534E]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#0B241A]">Selected In Focus:</span>
          <span>{filteredOpportunities.length} Geospatial Nodes Tracked</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#78716C]">Proving Ground Coordinates:</span>
          <span className="font-mono text-[#0B241A]">Kenya (0.02°S, 37.9°E) · Rwanda (1.9°S, 29.8°E) · Tanzania (6.3°S, 34.8°E) · Ghana (7.9°N, 1.0°W)</span>
        </div>
      </div>
    </div>
  );
};
