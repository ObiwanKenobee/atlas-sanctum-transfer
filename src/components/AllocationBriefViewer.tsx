import React, { useState } from 'react';
import { LegacyMandate, Opportunity, AllocationScenario } from '../types';

interface AllocationBriefViewerProps {
  mandate: LegacyMandate;
  shortlistedOpportunities: Opportunity[];
  activeScenario: AllocationScenario;
  onInspectOpportunity: (opportunity: Opportunity) => void;
  onOpenCommissionModal: () => void;
}

export const AllocationBriefViewer: React.FC<AllocationBriefViewerProps> = ({
  mandate,
  shortlistedOpportunities,
  activeScenario,
  onInspectOpportunity,
  onOpenCommissionModal
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string>('');

  const handleExportBrief = () => {
    setDownloadNotice('Executive Allocation Brief compiled and ready for investment committee review.');
    setTimeout(() => setDownloadNotice(''), 4500);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            The Initial Paid Wedge Deliverable
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Africa Regeneration Allocation Brief
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Institutional decision dossier synthesized for the family investment committee. Grounded in empirical evidence, transparent inclusion/rejection criteria, and explicit disclosure of unresolved information gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportBrief}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-white border border-[#0B241A] text-[#0B241A] rounded hover:bg-[#0B241A]/5 transition-colors cursor-pointer"
          >
            Export Committee Dossier
          </button>
          <button
            onClick={onOpenCommissionModal}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-[#0B241A] text-white rounded hover:bg-[#13382C] transition-colors cursor-pointer"
          >
            Commission Field Audit ($22.5k)
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-[#E8F3EE] border border-[#2C5E4B]/30 rounded text-xs text-[#13382C] font-medium">
          {downloadNotice}
        </div>
      )}

      {/* Main Brief Document Container (Museum / Institutional Paper Styling) */}
      <div className="bg-white border border-[#E8E4DC] rounded-xl shadow-xs overflow-hidden">
        
        {/* Document Header Marquee */}
        <div className="p-8 border-b border-[#E8E4DC] bg-[#F4F1EA]/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs uppercase tracking-widest text-[#78716C] font-mono">
            <span>REF: AS-EAA-2026-088</span>
            <span>Date of Delivery: October 2026</span>
            <span>Status: Verified Decision Brief</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#0B241A] leading-tight">
              Regenerative Capital Stewardship Brief: {mandate.familyName}
            </h1>
            <p className="text-sm text-[#57534E] mt-2">
              Prepared by Atlas Sanctum Intelligence Observatory · East Africa Proving Ground
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E8E4DC] text-xs">
            <div>
              <span className="text-[#78716C] block uppercase text-[10px]">Stewardship Pool</span>
              <span className="font-semibold text-[#0B241A] font-mono">
                ${(mandate.capitalPoolUsd / 1000000).toFixed(0)}M USD
              </span>
            </div>
            <div>
              <span className="text-[#78716C] block uppercase text-[10px]">Succession Stage</span>
              <span className="font-semibold text-[#0B241A]">
                {mandate.generationStage.split(' ')[0]} {mandate.generationStage.split(' ')[1]}
              </span>
            </div>
            <div>
              <span className="text-[#78716C] block uppercase text-[10px]">Target Yield</span>
              <span className="font-semibold text-[#2C5E4B]">
                {mandate.targetAnnualReturn}
              </span>
            </div>
            <div>
              <span className="text-[#78716C] block uppercase text-[10px]">Active Strategy</span>
              <span className="font-semibold text-[#0B241A]">
                {activeScenario.name.replace('Scenario ', '')}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Mandate Synthesis */}
        <div className="p-8 border-b border-[#E8E4DC] space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A]">
            01. Mandate Alignment & Governance Architecture
          </h3>
          <p className="text-sm text-[#44403C] leading-relaxed max-w-4xl">
            The {mandate.familyName} has articulated an intergenerational commitment to <strong className="text-[#0B241A]">{mandate.primaryMission}</strong> over a <strong className="text-[#0B241A] font-mono">{mandate.timeHorizonYears}-year horizon</strong>. Capital is allocated under a blended structure: <strong className="text-[#0B241A] font-mono">{100 - mandate.philanthropicSplit}%</strong> in cash-flowing productive commercial enterprise, and <strong className="text-[#2C5E4B] font-mono">{mandate.philanthropicSplit}%</strong> in catalytic grant or concessionary facilities.
          </p>
          
          <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs space-y-2">
            <div className="font-semibold text-[#0B241A] uppercase tracking-wider">
              Enforced Ethical Red Lines ({mandate.ethicalExclusions.length} Clauses)
            </div>
            <div className="flex flex-wrap gap-2">
              {mandate.ethicalExclusions.map((ex, idx) => (
                <span key={idx} className="text-[#44403C] bg-white border border-[#E8E4DC] px-2.5 py-1 rounded text-xs">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Shortlist of Qualifying Opportunities */}
        <div className="p-8 border-b border-[#E8E4DC] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A]">
                02. Curated Shortlist of Qualified Opportunities ({shortlistedOpportunities.length} Assets)
              </h3>
              <p className="text-xs text-[#78716C]">
                Selected based on RCI multi-pillar score, verified audits, and geographic focus.
              </p>
            </div>
            <span className="text-xs font-mono text-[#2C5E4B]">
              Total Required: ${(shortlistedOpportunities.reduce((acc, o) => acc + o.capitalRequirementUsd, 0) / 1000000).toFixed(1)}M USD
            </span>
          </div>

          <div className="space-y-4">
            {shortlistedOpportunities.map((opp, idx) => (
              <div 
                key={opp.id}
                className="p-5 border border-[#E8E4DC] rounded-lg bg-[#FBF9F5] hover:bg-white transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#78716C]">#{idx + 1}</span>
                    <h4 className="text-lg font-serif font-semibold text-[#0B241A]">{opp.name}</h4>
                    <span className="text-xs text-[#78716C]">· {opp.sector} ({opp.county})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-[#E8F3EE] text-[#13382C] px-2.5 py-1 rounded font-semibold">
                      RCI: {opp.rciScore}/100
                    </span>
                    <button
                      onClick={() => onInspectOpportunity(opp)}
                      className="text-xs font-semibold text-[#0B241A] hover:underline cursor-pointer"
                    >
                      Inspect Full Dossier →
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#57534E] leading-relaxed">
                  {opp.tagline}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2 border-t border-[#E8E4DC]">
                  <div>
                    <span className="text-[#78716C] block uppercase text-[10px]">Allocation Ticket</span>
                    <span className="font-semibold text-[#0B241A] font-mono">${(opp.minimumTicketUsd / 1000).toFixed(0)}k min</span>
                  </div>
                  <div>
                    <span className="text-[#78716C] block uppercase text-[10px]">Target Return</span>
                    <span className="font-semibold text-[#2C5E4B]">{opp.projectedFinancialReturn.split('+')[0]}</span>
                  </div>
                  <div>
                    <span className="text-[#78716C] block uppercase text-[10px]">Beneficiaries</span>
                    <span className="font-semibold text-[#0B241A] tabular-nums">{opp.beneficiaryCount.toLocaleString()} Families</span>
                  </div>
                  <div>
                    <span className="text-[#78716C] block uppercase text-[10px]">Land Restored</span>
                    <span className="font-semibold text-[#0B241A] tabular-nums">{opp.hectaresUnderRegeneration.toLocaleString()} Ha</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Comparative Risk & Information Gap Audit */}
        <div className="p-8 border-b border-[#E8E4DC] space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A]">
            03. Unresolved Information Gaps & Required Next-Stage Diligence
          </h3>
          <p className="text-xs text-[#57534E]">
            Before wiring investment tranches, the family investment committee must mandate independent resolution of the following data gaps:
          </p>

          <div className="space-y-3">
            {shortlistedOpportunities.map((opp) => (
              <div key={opp.id} className="p-4 bg-amber-50/50 border border-amber-200 rounded text-xs space-y-1">
                <div className="font-semibold text-amber-950 uppercase tracking-wider">
                  {opp.name} — Pending Diligence Gates
                </div>
                <ul className="list-disc pl-5 text-amber-900 space-y-1 pt-1">
                  {opp.unresolvedGaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Recommended Phased Capital Tranche Schedule */}
        <div className="p-8 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A]">
            04. Recommended 3-Tranche Deployment Protocol
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1.5">
              <div className="font-mono text-[#78716C] uppercase text-[10px]">Tranche 1 (15% Capital)</div>
              <div className="font-semibold text-[#0B241A]">Diligence & Governance Alignment</div>
              <p className="text-[#57534E] leading-relaxed">
                Covers on-site soil core sampling, legal title verification, and seating family next-generation observer on advisory board.
              </p>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1.5">
              <div className="font-mono text-[#78716C] uppercase text-[10px]">Tranche 2 (50% Capital)</div>
              <div className="font-semibold text-[#0B241A]">Productive Asset Deployment</div>
              <p className="text-[#57534E] leading-relaxed">
                Funds capital expenditure (solar cold lockers, mini-grid hardware, organic seedling nurseries) tied to proof of procurement.
              </p>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1.5">
              <div className="font-mono text-[#78716C] uppercase text-[10px]">Tranche 3 (35% Capital)</div>
              <div className="font-semibold text-[#0B241A]">Ecosystem Scale & Endowment</div>
              <p className="text-[#57534E] leading-relaxed">
                Disbursed upon verification of 12-month debt service regularity and positive soil organic carbon telemetry logs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
