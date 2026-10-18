import React, { useState } from 'react';
import { ALLOCATION_SCENARIOS } from '../data/opportunities';
import { AllocationScenario, LegacyMandate } from '../types';
import { MonteCarloSimulation } from './MonteCarloSimulation';

interface ScenarioModelerProps {
  mandate: LegacyMandate;
  onSelectScenarioForBrief?: (scenario: AllocationScenario) => void;
}

export const ScenarioModeler: React.FC<ScenarioModelerProps> = ({ mandate, onSelectScenarioForBrief }) => {
  const [viewMode, setViewMode] = useState<'compare' | 'monte-carlo' | 'individual'>('compare');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-b');
  
  // Side-by-side comparison state
  const [scenarioAId, setScenarioAId] = useState<string>('scen-a'); // Baseline: Defensive Heritage
  const [scenarioBId, setScenarioBId] = useState<string>('scen-b'); // Comparison: Catalytic Regenerative Growth

  const selectedScenario = ALLOCATION_SCENARIOS.find(s => s.id === selectedScenarioId) || ALLOCATION_SCENARIOS[1];
  const scenarioA = ALLOCATION_SCENARIOS.find(s => s.id === scenarioAId) || ALLOCATION_SCENARIOS[0];
  const scenarioB = ALLOCATION_SCENARIOS.find(s => s.id === scenarioBId) || ALLOCATION_SCENARIOS[1];

  // Capital pool in USD
  const pool = mandate.capitalPoolUsd;

  // Helper to parse return rate percentage as a number
  const parseRate = (str: string) => {
    const match = str.match(/([0-9.]+)/);
    return match ? parseFloat(match[1]) : 5.0;
  };

  const rateA = parseRate(scenarioA.expectedAnnualReturn);
  const rateB = parseRate(scenarioB.expectedAnnualReturn);

  // 10-Year Compound Value calculation: FV = PV * (1 + r)^10
  const futureValA = pool * Math.pow(1 + rateA / 100, 10);
  const futureValB = pool * Math.pow(1 + rateB / 100, 10);
  const futureValDelta = futureValB - futureValA;

  // Outcome variances
  const jobsDelta = scenarioB.estimatedJobsSustained - scenarioA.estimatedJobsSustained;
  const hectaresDelta = scenarioB.estimatedHectaresProtected - scenarioA.estimatedHectaresProtected;
  const cohesionDelta = scenarioB.intergenerationalAlignment - scenarioA.intergenerationalAlignment;
  const yieldDelta = (rateB - rateA).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            Capital Stewardship Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Scenario Allocation & Side-by-Side Comparison
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Compare allocation scenarios across capital preservation, commercial regenerative enterprise, and catalytic watershed infrastructure. Stress-test trade-offs against climate risk, local agency, and intergenerational cohesion.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-[#F4F1EA] border border-[#E8E4DC] rounded text-xs">
            <button
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1.5 font-medium rounded transition-colors cursor-pointer ${
                viewMode === 'compare'
                  ? 'bg-white text-[#0B241A] shadow-xs font-semibold'
                  : 'text-[#57534E] hover:text-[#0B241A]'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setViewMode('monte-carlo')}
              className={`px-3 py-1.5 font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'monte-carlo'
                  ? 'bg-white text-[#0B241A] shadow-xs font-semibold'
                  : 'text-[#57534E] hover:text-[#0B241A]'
              }`}
            >
              <span>Monte Carlo Simulator</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E4B]"></span>
            </button>
            <button
              onClick={() => setViewMode('individual')}
              className={`px-3 py-1.5 font-medium rounded transition-colors cursor-pointer ${
                viewMode === 'individual'
                  ? 'bg-white text-[#0B241A] shadow-xs font-semibold'
                  : 'text-[#57534E] hover:text-[#0B241A]'
              }`}
            >
              Single Scenario Focus
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Side-by-Side Comparison */}
      {viewMode === 'compare' && (
        <div className="space-y-8">
          {/* Dual Scenario Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F4F1EA] p-4 rounded-xl border border-[#E8E4DC]">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1.5">
                Baseline Strategy (Scenario 1)
              </label>
              <select
                value={scenarioAId}
                onChange={(e) => setScenarioAId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E8E4DC] rounded text-[#0B241A] font-medium focus:outline-none focus:border-[#0B241A]"
              >
                {ALLOCATION_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1.5">
                Comparison Strategy (Scenario 2)
              </label>
              <select
                value={scenarioBId}
                onChange={(e) => setScenarioBId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E8E4DC] rounded text-[#0B241A] font-medium focus:outline-none focus:border-[#0B241A]"
              >
                {ALLOCATION_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Variance Executive Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#78716C] block">Annual Yield Variance</span>
              <div className="text-xl font-mono font-bold text-[#0B241A]">
                {parseFloat(yieldDelta) >= 0 ? `+${yieldDelta}%` : `${yieldDelta}%`}
              </div>
              <span className="text-[11px] text-[#78716C] block">
                {scenarioA.expectedAnnualReturn} → {scenarioB.expectedAnnualReturn}
              </span>
            </div>

            <div className="p-4 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#78716C] block">10-Yr Portfolio Growth</span>
              <div className="text-xl font-mono font-bold text-[#2C5E4B] tabular-nums">
                {futureValDelta >= 0 ? `+$${(futureValDelta / 1000000).toFixed(1)}M` : `-$${(Math.abs(futureValDelta) / 1000000).toFixed(1)}M`}
              </div>
              <span className="text-[11px] text-[#78716C] block">
                ${(futureValA / 1000000).toFixed(1)}M → ${(futureValB / 1000000).toFixed(1)}M
              </span>
            </div>

            <div className="p-4 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#78716C] block">Livelihoods Created</span>
              <div className="text-xl font-mono font-bold text-[#0B241A] tabular-nums">
                {jobsDelta >= 0 ? `+${jobsDelta.toLocaleString()}` : jobsDelta.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#78716C] block">
                {scenarioA.estimatedJobsSustained.toLocaleString()} → {scenarioB.estimatedJobsSustained.toLocaleString()} families
              </span>
            </div>

            <div className="p-4 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#78716C] block">Land Restored</span>
              <div className="text-xl font-mono font-bold text-[#2C5E4B] tabular-nums">
                {hectaresDelta >= 0 ? `+${hectaresDelta.toLocaleString()} Ha` : `${hectaresDelta.toLocaleString()} Ha`}
              </div>
              <span className="text-[11px] text-[#78716C] block">
                {scenarioA.estimatedHectaresProtected.toLocaleString()} → {scenarioB.estimatedHectaresProtected.toLocaleString()} Ha
              </span>
            </div>
          </div>

          {/* Side-by-Side Dual Matrix Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Column 1: Scenario A */}
            <div className="p-6 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-6">
              <div className="border-b border-[#E8E4DC] pb-4 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#78716C] tracking-widest">
                  Baseline (Scenario 1)
                </span>
                <h3 className="text-xl font-serif font-bold text-[#0B241A]">
                  {scenarioA.name}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {scenarioA.philosophy}
                </p>
              </div>

              {/* Asset Allocation Split */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase text-[#0B241A] tracking-wider block">
                  Capital Allocation Split (${(pool / 1000000).toFixed(0)}M Total Pool)
                </span>
                <div className="h-5 w-full rounded overflow-hidden flex text-white text-[10px] font-mono font-semibold">
                  <div style={{ width: `${scenarioA.preservationPercent}%` }} className="bg-[#292524] flex items-center justify-center">
                    {scenarioA.preservationPercent}%
                  </div>
                  <div style={{ width: `${scenarioA.commercialEastAfricaPercent}%` }} className="bg-[#0B241A] flex items-center justify-center border-l border-white/20">
                    {scenarioA.commercialEastAfricaPercent}%
                  </div>
                  <div style={{ width: `${scenarioA.catalyticBlendedPercent}%` }} className="bg-[#2C5E4B] flex items-center justify-center border-l border-white/20">
                    {scenarioA.catalyticBlendedPercent}%
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-[#57534E]">
                  <span>Offshore: ${(pool * scenarioA.preservationPercent / 100000000).toFixed(1)}M</span>
                  <span>Productive: ${(pool * scenarioA.commercialEastAfricaPercent / 100000000).toFixed(1)}M</span>
                  <span>Catalytic: ${(pool * scenarioA.catalyticBlendedPercent / 100000000).toFixed(1)}M</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded">
                  <span className="text-[#78716C] block uppercase text-[10px]">Expected Annual Return</span>
                  <span className="font-semibold text-sm text-[#0B241A]">{scenarioA.expectedAnnualReturn}</span>
                </div>
                <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded">
                  <span className="text-[#78716C] block uppercase text-[10px]">Downside Climate Risk</span>
                  <span className="font-semibold text-sm text-[#0B241A]">{scenarioA.downsideClimateExposure} Exposure</span>
                </div>
                <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded">
                  <span className="text-[#78716C] block uppercase text-[10px]">Smallholder Livelihoods</span>
                  <span className="font-semibold text-sm text-[#0B241A] tabular-nums">{scenarioA.estimatedJobsSustained.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded">
                  <span className="text-[#78716C] block uppercase text-[10px]">Intergenerational Alignment</span>
                  <span className="font-semibold text-sm text-[#0B241A] tabular-nums">{scenarioA.intergenerationalAlignment} / 100</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs text-[#57534E] leading-relaxed">
                <strong className="text-[#0B241A] block mb-1">Strategic Rationale:</strong>
                {scenarioA.narrative}
              </div>

              {onSelectScenarioForBrief && (
                <button
                  onClick={() => onSelectScenarioForBrief(scenarioA)}
                  className="w-full py-2 bg-white border border-[#0B241A] text-[#0B241A] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                >
                  Apply {scenarioA.name.replace('Scenario ', '')} to Brief
                </button>
              )}
            </div>

            {/* Column 2: Scenario B */}
            <div className="p-6 bg-white border-2 border-[#2C5E4B] rounded-xl shadow-md space-y-6 relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-[#E8F3EE] text-[#13382C] text-[10px] font-mono font-bold uppercase rounded">
                Active Alternative
              </div>

              <div className="border-b border-[#E8E4DC] pb-4 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#2C5E4B] tracking-widest">
                  Comparison (Scenario 2)
                </span>
                <h3 className="text-xl font-serif font-bold text-[#0B241A]">
                  {scenarioB.name}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {scenarioB.philosophy}
                </p>
              </div>

              {/* Asset Allocation Split */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase text-[#0B241A] tracking-wider block">
                  Capital Allocation Split (${(pool / 1000000).toFixed(0)}M Total Pool)
                </span>
                <div className="h-5 w-full rounded overflow-hidden flex text-white text-[10px] font-mono font-semibold">
                  <div style={{ width: `${scenarioB.preservationPercent}%` }} className="bg-[#292524] flex items-center justify-center">
                    {scenarioB.preservationPercent}%
                  </div>
                  <div style={{ width: `${scenarioB.commercialEastAfricaPercent}%` }} className="bg-[#0B241A] flex items-center justify-center border-l border-white/20">
                    {scenarioB.commercialEastAfricaPercent}%
                  </div>
                  <div style={{ width: `${scenarioB.catalyticBlendedPercent}%` }} className="bg-[#2C5E4B] flex items-center justify-center border-l border-white/20">
                    {scenarioB.catalyticBlendedPercent}%
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-[#57534E]">
                  <span>Offshore: ${(pool * scenarioB.preservationPercent / 100000000).toFixed(1)}M</span>
                  <span>Productive: ${(pool * scenarioB.commercialEastAfricaPercent / 100000000).toFixed(1)}M</span>
                  <span>Catalytic: ${(pool * scenarioB.catalyticBlendedPercent / 100000000).toFixed(1)}M</span>
                </div>
              </div>

              {/* Metrics Grid with Delta Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#E8F3EE]/50 border border-[#2C5E4B]/30 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-[#78716C] uppercase text-[10px]">Expected Annual Return</span>
                    <span className="font-mono text-[10px] font-bold text-[#2C5E4B]">
                      {parseFloat(yieldDelta) >= 0 ? `+${yieldDelta}%` : `${yieldDelta}%`}
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-[#0B241A] block mt-0.5">{scenarioB.expectedAnnualReturn}</span>
                </div>

                <div className="p-3 bg-[#E8F3EE]/50 border border-[#2C5E4B]/30 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-[#78716C] uppercase text-[10px]">Downside Climate Risk</span>
                  </div>
                  <span className="font-semibold text-sm text-[#0B241A] block mt-0.5">{scenarioB.downsideClimateExposure} Exposure</span>
                </div>

                <div className="p-3 bg-[#E8F3EE]/50 border border-[#2C5E4B]/30 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-[#78716C] uppercase text-[10px]">Smallholder Livelihoods</span>
                    <span className="font-mono text-[10px] font-bold text-[#2C5E4B]">
                      {jobsDelta >= 0 ? `+${jobsDelta}` : jobsDelta}
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-[#0B241A] tabular-nums block mt-0.5">{scenarioB.estimatedJobsSustained.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-[#E8F3EE]/50 border border-[#2C5E4B]/30 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-[#78716C] uppercase text-[10px]">Intergenerational Alignment</span>
                    <span className="font-mono text-[10px] font-bold text-[#2C5E4B]">
                      {cohesionDelta >= 0 ? `+${cohesionDelta} pts` : `${cohesionDelta} pts`}
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-[#0B241A] tabular-nums block mt-0.5">{scenarioB.intergenerationalAlignment} / 100</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs text-[#57534E] leading-relaxed">
                <strong className="text-[#0B241A] block mb-1">Strategic Rationale:</strong>
                {scenarioB.narrative}
              </div>

              {onSelectScenarioForBrief && (
                <button
                  onClick={() => onSelectScenarioForBrief(scenarioB)}
                  className="w-full py-2.5 bg-[#0B241A] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#13382C] transition-colors cursor-pointer shadow-sm"
                >
                  Apply {scenarioB.name.replace('Scenario ', '')} to Brief →
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Mode 2: Monte Carlo Simulation */}
      {viewMode === 'monte-carlo' && (
        <MonteCarloSimulation
          mandate={mandate}
          onSelectScenarioForBrief={onSelectScenarioForBrief}
        />
      )}

      {/* Mode 3: Individual Scenario Focus */}
      {viewMode === 'individual' && (
        <div className="space-y-6">
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

            <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs sm:text-sm text-[#44403C] leading-relaxed">
              <strong className="text-[#0B241A] block uppercase text-xs mb-1">Stewardship Architecture:</strong>
              {selectedScenario.narrative}
            </div>

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
      )}
    </div>
  );
};
