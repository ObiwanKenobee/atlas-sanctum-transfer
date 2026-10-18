import React, { useState } from 'react';
import { Opportunity, ThematicImpactCategory, RegenerativeAnnotation, UserRole } from '../types';

interface ProjectDetailModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onAddToBrief?: (opportunity: Opportunity) => void;
  isShortlisted?: boolean;
  onAddAnnotation?: (opportunityId: string, annotation: Omit<RegenerativeAnnotation, 'id' | 'timestamp'>) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  opportunity,
  onClose,
  onAddToBrief,
  isShortlisted = false,
  onAddAnnotation
}) => {
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [newCategory, setNewCategory] = useState<ThematicImpactCategory>('Soil Restoration');
  const [newEvidenceTier, setNewEvidenceTier] = useState<RegenerativeAnnotation['evidenceTier']>('Direct Field Observation');
  const [newAuthorName, setNewAuthorName] = useState('Dr. Wanjiku Mwangi');
  const [newAuthorRole, setNewAuthorRole] = useState<UserRole>('Field Auditor');
  const [newNote, setNewNote] = useState('');

  if (!opportunity) return null;

  const handleAnnotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !onAddAnnotation) return;
    onAddAnnotation(opportunity.id, {
      opportunityId: opportunity.id,
      category: newCategory,
      authorName: newAuthorName.trim(),
      authorRole: newAuthorRole,
      evidenceTier: newEvidenceTier,
      note: newNote.trim()
    });
    setNewNote('');
    setIsAddingAnnotation(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B241A]/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC] bg-[#F4F1EA]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#57534E]">
            <span className="font-semibold text-[#0B241A]">{opportunity.sector}</span>
            <span aria-hidden="true">/</span>
            <span>{opportunity.county}, {opportunity.country}</span>
            <span aria-hidden="true">/</span>
            <span className="font-mono">{opportunity.readiness}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#78716C] hover:text-[#0B241A] transition-colors rounded hover:bg-[#E8E4DC] cursor-pointer"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 text-[#1C1917]">
          
          {/* Top Title & Image Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A] mb-2">
                {opportunity.name}
              </h2>
              <p className="text-sm text-[#57534E] leading-relaxed mb-4">
                {opportunity.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#44403C] py-2 border-y border-[#E8E4DC]">
                <div>
                  <span className="text-[#78716C] block uppercase text-[10px]">Capital Required</span>
                  <span className="font-semibold text-sm text-[#0B241A]">${(opportunity.capitalRequirementUsd / 1000000).toFixed(1)}M USD</span>
                </div>
                <div>
                  <span className="text-[#78716C] block uppercase text-[10px]">Min Ticket</span>
                  <span className="font-semibold text-sm text-[#0B241A]">${(opportunity.minimumTicketUsd / 1000).toFixed(0)}k USD</span>
                </div>
                <div>
                  <span className="text-[#78716C] block uppercase text-[10px]">Instrument</span>
                  <span className="font-semibold text-sm text-[#0B241A]">{opportunity.instrument}</span>
                </div>
                <div>
                  <span className="text-[#78716C] block uppercase text-[10px]">Projected Yield</span>
                  <span className="font-semibold text-sm text-[#2C5E4B]">{opportunity.projectedFinancialReturn}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 relative h-48 sm:h-56 rounded-lg overflow-hidden border border-[#E8E4DC]">
              <img
                src={opportunity.image}
                alt={opportunity.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {opportunity.status === 'Excluded' && (
                <div className="absolute inset-0 bg-red-950/85 p-4 flex flex-col justify-center text-white">
                  <div className="text-xs uppercase font-bold tracking-widest text-red-200 mb-1">
                    Integrity Gate Failure
                  </div>
                  <div className="text-xs leading-normal">
                    {opportunity.exclusionReason}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RCI Scoreboard & Pillars */}
          <div className="p-5 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#E8E4DC]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0B241A] block">
                  Regenerative Capacity Index (RCI) Audit
                </span>
                <span className="text-xs text-[#78716C]">
                  Evidence Confidence: <strong className="text-[#0B241A]">{opportunity.confidenceLevel}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase text-[#78716C]">Composite Score:</span>
                <span className="text-2xl font-serif font-bold text-[#0B241A] tabular-nums">
                  {opportunity.rciScore}
                </span>
                <span className="text-xs text-[#78716C]">/ 100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-white border border-[#E8E4DC] rounded">
                <div className="text-[#78716C] uppercase text-[10px]">Ecological Regeneration</div>
                <div className="text-base font-semibold text-[#0B241A] mt-1 tabular-nums">
                  {opportunity.rciPillars.ecologicalRegeneration} <span className="text-xs text-[#78716C]">/ 25</span>
                </div>
              </div>
              <div className="p-3 bg-white border border-[#E8E4DC] rounded">
                <div className="text-[#78716C] uppercase text-[10px]">Institutional Governance</div>
                <div className="text-base font-semibold text-[#0B241A] mt-1 tabular-nums">
                  {opportunity.rciPillars.institutionalGovernance} <span className="text-xs text-[#78716C]">/ 25</span>
                </div>
              </div>
              <div className="p-3 bg-white border border-[#E8E4DC] rounded">
                <div className="text-[#78716C] uppercase text-[10px]">Financial Durability</div>
                <div className="text-base font-semibold text-[#0B241A] mt-1 tabular-nums">
                  {opportunity.rciPillars.financialDurability} <span className="text-xs text-[#78716C]">/ 25</span>
                </div>
              </div>
              <div className="p-3 bg-white border border-[#E8E4DC] rounded">
                <div className="text-[#78716C] uppercase text-[10px]">Additionality & Agency</div>
                <div className="text-base font-semibold text-[#0B241A] mt-1 tabular-nums">
                  {opportunity.rciPillars.additionalityAndAgency} <span className="text-xs text-[#78716C]">/ 25</span>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Statement & Operating Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
                The Problem Addressed & Beneficiaries
              </h3>
              <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                {opportunity.problemStatement}
              </p>
              <div className="text-xs text-[#57534E] pt-2">
                Direct Beneficiaries: <strong className="tabular-nums text-[#0B241A]">{opportunity.beneficiaryCount.toLocaleString()}</strong> households · <strong className="tabular-nums text-[#0B241A]">{opportunity.hectaresUnderRegeneration.toLocaleString()}</strong> hectares protected
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
                Operating Model & Additionality
              </h3>
              <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                {opportunity.operatingModel}
              </p>
              <div className="p-3 bg-[#F4F1EA] border border-[#E8E4DC] rounded text-xs text-[#44403C] mt-2">
                <strong className="text-[#0B241A] block mb-1">Additionality Thesis:</strong>
                {opportunity.additionality}
              </div>
            </div>
          </div>

          {/* Evidence Dossier */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0B241A] mb-3">
              Documented Evidence Provenance ({opportunity.evidenceSources.length} Verified Sources)
            </h3>
            <div className="space-y-2.5">
              {opportunity.evidenceSources.map((source, idx) => (
                <div key={idx} className="p-3.5 bg-white border border-[#E8E4DC] rounded text-xs space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-[#0B241A]">{source.title}</span>
                    <span className="text-[#2C5E4B] font-mono text-[11px] whitespace-nowrap">
                      {source.type} · {source.date}
                    </span>
                  </div>
                  <div className="text-[#78716C]">
                    Issuer / Auditor: <span className="text-[#44403C]">{source.authorOrOrg}</span>
                  </div>
                  <div className="text-[#57534E] pt-1 border-t border-[#F4F1EA]">
                    {source.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unresolved Information Gaps */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              Unresolved Information Gaps (Explicit Disclosure)
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              In accordance with Atlas Sanctum Intellectual Honesty Standards, we do not conceal incomplete baseline information. The following items must be verified during on-site tranche diligence prior to capital disbursement:
            </p>
            <ul className="list-disc pl-5 text-xs text-amber-900 space-y-1">
              {opportunity.unresolvedGaps.map((gap, idx) => (
                <li key={idx}>{gap}</li>
              ))}
            </ul>
          </div>

          {/* Risks & Mitigations */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0B241A] mb-3">
              Risk Matrix & Identified Mitigations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {opportunity.keyRisks.map((risk, idx) => (
                <div key={idx} className="p-3 bg-white border border-[#E8E4DC] rounded text-xs space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#78716C]">
                    {risk.category} Risk
                  </div>
                  <div className="font-medium text-[#0B241A]">{risk.description}</div>
                  <div className="text-[#57534E] pt-1 border-t border-[#F4F1EA]">
                    <strong className="text-[#2C5E4B]">Mitigation:</strong> {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Governance */}
          <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg text-xs space-y-1">
            <div className="font-semibold text-[#0B241A] uppercase tracking-wider">
              Local Ownership & Community Participation
            </div>
            <div className="text-[#44403C]">
              Local Equity Stake: <strong className="text-[#0B241A]">{opportunity.localOwnershipPercentage}%</strong>
            </div>
            <p className="text-[#57534E] leading-relaxed">
              {opportunity.communityParticipationModel}
            </p>
          </div>

          {/* Thematic Regenerative Annotations Section */}
          <div className="p-5 bg-white border border-[#E8E4DC] rounded-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E4DC]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
                    Thematic Regenerative Annotations
                  </span>
                  <span className="px-2 py-0.5 bg-[#2C5E4B]/10 text-[#2C5E4B] text-[10px] font-mono rounded font-semibold">
                    {(opportunity.annotations || []).length} Attached
                  </span>
                </div>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Qualitative field observations, baseline findings, and community testimony tagged by thematic impact category.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
                className="px-3 py-1.5 bg-[#0B241A] text-white text-xs font-medium rounded hover:bg-[#13382C] transition-colors cursor-pointer shrink-0"
              >
                {isAddingAnnotation ? 'Cancel Annotation' : '+ Attach New Annotation'}
              </button>
            </div>

            {/* Interactive New Annotation Form */}
            {isAddingAnnotation && (
              <form onSubmit={handleAnnotationSubmit} className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
                  New Qualitative Regenerative Annotation
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1">
                      Thematic Impact Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ThematicImpactCategory)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-[#0B241A] font-medium focus:outline-none focus:border-[#0B241A]"
                    >
                      <option value="Soil Restoration">Soil Restoration</option>
                      <option value="Community Sovereignty">Community Sovereignty</option>
                      <option value="Aquifer & Watershed Protection">Aquifer & Watershed Protection</option>
                      <option value="Youth Employment & Continuity">Youth Employment & Continuity</option>
                      <option value="Clean Energy & Decentralization">Clean Energy & Decentralization</option>
                      <option value="Biodiversity Corridors">Biodiversity Corridors</option>
                      <option value="Circular Waste Biomass">Circular Waste Biomass</option>
                      <option value="Gender Equity & Land Agency">Gender Equity & Land Agency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1">
                      Evidence Provenance Tier *
                    </label>
                    <select
                      value={newEvidenceTier}
                      onChange={(e) => setNewEvidenceTier(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-[#0B241A] font-medium focus:outline-none focus:border-[#0B241A]"
                    >
                      <option value="Direct Field Observation">Direct Field Observation</option>
                      <option value="Audited Baseline Finding">Audited Baseline Finding</option>
                      <option value="Community Testimony">Community Testimony</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                      placeholder="e.g. Dr. Wanjiku Mwangi or Council Principal"
                      className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-[#0B241A] font-medium focus:outline-none focus:border-[#0B241A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1">
                      Author Role *
                    </label>
                    <select
                      value={newAuthorRole}
                      onChange={(e) => setNewAuthorRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-[#0B241A] font-medium focus:outline-none focus:border-[#0B241A]"
                    >
                      <option value="Principal Steward">Principal Steward</option>
                      <option value="Fiduciary Trustee">Fiduciary Trustee</option>
                      <option value="Investment Committee Lead">Investment Committee Lead</option>
                      <option value="Next-Gen Fellow">Next-Gen Fellow</option>
                      <option value="Field Auditor">Field Auditor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1">
                    Qualitative Observation & Ecological Findings *
                  </label>
                  <textarea
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter rigorous qualitative notes on soil microbiology, community governance dynamics, land tenure security, or local agency..."
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-[#0B241A] text-xs leading-relaxed focus:outline-none focus:border-[#0B241A]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAnnotation(false)}
                    className="px-3 py-1.5 text-xs text-[#57534E] hover:text-[#0B241A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C5E4B] text-white text-xs font-semibold rounded hover:bg-[#234b3c] transition-colors cursor-pointer"
                  >
                    Save & Attach Annotation
                  </button>
                </div>
              </form>
            )}

            {/* List of Existing Annotations */}
            {(!opportunity.annotations || opportunity.annotations.length === 0) ? (
              <div className="p-4 bg-[#FBF9F5] border border-dashed border-[#E8E4DC] rounded-lg text-center text-xs text-[#78716C]">
                No regenerative annotations attached yet. Use the button above to log the first qualitative field observation or community testimony.
              </div>
            ) : (
              <div className="space-y-3">
                {opportunity.annotations.map((ann) => (
                  <div key={ann.id} className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded-lg space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#0B241A] text-[#FBF9F5] text-[10px] font-mono uppercase tracking-wider rounded font-medium">
                          {ann.category}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 text-[10px] rounded font-medium">
                          {ann.evidenceTier}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#78716C]">
                        {ann.timestamp}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#292524] leading-relaxed italic bg-white p-3 border border-[#E8E4DC] rounded">
                      "{ann.note}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-1">
                      <span>
                        Recorded by: <strong className="text-[#0B241A]">{ann.authorName}</strong> ({ann.authorRole})
                      </span>
                      <span className="text-[#2C5E4B] font-mono font-medium">
                        ✓ Integrity Signed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E8E4DC] bg-[#F4F1EA]">
          <span className="text-xs text-[#78716C]">
            Independent decision-support dossier · Subject to physical on-site audit
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium uppercase text-[#57534E] hover:text-[#0B241A] transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
            {opportunity.status === 'Qualified' && onAddToBrief && (
              <button
                onClick={() => onAddToBrief(opportunity)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded transition-colors cursor-pointer ${
                  isShortlisted
                    ? 'bg-[#2C5E4B] text-white'
                    : 'bg-[#0B241A] text-[#FBF9F5] hover:bg-[#13382C]'
                }`}
              >
                {isShortlisted ? 'Included in Brief Shortlist' : 'Add to Allocation Brief'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
