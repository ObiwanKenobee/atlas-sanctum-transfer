import React, { useState } from 'react';
import { DecisionRecord, Milestone, OutcomeIndicator, Opportunity, TeamMember } from '../types';

interface DecisionsAndOutcomesViewProps {
  decisions: DecisionRecord[];
  milestones: Milestone[];
  indicators: OutcomeIndicator[];
  opportunities: Opportunity[];
  teamMembers: TeamMember[];
  onAddDecision: (decision: DecisionRecord) => void;
  onUpdateMilestone: (milestoneId: string, progress: number, status: Milestone['status']) => void;
  currentMember: TeamMember;
}

export const DecisionsAndOutcomesView: React.FC<DecisionsAndOutcomesViewProps> = ({
  decisions,
  milestones,
  indicators,
  opportunities,
  teamMembers,
  onAddDecision,
  onUpdateMilestone,
  currentMember
}) => {
  const [activeTab, setActiveTab] = useState<'decisions' | 'milestones' | 'indicators'>('decisions');
  const [showNewDecisionModal, setShowNewDecisionModal] = useState<boolean>(false);

  // New Decision Form State
  const [newDecision, setNewDecision] = useState({
    opportunityId: opportunities[0]?.id || 'opp-01',
    type: 'Approved for Allocation' as DecisionRecord['type'],
    rationale: '',
    conditionsPrecedent: '1. On-site soil organic carbon core sample verification by independent auditor.\n2. Foreign exchange forward hedging agreement confirmed with Tier-1 bank.'
  });

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    const opp = opportunities.find(o => o.id === newDecision.opportunityId);
    if (!opp || !newDecision.rationale) return;

    const pseudoSig = 'sig-ecdsa-' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const created: DecisionRecord = {
      id: `dec-${Date.now().toString().slice(-4)}`,
      opportunityId: opp.id,
      opportunityName: opp.name,
      date: new Date().toISOString().split('T')[0],
      type: newDecision.type,
      rationale: newDecision.rationale,
      recordedBy: currentMember.name,
      votes: teamMembers.map(m => ({
        role: m.role,
        memberName: m.name,
        vote: newDecision.type.includes('Rejected') ? 'Reject' : 'Approve',
        comment: `Voted in favor of ${newDecision.type} in accordance with intergenerational mandate.`
      })),
      conditionsPrecedent: newDecision.conditionsPrecedent.split('\n').filter(Boolean),
      signatureHash: pseudoSig,
      status: 'Final'
    };

    onAddDecision(created);
    setShowNewDecisionModal(false);
    setNewDecision({
      opportunityId: opportunities[0]?.id || 'opp-01',
      type: 'Approved for Allocation',
      rationale: '',
      conditionsPrecedent: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            MVP Capabilities 06 & 07 · Decisions & Outcomes
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Governance Decision Records & Longitudinal Outcomes
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Preserve documented rationale, recorded committee votes, condition precedents, and execution milestones. Track baseline-to-target regenerative outcomes with independent ground-truth verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewDecisionModal(true)}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-[#0B241A] text-white rounded hover:bg-[#13382C] transition-colors cursor-pointer"
          >
            + Record Formal Decision
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8E4DC] text-xs">
        <button
          onClick={() => setActiveTab('decisions')}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'decisions'
              ? 'border-[#0B241A] text-[#0B241A]'
              : 'border-transparent text-[#78716C] hover:text-[#0B241A]'
          }`}
        >
          Decision Records ({decisions.length})
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'milestones'
              ? 'border-[#0B241A] text-[#0B241A]'
              : 'border-transparent text-[#78716C] hover:text-[#0B241A]'
          }`}
        >
          Implementation Milestones ({milestones.length})
        </button>
        <button
          onClick={() => setActiveTab('indicators')}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'indicators'
              ? 'border-[#0B241A] text-[#0B241A]'
              : 'border-transparent text-[#78716C] hover:text-[#0B241A]'
          }`}
        >
          Regenerative Outcome Indicators ({indicators.length})
        </button>
      </div>

      {/* Tab 1: Formal Decision Records */}
      {activeTab === 'decisions' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg text-xs text-[#57534E] leading-relaxed">
            <strong className="block text-[#0B241A] font-semibold uppercase mb-1">
              Fiduciary Decision Traceability (README Section 06)
            </strong>
            Every allocation, condition precedent, and rejection is permanently archived with recorded council votes, dissenting rationale, and cryptographic signatures.
          </div>

          <div className="space-y-6">
            {decisions.map((dec) => {
              const isApproved = dec.type.includes('Approved');
              const isRejected = dec.type.includes('Rejected');

              return (
                <div key={dec.id} className="p-6 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E4DC] pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#78716C]">
                        <span>{dec.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>Recorded by {dec.recordedBy}</span>
                      </div>
                      <h4 className="text-xl font-serif font-semibold text-[#0B241A]">
                        {dec.opportunityName}
                      </h4>
                    </div>

                    <span className={`text-xs px-3 py-1 rounded font-semibold uppercase tracking-wider ${
                      isApproved 
                        ? 'bg-[#E8F3EE] text-[#13382C]' 
                        : isRejected 
                          ? 'bg-red-100 text-red-900' 
                          : 'bg-amber-100 text-amber-900'
                    }`}>
                      {dec.type}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase text-[#0B241A] tracking-wider block">
                      Committee Rationale & Alignment Finding:
                    </span>
                    <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed bg-[#FBF9F5] p-3.5 border border-[#E8E4DC] rounded">
                      {dec.rationale}
                    </p>
                  </div>

                  {dec.conditionsPrecedent.length > 0 && (
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1">
                      <span className="font-semibold text-amber-950 uppercase tracking-wider block">
                        Mandatory Conditions Precedent Before Disbursement:
                      </span>
                      <ul className="list-disc pl-5 text-amber-900 space-y-1">
                        {dec.conditionsPrecedent.map((cond, i) => (
                          <li key={i}>{cond}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recorded Committee Member Votes */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold uppercase text-[#0B241A] tracking-wider block">
                      Recorded Council Votes & Signed Comments:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {dec.votes.map((vote, i) => (
                        <div key={i} className="p-3 bg-[#F4F1EA] border border-[#E8E4DC] rounded space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#0B241A]">{vote.memberName} ({vote.role})</span>
                            <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                              vote.vote === 'Approve' ? 'bg-[#E8F3EE] text-[#13382C]' : 'bg-red-200 text-red-900'
                            }`}>
                              {vote.vote}
                            </span>
                          </div>
                          <p className="text-[#57534E] text-[11px] italic">
                            "{vote.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between text-[11px] font-mono text-[#78716C]">
                    <span>Signature Verification: {dec.signatureHash}</span>
                    <span className="text-[#2C5E4B] font-semibold">Immutable Record Signed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Implementation Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((ms) => {
              const opp = opportunities.find(o => o.id === ms.opportunityId);
              return (
                <div key={ms.id} className="p-5 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#2C5E4B] font-semibold">{ms.targetQuarter}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ms.status === 'Completed & Verified'
                          ? 'bg-[#E8F3EE] text-[#13382C]'
                          : ms.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'bg-amber-100 text-amber-900'
                      }`}>
                        {ms.status}
                      </span>
                    </div>

                    <h4 className="font-serif font-semibold text-base text-[#0B241A] leading-snug">
                      {ms.title}
                    </h4>

                    {opp && (
                      <div className="text-xs text-[#78716C]">
                        Asset: <span className="text-[#44403C] font-medium">{opp.name}</span>
                      </div>
                    )}

                    {ms.verifiedBy && (
                      <div className="text-[11px] text-[#2C5E4B] font-medium pt-1">
                        ✓ Verified by {ms.verifiedBy}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar & Slider */}
                  <div className="space-y-2 pt-2 border-t border-[#F4F1EA]">
                    <div className="flex justify-between text-xs font-mono text-[#57534E]">
                      <span>Progress</span>
                      <span className="font-bold text-[#0B241A]">{ms.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E8E4DC] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0B241A] rounded-full transition-all"
                        style={{ width: `${ms.progressPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onUpdateMilestone(
                          ms.id,
                          Math.min(100, ms.progressPercent + 25),
                          ms.progressPercent + 25 >= 100 ? 'Completed & Verified' : 'In Progress'
                        )}
                        className="text-[11px] font-semibold text-[#0B241A] hover:underline cursor-pointer"
                      >
                        + Advance (+25%)
                      </button>
                      {ms.progressPercent === 100 && (
                        <span className="text-[10px] uppercase font-mono text-[#2C5E4B] font-bold">Tranche Gate Cleared</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Regenerative Outcome Indicators */}
      {activeTab === 'indicators' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indicators.map((ind) => {
              const opp = opportunities.find(o => o.id === ind.opportunityId);
              const progressRatio = Math.min(1, Math.max(0, (ind.currentValue - ind.baselineValue) / (ind.targetValue - ind.baselineValue)));
              const progressPct = Math.round(progressRatio * 100);

              return (
                <div key={ind.id} className="p-6 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-[#2C5E4B] uppercase tracking-wider font-semibold">
                        {opp?.name || 'Regenerative Asset'}
                      </span>
                      <h4 className="text-lg font-serif font-semibold text-[#0B241A] mt-0.5">
                        {ind.metricName}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-[#78716C]">
                      Updated: {ind.lastUpdated}
                    </span>
                  </div>

                  {/* 3 Metrics (Baseline, Target, Current) */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs text-center font-mono">
                    <div>
                      <span className="text-[#78716C] block uppercase text-[9px]">Baseline</span>
                      <span className="font-semibold text-sm text-[#57534E] tabular-nums">{ind.baselineValue}</span>
                      <span className="text-[10px] text-[#78716C] block">{ind.unit}</span>
                    </div>
                    <div className="border-x border-[#E8E4DC]">
                      <span className="text-[#78716C] block uppercase text-[9px]">Current Result</span>
                      <span className="font-bold text-sm text-[#0B241A] tabular-nums">{ind.currentValue}</span>
                      <span className="text-[10px] text-[#2C5E4B] font-semibold block">{ind.unit}</span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block uppercase text-[9px]">Target</span>
                      <span className="font-semibold text-sm text-[#2C5E4B] tabular-nums">{ind.targetValue}</span>
                      <span className="text-[10px] text-[#78716C] block">{ind.unit}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[#57534E]">
                      <span>Outcome Target Realization:</span>
                      <span className="font-mono font-bold text-[#0B241A]">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#E8E4DC] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2C5E4B] rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-[#78716C] pt-2 border-t border-[#F4F1EA]">
                    Ground-Truth Methodology: <span className="text-[#44403C] font-medium">{ind.verificationMethod}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Formal Decision Modal */}
      {showNewDecisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B241A]/70 backdrop-blur-xs">
          <div className="bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif font-semibold text-lg text-[#0B241A]">
                Record Formal Committee Decision
              </h3>
              <button
                onClick={() => setShowNewDecisionModal(false)}
                className="text-[#78716C] hover:text-[#0B241A] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDecision} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium uppercase text-[#57534E] mb-1">
                  Candidate Opportunity
                </label>
                <select
                  value={newDecision.opportunityId}
                  onChange={(e) => setNewDecision({ ...newDecision, opportunityId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-sm text-[#0B241A] focus:outline-none"
                >
                  {opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>{opp.name} ({opp.sector})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium uppercase text-[#57534E] mb-1">
                  Decision Type
                </label>
                <select
                  value={newDecision.type}
                  onChange={(e) => setNewDecision({ ...newDecision, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-xs text-[#0B241A] focus:outline-none"
                >
                  <option value="Approved for Allocation">Approved for Allocation</option>
                  <option value="Conditional Approval with Precedent Gates">Conditional Approval with Precedent Gates</option>
                  <option value="Rejected / Integrity Exclusion">Rejected / Integrity Exclusion</option>
                  <option value="Deferred for Telemetry">Deferred for Telemetry</option>
                </select>
              </div>

              <div>
                <label className="block font-medium uppercase text-[#57534E] mb-1">
                  Investment Committee Rationale & Mandate Alignment
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the family values, risk evaluation, and evidence justification..."
                  value={newDecision.rationale}
                  onChange={(e) => setNewDecision({ ...newDecision, rationale: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-xs text-[#0B241A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium uppercase text-[#57534E] mb-1">
                  Mandatory Conditions Precedent (One per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1. Legal title escrow receipt&#10;2. Third-party soil carbon test"
                  value={newDecision.conditionsPrecedent}
                  onChange={(e) => setNewDecision({ ...newDecision, conditionsPrecedent: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-xs text-[#0B241A] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4DC]">
                <button
                  type="button"
                  onClick={() => setShowNewDecisionModal(false)}
                  className="px-4 py-2 uppercase text-[#78716C] hover:text-[#0B241A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B241A] text-white uppercase font-medium rounded hover:bg-[#13382C] cursor-pointer"
                >
                  Sign & Execute Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
