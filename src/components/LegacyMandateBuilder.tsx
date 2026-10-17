import React, { useState } from 'react';
import { LegacyMandate, Opportunity } from '../types';

interface LegacyMandateBuilderProps {
  mandate: LegacyMandate;
  onUpdateMandate: (mandate: LegacyMandate) => void;
  opportunities: Opportunity[];
  onOpenBrief: () => void;
}

export const LegacyMandateBuilder: React.FC<LegacyMandateBuilderProps> = ({
  mandate,
  onUpdateMandate,
  opportunities,
  onOpenBrief
}) => {
  const [formData, setFormData] = useState<LegacyMandate>(mandate);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleChange = <K extends keyof LegacyMandate>(key: K, value: LegacyMandate[K]) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onUpdateMandate(updated);
  };

  const handleToggleExclusion = (exclusion: string) => {
    const current = [...formData.ethicalExclusions];
    const index = current.indexOf(exclusion);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(exclusion);
    }
    handleChange('ethicalExclusions', current);
  };

  const standardExclusions = [
    'Extractive fossil fuel exploration',
    'Speculative blockchain carbon tokens',
    'Industrial mono-cropping reliant on synthetic pesticides',
    'Land projects lacking documented FPIC community consent',
    'Weapons, armaments or paramilitary security contractors',
    'Unregulated commercial deep-sea trawling'
  ];

  // Dynamic matching score against qualified opportunities
  const matchingProjects = opportunities.filter(opp => {
    if (opp.status !== 'Qualified') return false;
    return true;
  });

  const handleSave = () => {
    onUpdateMandate(formData);
    setSaveStatus('Mandate saved to active session. Ready to generate Allocation Brief.');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            The Legacy Mandate
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Intergenerational Capital Stewardship Framework
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Formalize your family council or institutional mandate into an explicit, reviewable architecture. Translate family values, risk constraints, intergenerational governance, and regenerative criteria into an auditable covenant.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-[#0B241A] text-white rounded hover:bg-[#13382C] transition-colors cursor-pointer"
          >
            Save Mandate
          </button>
          <button
            onClick={onOpenBrief}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-[#2C5E4B] text-white rounded hover:bg-[#1E4536] transition-colors cursor-pointer"
          >
            Review Allocation Brief →
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-[#E8F3EE] border border-[#2C5E4B]/30 rounded text-xs text-[#13382C] font-medium">
          {saveStatus}
        </div>
      )}

      {/* Main Form & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Specification Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Family & Stage */}
          <div className="p-6 bg-white border border-[#E8E4DC] rounded-lg space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A] border-b border-[#F4F1EA] pb-2">
              01. Family Council & Succession Stage
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase mb-1">
                  Family / Foundation Entity Name
                </label>
                <input
                  type="text"
                  value={formData.familyName}
                  onChange={(e) => handleChange('familyName', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E8E4DC] rounded text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase mb-1">
                  Generational Transition Stage
                </label>
                <select
                  value={formData.generationStage}
                  onChange={(e) => handleChange('generationStage', e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E8E4DC] rounded text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                >
                  <option value="First Generation (Wealth Creators)">First Generation (Founding Wealth Creators)</option>
                  <option value="Second Generation (Transition in Progress)">Second Generation (Transition in Progress)</option>
                  <option value="Multi-Generational Stewardship Council">Multi-Generational Stewardship Council (Gen 2/3)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase mb-1">
                  Total Stewardship Capital Pool (USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5000000"
                    max="100000000"
                    step="5000000"
                    value={formData.capitalPoolUsd}
                    onChange={(e) => handleChange('capitalPoolUsd', Number(e.target.value))}
                    className="w-full accent-[#0B241A]"
                  />
                  <span className="text-sm font-mono font-semibold text-[#0B241A] shrink-0 tabular-nums">
                    ${(formData.capitalPoolUsd / 1000000).toFixed(0)}M
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase mb-1">
                  Stewardship Time Horizon (Years)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={formData.timeHorizonYears}
                    onChange={(e) => handleChange('timeHorizonYears', Number(e.target.value))}
                    className="w-full accent-[#0B241A]"
                  />
                  <span className="text-sm font-mono font-semibold text-[#0B241A] shrink-0 tabular-nums">
                    {formData.timeHorizonYears} Yrs
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Allocation Split & Financial Constraints */}
          <div className="p-6 bg-white border border-[#E8E4DC] rounded-lg space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A] border-b border-[#F4F1EA] pb-2">
              02. Capital Structure & Return Mandate
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#57534E] uppercase">
                  Commercial Productive Investments: <strong className="text-[#0B241A] font-mono">{100 - formData.philanthropicSplit}%</strong>
                </span>
                <span className="text-[#57534E] uppercase">
                  Concessionary & Philanthropic Grants: <strong className="text-[#2C5E4B] font-mono">{formData.philanthropicSplit}%</strong>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={formData.philanthropicSplit}
                onChange={(e) => handleChange('philanthropicSplit', Number(e.target.value))}
                className="w-full accent-[#0B241A]"
              />
              <p className="text-[11px] text-[#78716C] italic">
                A blended structure allows commercial productive cash flows from agriculture and energy to subsidize long-term community watershed and land restoration trusts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase mb-1">
                  Primary Regenerative Mission
                </label>
                <select
                  value={formData.primaryMission}
                  onChange={(e) => handleChange('primaryMission', e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E8E4DC] rounded text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                >
                  <option value="Ecological Restoration & Food Sovereignty">Ecological Restoration & Food Sovereignty</option>
                  <option value="Decentralized Productive Infrastructure">Decentralized Productive Infrastructure</option>
                  <option value="Youth Employment & Enterprise Continuity">Youth Employment & Enterprise Continuity</option>
                  <option value="Holistic Landscape Stewardship">Holistic Landscape Stewardship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase mb-1">
                  Target Portfolio Yield (USD Net)
                </label>
                <input
                  type="text"
                  value={formData.targetAnnualReturn}
                  onChange={(e) => handleChange('targetAnnualReturn', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E8E4DC] rounded text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Ethical Exclusions & Red Lines */}
          <div className="p-6 bg-white border border-[#E8E4DC] rounded-lg space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A] border-b border-[#F4F1EA] pb-2">
              03. Ethical Exclusions & Red Lines
            </h3>
            <p className="text-xs text-[#57534E]">
              Select non-negotiable boundaries. Opportunities violating these criteria will be automatically rejected during Atlas Sanctum screening.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {standardExclusions.map((item) => {
                const isSelected = formData.ethicalExclusions.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleExclusion(item)}
                    className={`p-3 text-left rounded border text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-[#0B241A] bg-[#F4F1EA] text-[#0B241A] font-medium'
                        : 'border-[#E8E4DC] bg-white text-[#78716C] hover:border-[#A8A29E]'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 mt-0.5 rounded-xs flex items-center justify-center text-[10px] shrink-0 ${
                      isSelected ? 'bg-[#0B241A] text-white' : 'border border-[#A8A29E]'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Governance & Next-Gen Participation */}
          <div className="p-6 bg-white border border-[#E8E4DC] rounded-lg space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A] border-b border-[#F4F1EA] pb-2">
              04. Governance, Decision Rights & Next-Gen Roles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase mb-1">
                  Family Council Voting Model
                </label>
                <select
                  value={formData.decisionGovernance}
                  onChange={(e) => handleChange('decisionGovernance', e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E8E4DC] rounded text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                >
                  <option value="Unanimous Family Council">Unanimous Family Council (All generations agree)</option>
                  <option value="Stewardship Committee Majority">Stewardship Committee Majority (2/3 majority vote)</option>
                  <option value="Independent Fiduciary + Family Veto">Independent Fiduciary + Family Veto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase mb-1">
                  Next-Gen Participation Protocol
                </label>
                <select
                  value={formData.nextGenParticipationRole}
                  onChange={(e) => handleChange('nextGenParticipationRole', e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E8E4DC] rounded text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                >
                  <option value="Co-Principal Decision Maker">Co-Principal Decision Maker (Equal vote with founders)</option>
                  <option value="Active Due Diligence Fellow">Active Due Diligence Fellow (Conducts site audits)</option>
                  <option value="Philanthropic Envelope Chair">Philanthropic Envelope Chair (Leads catalytic grant tranche)</option>
                  <option value="Board Observer">Board Observer (Non-voting mentorship path)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right Mandate Summary & Matching Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg space-y-5 sticky top-24">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A] border-b border-[#E8E4DC] pb-2">
              Mandate Summary Digest
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#78716C] block uppercase text-[10px]">Stewardship Entity</span>
                <span className="font-serif text-base font-semibold text-[#0B241A]">{formData.familyName}</span>
              </div>

              <div>
                <span className="text-[#78716C] block uppercase text-[10px]">Allocable Capital</span>
                <span className="font-mono text-base font-semibold text-[#0B241A]">
                  ${(formData.capitalPoolUsd / 1000000).toFixed(0)}M USD over {formData.timeHorizonYears} Years
                </span>
              </div>

              <div className="pt-2 border-t border-[#E8E4DC]">
                <span className="text-[#78716C] block uppercase text-[10px]">Capital Split</span>
                <div className="flex justify-between font-mono font-medium text-[#0B241A] mt-1">
                  <span>Productive: {100 - formData.philanthropicSplit}%</span>
                  <span>Catalytic: {formData.philanthropicSplit}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8E4DC]">
                <span className="text-[#78716C] block uppercase text-[10px]">Active Exclusions</span>
                <span className="font-medium text-[#0B241A]">{formData.ethicalExclusions.length} Red Lines Enforced</span>
              </div>

              <div className="pt-2 border-t border-[#E8E4DC]">
                <span className="text-[#78716C] block uppercase text-[10px]">Matching Pipeline</span>
                <span className="font-semibold text-[#2C5E4B]">
                  {matchingProjects.length} Verified East Africa Opportunities Match
                </span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenBrief}
                className="w-full py-2.5 px-4 bg-[#0B241A] text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-[#13382C] transition-colors cursor-pointer text-center"
              >
                Compile Allocation Brief →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
