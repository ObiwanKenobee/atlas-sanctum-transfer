import React from 'react';
import { LegacyMandate, Opportunity, AllocationScenario } from '../types';

interface PrintableAllocationDossierProps {
  mandate: LegacyMandate;
  shortlistedOpportunities: Opportunity[];
  activeScenario: AllocationScenario;
  onClose: () => void;
}

export const PrintableAllocationDossier: React.FC<PrintableAllocationDossierProps> = ({
  mandate,
  shortlistedOpportunities,
  activeScenario,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const pool = mandate.capitalPoolUsd;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/85 backdrop-blur-md overflow-y-auto p-4 sm:p-8 flex justify-center">
      {/* Outer wrapper to contain action bar & document sheet */}
      <div className="w-full max-w-4xl my-auto space-y-4">
        
        {/* Floating Action Ribbon (Hidden when printing via print:hidden) */}
        <div className="print:hidden flex items-center justify-between p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2C5E4B]"></span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0B241A] block">
                Formal Document Preview Mode
              </span>
              <span className="text-xs text-[#78716C]">
                Formatted for archival print and PDF export (Letter / A4 pagination).
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-[#0B241A] text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-[#13382C] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-[#E8E4DC] text-[#44403C] text-xs font-medium uppercase tracking-wider rounded hover:bg-[#F4F1EA] transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>

        {/* Formal Printable Document Canvas */}
        <div className="bg-white text-[#1C1917] p-8 sm:p-14 shadow-2xl rounded-xl border border-[#E8E4DC] print:shadow-none print:border-none print:p-0 print:rounded-none space-y-10">
          
          {/* Cover & Masthead */}
          <div className="border-b-2 border-[#0B241A] pb-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#78716C]">
              <span>Atlas Sanctum Intelligence Observatory</span>
              <span>Ref: AS-EAA-2026-088</span>
              <span>Strict Fiduciary Confidentiality</span>
            </div>

            <div className="space-y-3 pt-4">
              <div className="text-xs uppercase font-serif tracking-widest text-[#C5A059] font-semibold">
                Civilizational Stewardship Portfolio · East Africa Proving Ground
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B241A] tracking-tight leading-tight">
                The Africa Regeneration Allocation Brief
              </h1>
              <p className="text-base font-serif italic text-[#44403C]">
                An Intergenerational Capital Allocation Strategy & Diligence Review for {mandate.familyName}
              </p>
            </div>

            {/* Document Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs">
              <div>
                <span className="text-[#78716C] block uppercase text-[10px]">Stewardship Pool</span>
                <span className="font-semibold text-sm text-[#0B241A] font-mono">
                  ${(mandate.capitalPoolUsd / 1000000).toFixed(0)}M USD
                </span>
              </div>
              <div>
                <span className="text-[#78716C] block uppercase text-[10px]">Horizon & Stage</span>
                <span className="font-semibold text-sm text-[#0B241A]">
                  {mandate.timeHorizonYears} Yrs · {mandate.generationStage.split(' ')[0]}
                </span>
              </div>
              <div>
                <span className="text-[#78716C] block uppercase text-[10px]">Strategy Selected</span>
                <span className="font-semibold text-sm text-[#0B241A]">
                  {activeScenario.name.replace('Scenario ', '')}
                </span>
              </div>
              <div>
                <span className="text-[#78716C] block uppercase text-[10px]">Target Net Return</span>
                <span className="font-semibold text-sm text-[#2C5E4B]">
                  {activeScenario.expectedAnnualReturn}
                </span>
              </div>
            </div>
          </div>

          {/* Section I: Family Covenant & Investment Thesis */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E4DC] pb-2">
              <span className="font-mono text-xs font-bold text-[#C5A059]">01.</span>
              <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#0B241A]">
                The Family Covenant & Strategic Mandate
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-[#333] leading-relaxed text-justify">
              This document formalizes the capital stewardship intentions of <strong>{mandate.familyName}</strong>. The family recognizes that the intergenerational transmission of wealth must transcend speculative paper assets and extractive finance. The family’s primary civilizational mission is <strong>{mandate.primaryMission}</strong>, operating under a disciplined barbell model: <strong>{100 - mandate.philanthropicSplit}%</strong> in cash-flowing commercial enterprises and <strong>{mandate.philanthropicSplit}%</strong> in catalytic grant or concessionary facilities.
            </p>

            <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs space-y-2">
              <span className="font-semibold text-[#0B241A] uppercase tracking-wider block text-[10px]">
                Enforced Ethical Exclusions & Red Lines
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#44403C]">
                {mandate.ethicalExclusions.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-red-700 font-bold">•</span>
                    <span>{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section II: Selected Allocation Scenario Analysis */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E4DC] pb-2">
              <span className="font-mono text-xs font-bold text-[#C5A059]">02.</span>
              <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#0B241A]">
                Selected Capital Allocation Scenario: {activeScenario.name}
              </h2>
            </div>

            <p className="text-xs text-[#57534E] leading-relaxed">
              {activeScenario.narrative}
            </p>

            {/* Split Visualization */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1">
                <span className="text-[#78716C] uppercase text-[10px] block">Offshore Liquid Reserve</span>
                <span className="text-lg font-mono font-bold text-[#0B241A]">{activeScenario.preservationPercent}%</span>
                <span className="text-[10px] text-[#78716C] block">
                  ${(pool * activeScenario.preservationPercent / 100000000).toFixed(1)}M USD in Treasuries/Liquid
                </span>
              </div>

              <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1">
                <span className="text-[#78716C] uppercase text-[10px] block">East Africa Commercial Real Assets</span>
                <span className="text-lg font-mono font-bold text-[#0B241A]">{activeScenario.commercialEastAfricaPercent}%</span>
                <span className="text-[10px] text-[#78716C] block">
                  ${(pool * activeScenario.commercialEastAfricaPercent / 100000000).toFixed(1)}M USD in Agro & Energy
                </span>
              </div>

              <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1">
                <span className="text-[#78716C] uppercase text-[10px] block">Catalytic & Watershed Trusts</span>
                <span className="text-lg font-mono font-bold text-[#2C5E4B]">{activeScenario.catalyticBlendedPercent}%</span>
                <span className="text-[10px] text-[#78716C] block">
                  ${(pool * activeScenario.catalyticBlendedPercent / 100000000).toFixed(1)}M USD in Community Land
                </span>
              </div>
            </div>

            {/* Projected Impact Metrics */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-[#F4F1EA] border border-[#E8E4DC] rounded text-xs text-center">
              <div>
                <span className="text-[10px] text-[#78716C] block uppercase">10-Yr Expected Return</span>
                <span className="font-semibold text-[#0B241A]">{activeScenario.expectedAnnualReturn}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716C] block uppercase">Climate Exposure</span>
                <span className="font-semibold text-[#2C5E4B]">{activeScenario.downsideClimateExposure} Exposure</span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716C] block uppercase">Smallholder Jobs</span>
                <span className="font-semibold text-[#0B241A] tabular-nums">{activeScenario.estimatedJobsSustained.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716C] block uppercase">Land Under Restoration</span>
                <span className="font-semibold text-[#0B241A] tabular-nums">{activeScenario.estimatedHectaresProtected.toLocaleString()} Ha</span>
              </div>
            </div>
          </div>

          {/* Section III: Shortlisted Opportunities & Diligence Dossiers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E4DC] pb-2">
              <span className="font-mono text-xs font-bold text-[#C5A059]">03.</span>
              <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#0B241A]">
                Selected Regenerative Opportunities & Evidence Audits
              </h2>
            </div>

            <div className="space-y-4">
              {shortlistedOpportunities.map((opp, idx) => (
                <div key={opp.id} className="p-4 border border-[#E8E4DC] rounded-lg bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#78716C]">#{idx + 1} </span>
                      <strong className="text-sm font-serif text-[#0B241A]">{opp.name}</strong>
                      <span className="text-xs text-[#78716C]"> · {opp.sector} ({opp.county}, {opp.country})</span>
                    </div>
                    <span className="font-mono text-xs font-bold bg-[#E8F3EE] text-[#13382C] px-2 py-0.5 rounded">
                      RCI: {opp.rciScore}/100
                    </span>
                  </div>

                  <p className="text-xs text-[#44403C] leading-normal">
                    {opp.tagline}
                  </p>

                  <div className="grid grid-cols-4 gap-2 p-2 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-[11px]">
                    <div>
                      <span className="text-[#78716C] block text-[9px] uppercase">Requirement</span>
                      <span className="font-semibold text-[#0B241A] font-mono">${(opp.capitalRequirementUsd / 1000000).toFixed(1)}M USD</span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block text-[9px] uppercase">Min Ticket</span>
                      <span className="font-semibold text-[#0B241A] font-mono">${(opp.minimumTicketUsd / 1000).toFixed(0)}k</span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block text-[9px] uppercase">Instrument</span>
                      <span className="font-semibold text-[#0B241A]">{opp.instrument}</span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block text-[9px] uppercase">Projected Yield</span>
                      <span className="font-semibold text-[#2C5E4B]">{opp.projectedFinancialReturn.split('+')[0]}</span>
                    </div>
                  </div>

                  {/* Primary Evidence Sources */}
                  <div className="text-[11px] text-[#57534E] space-y-1">
                    <span className="font-semibold text-[#0B241A] uppercase text-[9px] block">Verified Evidence Provenance:</span>
                    {opp.evidenceSources.map((ev, i) => (
                      <div key={i} className="flex justify-between border-t border-[#F4F1EA] pt-0.5">
                        <span className="truncate max-w-sm">• {ev.title} ({ev.authorOrOrg})</span>
                        <span className="text-[#78716C] font-mono shrink-0">{ev.date}</span>
                      </div>
                    ))}
                  </div>

                  {/* Unresolved Information Gaps */}
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 space-y-1">
                    <strong className="block text-[9px] uppercase font-bold text-amber-950">Pre-Disbursement Diligence Required:</strong>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {opp.unresolvedGaps.map((gap, gIdx) => (
                        <li key={gIdx}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section IV: Phased 3-Tranche Deployment Roadmap */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E4DC] pb-2">
              <span className="font-mono text-xs font-bold text-[#C5A059]">04.</span>
              <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#0B241A]">
                Phased Tranche Execution Protocol
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 border border-[#E8E4DC] rounded bg-[#FBF9F5] space-y-1">
                <span className="font-mono text-[10px] text-[#78716C] uppercase block">Tranche 1 (15%)</span>
                <strong className="text-[#0B241A] block">On-site Soil & Title Audit</strong>
                <p className="text-[11px] text-[#57534E]">Physical field core sampling, FPIC community verification, and advisory observer seat.</p>
              </div>

              <div className="p-3 border border-[#E8E4DC] rounded bg-[#FBF9F5] space-y-1">
                <span className="font-mono text-[10px] text-[#78716C] uppercase block">Tranche 2 (50%)</span>
                <strong className="text-[#0B241A] block">Productive Asset Capex</strong>
                <p className="text-[11px] text-[#57534E]">Disbursed against verifiable hardware procurement (solar storage, processing hubs, seedlings).</p>
              </div>

              <div className="p-3 border border-[#E8E4DC] rounded bg-[#FBF9F5] space-y-1">
                <span className="font-mono text-[10px] text-[#78716C] uppercase block">Tranche 3 (35%)</span>
                <strong className="text-[#0B241A] block">Endowment & Expansion</strong>
                <p className="text-[11px] text-[#57534E]">Released upon 12 consecutive months of debt service regularity and positive telemetry logs.</p>
              </div>
            </div>
          </div>

          {/* Section V: Fiduciary Certification & Signatures */}
          <div className="pt-8 border-t-2 border-[#0B241A] space-y-6">
            <div className="text-xs text-[#78716C] leading-normal text-justify">
              <strong>Fiduciary Disclaimer:</strong> This Allocation Brief constitutes independent research, empirical evidence synthesis, and decision-support intelligence prepared by Atlas Sanctum. It does not constitute an offer of securities, collective investment scheme management, or regulated investment advice under Kenya Capital Markets Authority (CMA) regulations. Final allocation commitments must be authorized by the client’s qualified fiduciaries.
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 text-xs">
              <div className="space-y-6">
                <div className="border-b border-black h-12"></div>
                <div>
                  <span className="font-bold text-[#0B241A] block">Principal Family Steward</span>
                  <span className="text-[#78716C] text-[10px]">For {mandate.familyName}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-black h-12"></div>
                <div>
                  <span className="font-bold text-[#0B241A] block">Next-Gen Representative</span>
                  <span className="text-[#78716C] text-[10px]">Stewardship Committee</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-black h-12"></div>
                <div>
                  <span className="font-bold text-[#0B241A] block">Independent Fiduciary</span>
                  <span className="text-[#78716C] text-[10px]">Legal / Trustee Council</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-black h-12"></div>
                <div>
                  <span className="font-bold text-[#0B241A] block">Atlas Sanctum Fellow</span>
                  <span className="text-[#78716C] text-[10px]">Lead Systems Architect</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
