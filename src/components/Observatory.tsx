import React, { useState } from 'react';
import { Opportunity, Sector, ThematicImpactCategory, RegenerativeAnnotation } from '../types';
import { AfricaMap } from './AfricaMap';

interface ObservatoryProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opportunity: Opportunity) => void;
  shortlistedIds: string[];
  onToggleShortlist: (opportunity: Opportunity) => void;
  onAddAnnotation?: (opportunityId: string, annotation: Omit<RegenerativeAnnotation, 'id' | 'timestamp'>) => void;
}

const THEMATIC_CATEGORIES: ('All' | ThematicImpactCategory)[] = [
  'All',
  'Soil Restoration',
  'Community Sovereignty',
  'Aquifer & Watershed Protection',
  'Youth Employment & Continuity',
  'Clean Energy & Decentralization',
  'Biodiversity Corridors',
  'Circular Waste Biomass',
  'Gender Equity & Land Agency'
];

export const Observatory: React.FC<ObservatoryProps> = ({
  opportunities,
  onSelectOpportunity,
  shortlistedIds,
  onToggleShortlist
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedThematicCategory, setSelectedThematicCategory] = useState<'All' | ThematicImpactCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Qualified' | 'Excluded'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const sectors: ('All' | Sector)[] = [
    'All',
    'Regenerative Agriculture',
    'Watershed & Aquatic Systems',
    'Decentralized Clean Energy',
    'Community Land & Forest Trusts',
    'Circular Bioeconomy'
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSector = selectedSector === 'All' || opp.sector === selectedSector;
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Qualified' ? opp.status === 'Qualified' : opp.status === 'Excluded');
    const matchesThematic = selectedThematicCategory === 'All' || 
      (opp.annotations && opp.annotations.some(ann => ann.category === selectedThematicCategory));
    return matchesSector && matchesStatus && matchesThematic;
  });

  // Calculate annotation count by thematic category for filter pill counters
  const getCategoryCount = (cat: 'All' | ThematicImpactCategory) => {
    if (cat === 'All') return opportunities.length;
    return opportunities.filter(o => o.annotations?.some(a => a.category === cat)).length;
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            The Opportunity Observatory
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            East Africa Ground-Truthed Evidence Environment
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Curated pipeline of regenerative enterprises, public-benefit assets, and community trusts across Kenya and regional corridors. Every opportunity is inspected against audited financials, ground-truth telemetry, and qualitative regenerative annotations.
          </p>
        </div>

        {/* View Switcher (Grid vs Interactive Map) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#F4F1EA] border border-[#E8E4DC] rounded text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 font-medium rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0B241A] shadow-xs font-semibold'
                  : 'text-[#57534E] hover:text-[#0B241A]'
              }`}
            >
              Dossier Cards
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-white text-[#0B241A] shadow-xs font-semibold'
                  : 'text-[#57534E] hover:text-[#0B241A]'
              }`}
            >
              <span>Africa Map (D3)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar (Segmented Controls) */}
      <div className="space-y-3 bg-[#F4F1EA] p-4 rounded-xl border border-[#E8E4DC]">
        {/* Row 1: Sectors & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Sector Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <span className="text-[11px] font-mono uppercase text-[#78716C] mr-1 shrink-0">Sector:</span>
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSector === sector
                    ? 'bg-[#0B241A] text-[#FBF9F5] shadow-xs'
                    : 'text-[#57534E] hover:text-[#0B241A] hover:bg-[#E8E4DC]'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 border-t sm:border-t-0 sm:border-l border-[#E8E4DC] pt-2 sm:pt-0 sm:pl-3 text-xs shrink-0">
            <span className="text-[#78716C] mr-1 hidden md:inline">Integrity:</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === 'All' ? 'bg-[#0B241A] text-white' : 'text-[#57534E] hover:bg-[#E8E4DC]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Qualified')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === 'Qualified' ? 'bg-[#2C5E4B] text-white' : 'text-[#57534E] hover:bg-[#E8E4DC]'
              }`}
            >
              Qualified
            </button>
            <button
              onClick={() => setStatusFilter('Excluded')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === 'Excluded' ? 'bg-red-800 text-white' : 'text-[#57534E] hover:bg-[#E8E4DC]'
              }`}
            >
              Excluded (Audit)
            </button>
          </div>
        </div>

        {/* Row 2: Qualitative Regenerative Annotations Filter */}
        <div className="pt-2 border-t border-[#E8E4DC]/80 flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#2C5E4B] font-semibold shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#2C5E4B]"></span>
            <span>Thematic Regenerative Tags:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {THEMATIC_CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = selectedThematicCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedThematicCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#2C5E4B] text-white font-medium shadow-xs'
                      : 'bg-white/80 border border-[#E8E4DC] text-[#44403C] hover:border-[#2C5E4B] hover:text-[#0B241A]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#E8E4DC] text-[#78716C]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <AfricaMap
            opportunities={filteredOpportunities}
            shortlistedIds={shortlistedIds}
            onSelectOpportunity={onSelectOpportunity}
          />
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => {
            const isShortlisted = shortlistedIds.includes(opportunity.id);
            const isExcluded = opportunity.status === 'Excluded';
            const annotations = opportunity.annotations || [];

            return (
              <div
                key={opportunity.id}
                className={`bg-white border rounded-lg overflow-hidden transition-all flex flex-col justify-between ${
                  isExcluded
                    ? 'border-red-300 bg-red-50/20'
                    : 'border-[#E8E4DC] hover:border-[#2C5E4B] shadow-xs'
                }`}
              >
                <div>
                  {/* Visual Header */}
                  <div className="relative h-44 bg-[#EBE6DF] overflow-hidden">
                    <img
                      src={opportunity.image}
                      alt={opportunity.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#FBF9F5]/80">
                        {opportunity.county}, {opportunity.country}
                      </div>
                      <div className="text-xs font-semibold text-[#FBF9F5] line-clamp-1">
                        {opportunity.sector}
                      </div>
                    </div>

                    {isExcluded && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-900 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                        Rejected Case
                      </div>
                    )}

                    {!isExcluded && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#0B241A]/85 backdrop-blur-xs text-[#FBF9F5] text-[10px] font-mono rounded">
                        RCI: {opportunity.rciScore}/100
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-[#0B241A] leading-snug line-clamp-1">
                        {opportunity.name}
                      </h3>
                      <p className="text-xs text-[#57534E] line-clamp-2 mt-1 leading-relaxed">
                        {opportunity.tagline}
                      </p>
                    </div>

                    {/* Financial & Instrument Strip */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-[11px]">
                      <div>
                        <span className="text-[#78716C] block uppercase text-[9px]">Requirement</span>
                        <span className="font-semibold text-[#0B241A] tabular-nums">
                          ${(opportunity.capitalRequirementUsd / 1000000).toFixed(1)}M USD
                        </span>
                      </div>
                      <div>
                        <span className="text-[#78716C] block uppercase text-[9px]">Target Yield</span>
                        <span className="font-semibold text-[#2C5E4B] tabular-nums">
                          {opportunity.projectedFinancialReturn.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Thematic Regenerative Annotations Strip on Card */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#78716C]">
                        <span className="uppercase tracking-wider">Regenerative Tags</span>
                        <span className="text-[#2C5E4B] font-medium">{annotations.length} Attached</span>
                      </div>

                      {annotations.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {annotations.map((ann) => (
                            <span
                              key={ann.id}
                              title={`"${ann.note}" — ${ann.authorName} (${ann.evidenceTier})`}
                              className="px-2 py-0.5 bg-[#F4F1EA] border border-[#E8E4DC] text-[#0B241A] text-[10px] rounded font-medium hover:border-[#2C5E4B] transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectOpportunity(opportunity);
                              }}
                            >
                              🏷️ {ann.category}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#A8A29E] italic">
                          No qualitative tags attached yet
                        </div>
                      )}
                    </div>

                    {/* Additionality & Evidence Counter */}
                    <div className="text-xs text-[#57534E] flex items-center justify-between pt-1 border-t border-[#F4F1EA]">
                      <span>{opportunity.evidenceSources.length} Primary Audits</span>
                      <span className="text-[#78716C]">{opportunity.beneficiaryCount.toLocaleString()} Households</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 border-t border-[#E8E4DC] bg-[#F4F1EA] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectOpportunity(opportunity)}
                      className="text-xs font-semibold text-[#0B241A] hover:text-[#2C5E4B] transition-colors cursor-pointer"
                    >
                      Inspect Dossier →
                    </button>
                    <button
                      onClick={() => onSelectOpportunity(opportunity)}
                      className="text-[11px] text-[#2C5E4B] hover:underline font-medium cursor-pointer"
                      title="Attach or inspect qualitative regenerative annotations"
                    >
                      + Annotate
                    </button>
                  </div>

                  {!isExcluded && (
                    <button
                      onClick={() => onToggleShortlist(opportunity)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                        isShortlisted
                          ? 'bg-[#2C5E4B] text-white'
                          : 'bg-white border border-[#E8E4DC] text-[#44403C] hover:border-[#0B241A]'
                      }`}
                    >
                      {isShortlisted ? 'Shortlisted' : '+ Shortlist'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Informational Methodology Note */}
      <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg text-xs text-[#57534E] flex items-start gap-3">
        <div className="font-semibold text-[#0B241A] uppercase tracking-wider shrink-0 mt-0.5">
          Methodological Rule
        </div>
        <p className="leading-relaxed">
          Inclusion in the Opportunity Observatory does not constitute an investment recommendation or financial advice. All listings are structured empirical dossiers prepared to accelerate independent due diligence. Qualitative regenerative annotations reflect primary field inspections, customary council consent testimony, and baseline telemetry signed under the Atlas Sanctum governance protocol.
        </p>
      </div>
    </div>
  );
};
