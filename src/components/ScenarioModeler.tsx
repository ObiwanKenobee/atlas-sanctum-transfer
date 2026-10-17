import React, { useState } from 'react';
import { ALLOCATION_SCENARIOS } from '../data/opportunities';
import { AllocationScenario, LegacyMandate } from '../types';

interface ScenarioModelerProps {
  mandate: LegacyMandate;
  onSelectScenarioForBrief?: (scenario: AllocationScenario) => void;
}

export const ScenarioModeler: React.FC<ScenarioModelerProps> = ({ mandate, onSelectScenarioForBrief }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-b');
  const [customPreservation, setCustomPreservation] = useState<number>(40);
  const [customCommercial, setCustomCommercial] = useState<number>(40);
  const [customCatalytic, setCustomCatalytic] = useState<number>(20);

  const selectedScenario = ALLOCATION_SCENARIOS.find(s => s.id === selectedScenarioId) || ALLOCATION_SCENARIOS[1];

  // Capital pool in USD
  const pool = mandate.capitalPoolUsd;

  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            Capital Stewardship Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Scenario Allocation & Downside Modeling
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Compare allocation scenarios across capital preservation, commercial regenerative enterprise, and catalytic watershed infrastructure. Stress-test trade-offs against climate risk, local agency, and intergenerational cohesion.
          </p>
        </div>

        <div className="text-xs font-mono text-[#78716C]">
          <span>Portfolio Pool: ${(pool / 1000000).toFixed(0)}M USD</span>
          <span aria-hidden="true">·</span>
          <span>10–15 Year Horizon</span>
        </div>
      </div>

      {/* Scenario Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ALLOCATION_SCENARIOS.map((scenario) => {
          const isSelected = scenario.id === selectedScenarioId;
          return (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenarioId(scenario.id)}
              className={`p-6 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#0B241A] shadow-md ring-1 ring-[#0B241A]'
                  : 'bg-[#FBF9F5] border-[#E8E4DC] hover:border-[#2C5E4B]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716C]">
                    Scenario Model
                  </span>
                  {scenario.id === 'scen-b' && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2C5E4B] bg-[#E8F3EE] px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-serif font-semibold text-[#0B241A]">
                  {scenario.name.replace('Scenario ', '')}
                </h3>

                <p className="text-xs text-[#57534E] leading-relaxed">
                  {scenario.philosophy}
                </p>

                {/* Split Bars */}
                <div className="pt-2 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#78716C]">Offshore Liquid:</span>
                    <span className="font-semibold text-[#0B241A] tabular-nums">{scenario.preservationPercent}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#78716C]">East Africa Commercial:</span>
                    <span className="font-semibold text-[#0B241A] tabular-nums">{scenario.commercialEastAfricaPercent}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#78716C]">Catalytic / Blended:</span>
                    <span className="font-semibold text-[#2C5E4B] tabular-nums">{scenario.catalyticBlendedPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E4DC] flex items-center justify-between text-xs">
                <span className="text-[#78716C]">Expected Yield:</span>
                <span className="font-mono font-semibold text-[#0B241A]">{scenario.expectedAnnualReturn}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Selected Scenario Breakdown */}
      <div className="p-6 sm:p-8 bg-white border border-[#E8E4DC] rounded-lg shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2C5E4B] block">
              Active Strategy Evaluation
            </span>
            <h3 className="text-2xl font-serif font-medium text-[#0B241A]">
              {selectedScenario.name}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-[#78716C] block uppercase text-[10px]">Intergenerational Cohesion</span>
              <span className="text-lg font-bold text-[#0B241A] tabular-nums">
                {selectedScenario.intergenerationalAlignment} / 100
              </span>
            </div>
          </div>
        </div>

        {/* Narrative & Strategic Trade-offs */}
        <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs sm:text-sm text-[#44403C] leading-relaxed">
          <strong className="text-[#0B241A] block uppercase text-xs mb-1">Stewardship Architecture:</strong>
          {selectedScenario.narrative}
        </div>

        {/* Capital Allocation Bar */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A] mb-2">
            Capital Distribution: ${(pool / 1000000).toFixed(0)}M USD Total Pool
          </div>
          <div className="h-6 w-full rounded overflow-hidden flex text-white text-[11px] font-mono font-semibold">
            <div 
              style={{ width: `${selectedScenario.preservationPercent}%` }} 
              className="bg-[#292524] flex items-center justify-center"
              title="Offshore Liquid"
            >
              {selectedScenario.preservationPercent}%
            </div>
            <div 
              style={{ width: `${selectedScenario.commercialEastAfricaPercent}%` }} 
              className="bg-[#0B241A] flex items-center justify-center border-l border-white/20"
              title="East Africa Commercial"
            >
              {selectedScenario.commercialEastAfricaPercent}%
            </div>
            <div 
              style={{ width: `${selectedScenario.catalyticBlendedPercent}%` }} 
              className="bg-[#2C5E4B] flex items-center justify-center border-l border-white/20"
              title="Catalytic Blended"
            >
              {selectedScenario.catalyticBlendedPercent}%
            </div>
          </div>
          <div className="flex justify-between text-xs text-[#57534E] mt-2">
            <span>Offshore Liquid: ${(pool * selectedScenario.preservationPercent / 100000000).toFixed(1)}M</span>
            <span>Productive Ag & Energy: ${(pool * selectedScenario.commercialEastAfricaPercent / 100000000).toFixed(1)}M</span>
            <span>Watershed & Community: ${(pool * selectedScenario.catalyticBlendedPercent / 100000000).toFixed(1)}M</span>
          </div>
        </div>

        {/* Projections Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded">
            <span className="text-[#78716C] block uppercase text-[10px]">Expected 10-Yr Return</span>
            <span className="text-lg font-serif font-bold text-[#0B241A] mt-1 block">
              {selectedScenario.expectedAnnualReturn}
            </span>
            <span className="text-[10px] text-[#78716C]">Blended USD net</span>
          </div>

          <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded">
            <span className="text-[#78716C] block uppercase text-[10px]">Climate Shock Exposure</span>
            <span className={`text-lg font-serif font-bold mt-1 block ${
              selectedScenario.downsideClimateExposure === 'Low' ? 'text-[#2C5E4B]' : 'text-amber-800'
            }`}>
              {selectedScenario.downsideClimateExposure} Exposure
            </span>
            <span className="text-[10px] text-[#78716C]">Diversified across agro & energy</span>
          </div>

          <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded">
            <span className="text-[#78716C] block uppercase text-[10px]">Livelihoods Sustained</span>
            <span className="text-lg font-serif font-bold text-[#0B241A] mt-1 block tabular-nums">
              {selectedScenario.estimatedJobsSustained.toLocaleString()} Jobs
            </span>
            <span className="text-[10px] text-[#78716C]">Direct smallholder contracts</span>
          </div>

          <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded">
            <span className="text-[#78716C] block uppercase text-[10px]">Active Land Restored</span>
            <span className="text-lg font-serif font-bold text-[#0B241A] mt-1 block tabular-nums">
              {selectedScenario.estimatedHectaresProtected.toLocaleString()} Ha
            </span>
            <span className="text-[10px] text-[#78716C]">Agroforestry & riparian buffer</span>
          </div>
        </div>

        {/* Action Button */}
        {onSelectScenarioForBrief && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onSelectScenarioForBrief(selectedScenario)}
              className="px-5 py-2.5 bg-[#0B241A] text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-[#13382C] transition-colors cursor-pointer"
            >
              Apply This Scenario to Allocation Brief →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
