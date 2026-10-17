import React, { useState } from 'react';
import { Opportunity } from '../types';

interface RciMatrixProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opportunity: Opportunity) => void;
}

export const RciMatrix: React.FC<RciMatrixProps> = ({ opportunities, onSelectOpportunity }) => {
  // Custom pillar weights (default equal 25% each)
  const [weights, setWeights] = useState({
    ecological: 25,
    governance: 25,
    financial: 25,
    additionality: 25
  });

  const totalWeight = weights.ecological + weights.governance + weights.financial + weights.additionality;

  const calculateCustomScore = (opp: Opportunity) => {
    if (opp.status === 'Excluded') return opp.rciScore; // Keep excluded static failure
    const raw = 
      (opp.rciPillars.ecologicalRegeneration / 25) * weights.ecological +
      (opp.rciPillars.institutionalGovernance / 25) * weights.governance +
      (opp.rciPillars.financialDurability / 25) * weights.financial +
      (opp.rciPillars.additionalityAndAgency / 25) * weights.additionality;
    return Math.round((raw / (totalWeight || 100)) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            The Decision Matrix
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Regenerative Capacity Index (RCI) Audit Framework
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            An evidence-based decision-support model separating financial risk, institutional quality, ecological restoration, and additionality. Transparent weighting, inspectable primary citations, and explicit penalties for missing baseline data.
          </p>
        </div>

        <div className="text-xs font-mono text-[#78716C]">
          <span>4 Audited Pillars</span>
          <span aria-hidden="true">·</span>
          <span>Zero Black-Box Imputation</span>
        </div>
      </div>

      {/* 4 Pillars Explanatory Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E8E4DC] rounded-lg space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
            01. Ecological Regeneration
          </div>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Soil organic carbon (SOC), living biodiversity corridors, aquifer recharge, and native species diversity measured via ground sensor telemetry.
          </p>
        </div>

        <div className="p-4 bg-white border border-[#E8E4DC] rounded-lg space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
            02. Institutional Governance
          </div>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Statutory NEMA compliance, tax regularity, documented FPIC community resolutions, board independence, and local community equity stakes.
          </p>
        </div>

        <div className="p-4 bg-white border border-[#E8E4DC] rounded-lg space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
            03. Financial Durability
          </div>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Multi-year audited cash flows, debt service coverage ratios (DSCR &gt; 1.5x), unit economics, export offtake contracts, and currency risk buffers.
          </p>
        </div>

        <div className="p-4 bg-white border border-[#E8E4DC] rounded-lg space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A]">
            04. Additionality & Agency
          </div>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Verification that outcomes would not occur under conventional predatory debt; empowerment of local producers and community self-determination.
          </p>
        </div>
      </div>

      {/* Interactive Sensitivity Weight Sliders */}
      <div className="p-6 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E4DC] pb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0B241A] block">
              Pillar Weight Calibration & Sensitivity Testing
            </span>
            <span className="text-xs text-[#78716C]">
              Adjust relative pillar weights to test how different institutional mandates alter composite rankings.
            </span>
          </div>
          <button
            onClick={() => setWeights({ ecological: 25, governance: 25, financial: 25, additionality: 25 })}
            className="text-xs font-semibold text-[#0B241A] hover:underline cursor-pointer"
          >
            Reset Equal (25% each)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div>
            <div className="flex justify-between text-[#57534E] mb-1">
              <span>Ecological Weight</span>
              <span className="font-mono font-semibold text-[#0B241A] tabular-nums">{weights.ecological}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={weights.ecological}
              onChange={(e) => setWeights({ ...weights, ecological: Number(e.target.value) })}
              className="w-full accent-[#0B241A]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[#57534E] mb-1">
              <span>Governance Weight</span>
              <span className="font-mono font-semibold text-[#0B241A] tabular-nums">{weights.governance}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={weights.governance}
              onChange={(e) => setWeights({ ...weights, governance: Number(e.target.value) })}
              className="w-full accent-[#0B241A]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[#57534E] mb-1">
              <span>Financial Durability Weight</span>
              <span className="font-mono font-semibold text-[#0B241A] tabular-nums">{weights.financial}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={weights.financial}
              onChange={(e) => setWeights({ ...weights, financial: Number(e.target.value) })}
              className="w-full accent-[#0B241A]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[#57534E] mb-1">
              <span>Additionality Weight</span>
              <span className="font-mono font-semibold text-[#0B241A] tabular-nums">{weights.additionality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={weights.additionality}
              onChange={(e) => setWeights({ ...weights, additionality: Number(e.target.value) })}
              className="w-full accent-[#0B241A]"
            />
          </div>
        </div>
      </div>

      {/* Comparative RCI Audit Table */}
      <div className="bg-white border border-[#E8E4DC] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E8E4DC] bg-[#F4F1EA] text-[#57534E] uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Opportunity Name</th>
                <th className="py-3 px-3 font-semibold">Sector & County</th>
                <th className="py-3 px-3 font-semibold text-center">Ecological (/25)</th>
                <th className="py-3 px-3 font-semibold text-center">Governance (/25)</th>
                <th className="py-3 px-3 font-semibold text-center">Financial (/25)</th>
                <th className="py-3 px-3 font-semibold text-center">Additionality (/25)</th>
                <th className="py-3 px-3 font-semibold text-center">Calibrated Score</th>
                <th className="py-3 px-3 font-semibold">Confidence Level</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {opportunities.map((opp) => {
                const score = calculateCustomScore(opp);
                const isExcluded = opp.status === 'Excluded';

                return (
                  <tr 
                    key={opp.id} 
                    className={`hover:bg-[#FBF9F5] transition-colors ${
                      isExcluded ? 'bg-red-50/40 text-red-900' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-[#0B241A]">
                      <div className="font-semibold text-sm">{opp.name}</div>
                      <div className="text-[11px] text-[#78716C]">{opp.readiness}</div>
                    </td>

                    <td className="py-3 px-3 text-[#57534E]">
                      <div>{opp.sector}</div>
                      <div className="text-[11px] text-[#78716C]">{opp.county}</div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-medium tabular-nums">
                      {opp.rciPillars.ecologicalRegeneration}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-medium tabular-nums">
                      {opp.rciPillars.institutionalGovernance}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-medium tabular-nums">
                      {opp.rciPillars.financialDurability}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-medium tabular-nums">
                      {opp.rciPillars.additionalityAndAgency}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold tabular-nums">
                      <span className={`px-2 py-1 rounded text-xs ${
                        isExcluded 
                          ? 'bg-red-200 text-red-900' 
                          : score >= 80 
                            ? 'bg-[#E8F3EE] text-[#13382C]' 
                            : 'bg-amber-100 text-amber-900'
                      }`}>
                        {score} / 100
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-medium block ${
                        isExcluded ? 'text-red-700 font-bold' : 'text-[#44403C]'
                      }`}>
                        {opp.confidenceLevel}
                      </span>
                      <span className="text-[10px] text-[#78716C]">
                        {opp.evidenceSources.length} Primary Sources
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectOpportunity(opp)}
                        className="px-3 py-1.5 text-[11px] font-semibold text-[#0B241A] hover:bg-[#E8E4DC] rounded transition-colors cursor-pointer"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Safeguard Callout */}
      <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg text-xs text-[#57534E] space-y-1">
        <div className="font-semibold text-[#0B241A] uppercase tracking-wider">
          Anti-Gaming & Conflict-of-Interest Safeguards
        </div>
        <p className="leading-relaxed">
          The RCI framework penalizes vanity metrics. Projects reporting voluminous self-generated PDF brochures receive zero score uplift unless paired with certified third-party hydrological logs, audited income statements, or county cooperative registry certifications. Missing data points are highlighted in amber alerts rather than mathematically imputed.
        </p>
      </div>
    </div>
  );
};
