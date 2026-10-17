import React, { useState } from 'react';
import { CIVILIZATIONAL_DELIVERABLES } from '../data/deliverables';
import { DeliverableItem } from '../types';

export const CivilizationalCodex: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentDeliverable = CIVILIZATIONAL_DELIVERABLES.find(d => d.id === selectedId) || CIVILIZATIONAL_DELIVERABLES[0];

  const filteredDeliverables = CIVILIZATIONAL_DELIVERABLES.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.keyFindings.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            The Institutional Codex
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            The 12 Master Civilizational Deliverables
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Complete architectural dossiers governing Atlas Sanctum: strategic thesis, empirical market evidence, competitive positioning, commercial unit economics, 90-day campaign, risk register, and institutional manifesto.
          </p>
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search Codex dossiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-[#E8E4DC] rounded text-[#0B241A] placeholder-[#A8A29E] focus:outline-none focus:border-[#0B241A]"
          />
        </div>
      </div>

      {/* 2-Column Asymmetric Reading Canvas (35% Nav Rail / 65% Main Reading Body) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Table of Contents Rail */}
        <div className="lg:col-span-4 bg-white border border-[#E8E4DC] rounded-lg p-3 space-y-1 sticky top-24 max-h-[75vh] overflow-y-auto shadow-xs">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#78716C] border-b border-[#F4F1EA]">
            Deliverables Index ({filteredDeliverables.length} / 12)
          </div>

          <div className="space-y-1 pt-1">
            {filteredDeliverables.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-3 rounded text-xs transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B241A] text-white shadow-xs'
                      : 'text-[#44403C] hover:bg-[#F4F1EA] hover:text-[#0B241A]'
                  }`}
                >
                  <span className={`font-mono text-[11px] shrink-0 ${
                    isSelected ? 'text-[#C5A059] font-bold' : 'text-[#78716C]'
                  }`}>
                    {item.numberStr}.
                  </span>
                  <div>
                    <div className="font-medium line-clamp-1">{item.title}</div>
                    <div className={`text-[10px] line-clamp-1 mt-0.5 ${
                      isSelected ? 'text-[#FBF9F5]/70' : 'text-[#78716C]'
                    }`}>
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Reading Canvas */}
        <div className="lg:col-span-8 bg-white border border-[#E8E4DC] rounded-xl p-8 sm:p-10 shadow-xs space-y-8 text-[#1C1917]">
          
          {/* Header Area */}
          <div className="border-b border-[#E8E4DC] pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2C5E4B]">
              <span>Deliverable {currentDeliverable.numberStr}</span>
              <span aria-hidden="true">·</span>
              <span>Atlas Sanctum Architecture</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B241A] leading-tight">
              {currentDeliverable.title}
            </h1>
            
            <p className="text-sm text-[#57534E] italic font-serif">
              {currentDeliverable.subtitle}
            </p>
          </div>

          {/* Key Findings Card */}
          <div className="p-5 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
              Key Analytical Conclusions
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[#44403C] leading-relaxed">
              {currentDeliverable.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#2C5E4B] font-bold shrink-0 mt-0.5">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Empirical Citations Strip */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
              Dated Empirical Citations & Evidence Base
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {currentDeliverable.datedCitations.map((cite, idx) => (
                <div key={idx} className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1">
                  <div className="font-medium text-[#0B241A]">{cite.citation}</div>
                  <div className="flex items-center justify-between text-[10px] text-[#78716C] pt-1 border-t border-[#E8E4DC]">
                    <span>Date: {cite.date}</span>
                    <span className="font-mono text-[#2C5E4B]">{cite.reliability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Analytical Prose Essay */}
          <div className="space-y-4 pt-4 border-t border-[#E8E4DC]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
              Comprehensive Architectural Monograph
            </div>
            <div className="text-sm sm:text-base text-[#44403C] leading-loose whitespace-pre-line font-sans">
              {currentDeliverable.fullProse}
            </div>
          </div>

          {/* Methodology & Verification Standards */}
          <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs text-[#57534E] space-y-1">
            <div className="font-semibold text-[#0B241A] uppercase tracking-wider text-[11px]">
              Methodology & Verification Note
            </div>
            <p className="leading-relaxed">
              {currentDeliverable.methodologyOrEvidence}
            </p>
          </div>

          {/* Footer Next Deliverable Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E8E4DC]">
            <button
              onClick={() => setSelectedId(Math.max(1, selectedId - 1))}
              disabled={selectedId === 1}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedId === 1 ? 'text-[#D6D3D1] cursor-not-allowed' : 'text-[#0B241A] hover:text-[#2C5E4B]'
              }`}
            >
              ← Previous Deliverable
            </button>

            <span className="text-xs font-mono text-[#78716C]">
              {selectedId} of 12
            </span>

            <button
              onClick={() => setSelectedId(Math.min(12, selectedId + 1))}
              disabled={selectedId === 12}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedId === 12 ? 'text-[#D6D3D1] cursor-not-allowed' : 'text-[#0B241A] hover:text-[#2C5E4B]'
              }`}
            >
              Next Deliverable →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
