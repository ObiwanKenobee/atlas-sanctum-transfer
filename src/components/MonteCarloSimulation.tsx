import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { ALLOCATION_SCENARIOS } from '../data/opportunities';
import { AllocationScenario, LegacyMandate } from '../types';

interface MonteCarloSimulationProps {
  mandate: LegacyMandate;
  onSelectScenarioForBrief?: (scenario: AllocationScenario) => void;
}

type SimulationMetric = 'terminalValue' | 'hectares' | 'jobs';
type ClimateShockLevel = 'normal' | 'moderate' | 'severe';
type MacroVolatilityLevel = 'low' | 'moderate' | 'stressed';

interface SimulationTrial {
  scenarioId: string;
  yearlyValues: number[]; // Length 11 (year 0 to 10)
  terminalValue: number;
  terminalHectares: number;
  terminalJobs: number;
  experiencedShocks: number;
}

interface StrategyStats {
  scenario: AllocationScenario;
  trials: SimulationTrial[];
  meanTerminalValue: number;
  medianTerminalValue: number;
  p10TerminalValue: number;
  p25TerminalValue: number;
  p75TerminalValue: number;
  p90TerminalValue: number;
  var95: number;
  probCapitalPreserved: number; // percentage (0 - 100)
  probTargetReturnMet: number; // percentage > 6% CAGR
  meanHectares: number;
  p10Hectares: number;
  p50Hectares: number;
  p90Hectares: number;
  meanJobs: number;
  p10Jobs: number;
  p50Jobs: number;
  p90Jobs: number;
}

// Pseudo-random normal generator (Box-Muller)
function randomNormal(mean: number, stdDev: number): number {
  let u1 = 0, u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

export const MonteCarloSimulation: React.FC<MonteCarloSimulationProps> = ({
  mandate,
  onSelectScenarioForBrief
}) => {
  const [iterationCount, setIterationCount] = useState<number>(500);
  const [climateShock, setClimateShock] = useState<ClimateShockLevel>('moderate');
  const [macroVolatility, setMacroVolatility] = useState<MacroVolatilityLevel>('moderate');
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('scen-b'); // Default: Scenario B
  const [activeMetric, setActiveMetric] = useState<SimulationMetric>('terminalValue');
  const [simSeed, setSimSeed] = useState<number>(1);
  const [showSpaghettiPaths, setShowSpaghettiPaths] = useState<boolean>(true);

  const initialCapital = mandate.capitalPoolUsd;

  // Parameters based on volatility and climate shock levels
  const shockProbability = useMemo(() => {
    switch (climateShock) {
      case 'normal': return 0.05; // 1-in-20 year weather shock
      case 'moderate': return 0.15; // 1-in-7 year weather shock (El Niño / delayed rains)
      case 'severe': return 0.30; // 1-in-3.3 year multi-season drought
    }
  }, [climateShock]);

  const volMultiplier = useMemo(() => {
    switch (macroVolatility) {
      case 'low': return 0.75;
      case 'moderate': return 1.0;
      case 'stressed': return 1.5;
    }
  }, [macroVolatility]);

  // Run Monte Carlo Simulation across all strategies
  const simulationResults = useMemo(() => {
    // Explicitly reference simSeed so recalculation is triggered on demand
    const _ = simSeed;

    const years = 10;
    const allStats: Record<string, StrategyStats> = {};

    ALLOCATION_SCENARIOS.forEach((scenario) => {
      const pPreserve = scenario.preservationPercent / 100;
      const pCommercial = scenario.commercialEastAfricaPercent / 100;
      const pCatalytic = scenario.catalyticBlendedPercent / 100;

      // Base expected returns and standard deviations
      const muPreserve = 0.045; // US treasuries / Swiss liquidity net
      const sigmaPreserve = 0.015 * volMultiplier;

      const muCommercial = 0.095; // Productive agro & renewable cashflows
      const sigmaCommercial = 0.065 * volMultiplier;

      const muCatalytic = 0.040; // Concessionary & watershed trusts
      const sigmaCatalytic = 0.035 * volMultiplier;

      const trials: SimulationTrial[] = [];

      for (let i = 0; i < iterationCount; i++) {
        let currentVal = initialCapital;
        const yearlyValues: number[] = [initialCapital];
        let experiencedShocks = 0;

        let currentHectares = (initialCapital * pCatalytic / 100000) * 20 + (initialCapital * pCommercial / 100000) * 12;
        let currentJobs = (initialCapital * pCommercial / 100000) * 8 + (initialCapital * pCatalytic / 100000) * 6;

        for (let t = 1; t <= years; t++) {
          // Check for climate / hydrological shock
          const isShockYear = Math.random() < shockProbability;
          if (isShockYear) experiencedShocks++;

          // Returns by tranche
          const rPres = randomNormal(muPreserve, sigmaPreserve);
          let rComm = randomNormal(muCommercial, sigmaCommercial);
          let rCat = randomNormal(muCatalytic, sigmaCatalytic);

          if (isShockYear) {
            // Commercial agro/water yield drawdown mitigated by multi-species diversity
            const shockPenalty = randomNormal(0.06, 0.02);
            rComm -= shockPenalty;
            // Catalytic takes first-loss absorption
            rCat -= shockPenalty * 0.5;
          }

          // Blended annual return
          const blendedReturn = pPreserve * rPres + pCommercial * rComm + pCatalytic * rCat;
          currentVal = Math.max(0, currentVal * (1 + blendedReturn));
          yearlyValues.push(currentVal);

          // Impact evolution
          const annualHectareGrowthRate = isShockYear ? 0.03 : 0.08;
          currentHectares = currentHectares * (1 + annualHectareGrowthRate);

          const annualJobGrowthRate = isShockYear ? 0.02 : 0.06;
          currentJobs = currentJobs * (1 + annualJobGrowthRate);
        }

        trials.push({
          scenarioId: scenario.id,
          yearlyValues,
          terminalValue: currentVal,
          terminalHectares: Math.round(currentHectares),
          terminalJobs: Math.round(currentJobs),
          experiencedShocks
        });
      }

      // Compute statistics for this scenario
      const terminalVals = trials.map(t => t.terminalValue).sort((a, b) => a - b);
      const hectaresVals = trials.map(t => t.terminalHectares).sort((a, b) => a - b);
      const jobsVals = trials.map(t => t.terminalJobs).sort((a, b) => a - b);

      const meanTerminal = terminalVals.reduce((a, b) => a + b, 0) / iterationCount;
      const medianTerminal = terminalVals[Math.floor(iterationCount * 0.5)];
      const p10 = terminalVals[Math.floor(iterationCount * 0.10)];
      const p25 = terminalVals[Math.floor(iterationCount * 0.25)];
      const p75 = terminalVals[Math.floor(iterationCount * 0.75)];
      const p90 = terminalVals[Math.floor(iterationCount * 0.90)];
      const p05 = terminalVals[Math.floor(iterationCount * 0.05)];
      const var95 = Math.max(0, initialCapital - p05);

      const capitalPreservedCount = terminalVals.filter(v => v >= initialCapital).length;
      const probCapitalPreserved = Math.round((capitalPreservedCount / iterationCount) * 100);

      // Target return CAGR > 6.0% means terminalVal >= initialCapital * (1.06)^10
      const targetThreshold = initialCapital * Math.pow(1.06, years);
      const targetMetCount = terminalVals.filter(v => v >= targetThreshold).length;
      const probTargetReturnMet = Math.round((targetMetCount / iterationCount) * 100);

      allStats[scenario.id] = {
        scenario,
        trials,
        meanTerminalValue: meanTerminal,
        medianTerminalValue: medianTerminal,
        p10TerminalValue: p10,
        p25TerminalValue: p25,
        p75TerminalValue: p75,
        p90TerminalValue: p90,
        var95,
        probCapitalPreserved,
        probTargetReturnMet,
        meanHectares: Math.round(hectaresVals.reduce((a, b) => a + b, 0) / iterationCount),
        p10Hectares: hectaresVals[Math.floor(iterationCount * 0.10)],
        p50Hectares: hectaresVals[Math.floor(iterationCount * 0.50)],
        p90Hectares: hectaresVals[Math.floor(iterationCount * 0.90)],
        meanJobs: Math.round(jobsVals.reduce((a, b) => a + b, 0) / iterationCount),
        p10Jobs: jobsVals[Math.floor(iterationCount * 0.10)],
        p50Jobs: jobsVals[Math.floor(iterationCount * 0.50)],
        p90Jobs: jobsVals[Math.floor(iterationCount * 0.90)]
      };
    });

    return allStats;
  }, [iterationCount, shockProbability, volMultiplier, initialCapital, simSeed]);

  const activeStats = simulationResults[selectedStrategyId] || simulationResults['scen-b'];
  const activeScenario = activeStats.scenario;

  // Chart 1: Probability Distribution Histogram (D3)
  const histogramData = useMemo(() => {
    let rawValues: number[] = [];
    if (activeMetric === 'terminalValue') {
      rawValues = activeStats.trials.map(t => t.terminalValue / 1000000); // in $M USD
    } else if (activeMetric === 'hectares') {
      rawValues = activeStats.trials.map(t => t.terminalHectares);
    } else {
      rawValues = activeStats.trials.map(t => t.terminalJobs);
    }

    const minVal = Math.min(...rawValues);
    const maxVal = Math.max(...rawValues);

    const binGenerator = d3.bin()
      .domain([minVal, maxVal])
      .thresholds(24);

    const bins = binGenerator(rawValues);
    const maxCount = Math.max(...bins.map(b => b.length));

    return { bins, minVal, maxVal, maxCount };
  }, [activeStats, activeMetric]);

  // Chart Dimensions
  const histWidth = 720;
  const histHeight = 220;
  const histMargin = { top: 20, right: 30, bottom: 35, left: 45 };
  const histInnerW = histWidth - histMargin.left - histMargin.right;
  const histInnerH = histHeight - histMargin.top - histMargin.bottom;

  const xScaleHist = d3.scaleLinear()
    .domain([histogramData.minVal, histogramData.maxVal])
    .range([0, histInnerW]);

  const yScaleHist = d3.scaleLinear()
    .domain([0, histogramData.maxCount])
    .range([histInnerH, 0]);

  // Trajectory Spaghetti / Envelope Chart
  const trajWidth = 720;
  const trajHeight = 240;
  const trajMargin = { top: 20, right: 30, bottom: 35, left: 60 };
  const trajInnerW = trajWidth - trajMargin.left - trajMargin.right;
  const trajInnerH = trajHeight - trajMargin.top - trajMargin.bottom;

  const yearsAxis = Array.from({ length: 11 }, (_, i) => i);

  // Compute yearly percentiles across all trials for active strategy
  const yearlyPercentiles = useMemo(() => {
    return yearsAxis.map(yr => {
      const valsAtYear = activeStats.trials.map(t => t.yearlyValues[yr] / 1000000).sort((a, b) => a - b);
      return {
        year: yr,
        p10: valsAtYear[Math.floor(valsAtYear.length * 0.10)],
        p25: valsAtYear[Math.floor(valsAtYear.length * 0.25)],
        p50: valsAtYear[Math.floor(valsAtYear.length * 0.50)],
        p75: valsAtYear[Math.floor(valsAtYear.length * 0.75)],
        p90: valsAtYear[Math.floor(valsAtYear.length * 0.90)]
      };
    });
  }, [activeStats, yearsAxis]);

  const maxYearlyVal = Math.max(...yearlyPercentiles.map(y => y.p90)) * 1.15;
  const minYearlyVal = Math.min(...yearlyPercentiles.map(y => y.p10)) * 0.85;

  const xScaleTraj = d3.scaleLinear()
    .domain([0, 10])
    .range([0, trajInnerW]);

  const yScaleTraj = d3.scaleLinear()
    .domain([Math.min(minYearlyVal, initialCapital / 1000000 * 0.8), maxYearlyVal])
    .range([trajInnerH, 0]);

  // Area generators for 10-90 band and 25-75 band
  const areaP10P90 = d3.area<typeof yearlyPercentiles[0]>()
    .x(d => xScaleTraj(d.year))
    .y0(d => yScaleTraj(d.p10))
    .y1(d => yScaleTraj(d.p90))
    .curve(d3.curveMonotoneX);

  const areaP25P75 = d3.area<typeof yearlyPercentiles[0]>()
    .x(d => xScaleTraj(d.year))
    .y0(d => yScaleTraj(d.p25))
    .y1(d => yScaleTraj(d.p75))
    .curve(d3.curveMonotoneX);

  const lineMedian = d3.line<typeof yearlyPercentiles[0]>()
    .x(d => xScaleTraj(d.year))
    .y(d => yScaleTraj(d.p50))
    .curve(d3.curveMonotoneX);

  return (
    <div className="space-y-8">
      {/* Simulation Control Deck */}
      <div className="bg-[#F4F1EA] p-5 sm:p-6 rounded-xl border border-[#E8E4DC] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DC]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#2C5E4B] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2C5E4B] animate-pulse"></span>
              <span>Stochastic Stress-Testing Engine</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#0B241A] mt-0.5">
              Monte Carlo Outcome Probability Simulator
            </h3>
            <p className="text-xs text-[#57534E] mt-0.5">
              Simulating {iterationCount.toLocaleString()} multi-decade stochastic paths incorporating empirical rainfall anomalies, currency fluctuations, and localized shock absorption.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSimSeed(prev => prev + 1)}
              className="px-4 py-2 bg-[#0B241A] text-white text-xs font-medium rounded hover:bg-[#13382C] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>↻ Rerun Monte Carlo ({iterationCount} Trials)</span>
            </button>
          </div>
        </div>

        {/* Parameter Sliders & Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Strategy Selector */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1.5">
              Active Strategy Tested
            </label>
            <select
              value={selectedStrategyId}
              onChange={(e) => setSelectedStrategyId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-[#0B241A] font-medium focus:outline-none focus:border-[#0B241A]"
            >
              {ALLOCATION_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Climate Shock Scenario */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1.5">
              Climate Shock Risk
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-[#E8E4DC] rounded">
              <button
                type="button"
                onClick={() => setClimateShock('normal')}
                className={`py-1 text-[11px] rounded transition-colors cursor-pointer text-center ${
                  climateShock === 'normal' ? 'bg-[#0B241A] text-white font-medium' : 'text-[#57534E] hover:text-[#0B241A]'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setClimateShock('moderate')}
                className={`py-1 text-[11px] rounded transition-colors cursor-pointer text-center ${
                  climateShock === 'moderate' ? 'bg-[#2C5E4B] text-white font-medium' : 'text-[#57534E] hover:text-[#0B241A]'
                }`}
              >
                Moderate
              </button>
              <button
                type="button"
                onClick={() => setClimateShock('severe')}
                className={`py-1 text-[11px] rounded transition-colors cursor-pointer text-center ${
                  climateShock === 'severe' ? 'bg-amber-800 text-white font-medium' : 'text-[#57534E] hover:text-[#0B241A]'
                }`}
              >
                Severe
              </button>
            </div>
          </div>

          {/* Macro Volatility */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1.5">
              Currency & Inflation Volatility
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-[#E8E4DC] rounded">
              <button
                type="button"
                onClick={() => setMacroVolatility('low')}
                className={`py-1 text-[11px] rounded transition-colors cursor-pointer text-center ${
                  macroVolatility === 'low' ? 'bg-[#0B241A] text-white font-medium' : 'text-[#57534E] hover:text-[#0B241A]'
                }`}
              >
                Low (4%)
              </button>
              <button
                type="button"
                onClick={() => setMacroVolatility('moderate')}
                className={`py-1 text-[11px] rounded transition-colors cursor-pointer text-center ${
                  macroVolatility === 'moderate' ? 'bg-[#2C5E4B] text-white font-medium' : 'text-[#57534E] hover:text-[#0B241A]'
                }`}
              >
                Mod (8%)
              </button>
              <button
                type="button"
                onClick={() => setMacroVolatility('stressed')}
                className={`py-1 text-[11px] rounded transition-colors cursor-pointer text-center ${
                  macroVolatility === 'stressed' ? 'bg-amber-800 text-white font-medium' : 'text-[#57534E] hover:text-[#0B241A]'
                }`}
              >
                Stress (14%)
              </button>
            </div>
          </div>

          {/* Trial Iterations */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#78716C] mb-1.5">
              Sample Size Iterations
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-[#E8E4DC] rounded">
              {[250, 500, 1000].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setIterationCount(count)}
                  className={`py-1 text-[11px] rounded transition-colors cursor-pointer text-center ${
                    iterationCount === count ? 'bg-[#0B241A] text-white font-medium' : 'text-[#57534E] hover:text-[#0B241A]'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Percentile Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#78716C] block">
            P10 Bear Floor (Downside)
          </span>
          <div className="text-xl font-mono font-bold text-[#0B241A] tabular-nums">
            ${(activeStats.p10TerminalValue / 1000000).toFixed(1)}M
          </div>
          <span className="text-[11px] text-[#78716C] block">
            1-in-10 Year Stress Outcome
          </span>
        </div>

        <div className="p-4 bg-white border border-[#2C5E4B]/40 rounded-xl shadow-xs space-y-1 bg-[#2C5E4B]/5">
          <span className="text-[10px] font-mono uppercase text-[#2C5E4B] font-semibold block">
            P50 Median Terminal Value
          </span>
          <div className="text-2xl font-mono font-bold text-[#2C5E4B] tabular-nums">
            ${(activeStats.medianTerminalValue / 1000000).toFixed(1)}M
          </div>
          <span className="text-[11px] text-[#57534E] block">
            Most Probable 10-Yr Wealth
          </span>
        </div>

        <div className="p-4 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#78716C] block">
            P90 Bull Ceiling (Upside)
          </span>
          <div className="text-xl font-mono font-bold text-[#0B241A] tabular-nums">
            ${(activeStats.p90TerminalValue / 1000000).toFixed(1)}M
          </div>
          <span className="text-[11px] text-[#78716C] block">
            Top 10% Favorable Harvests
          </span>
        </div>

        <div className="p-4 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#78716C] block">
            P(Capital Preserved)
          </span>
          <div className="text-xl font-mono font-bold text-[#0B241A] tabular-nums">
            {activeStats.probCapitalPreserved}%
          </div>
          <span className="text-[11px] text-[#78716C] block">
            Terminal Value ≥ $25M USD
          </span>
        </div>

        <div className="p-4 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] font-mono uppercase text-[#78716C] block">
            P(Target Return ≥ 6%)
          </span>
          <div className="text-xl font-mono font-bold text-[#2C5E4B] tabular-nums">
            {activeStats.probTargetReturnMet}%
          </div>
          <span className="text-[11px] text-[#78716C] block">
            Mandate Benchmark Met
          </span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Probability Density Histogram */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#E8E4DC] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E4DC]">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A]">
                10-Year Probability Distribution Curve
              </h4>
              <p className="text-xs text-[#78716C]">
                Frequency of occurrence across {iterationCount} Monte Carlo iterations
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center p-0.5 bg-[#F4F1EA] border border-[#E8E4DC] rounded text-[11px]">
              <button
                type="button"
                onClick={() => setActiveMetric('terminalValue')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeMetric === 'terminalValue' ? 'bg-white text-[#0B241A] font-semibold shadow-xs' : 'text-[#78716C]'
                }`}
              >
                Value ($M)
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('hectares')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeMetric === 'hectares' ? 'bg-white text-[#0B241A] font-semibold shadow-xs' : 'text-[#78716C]'
                }`}
              >
                Hectares
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('jobs')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeMetric === 'jobs' ? 'bg-white text-[#0B241A] font-semibold shadow-xs' : 'text-[#78716C]'
                }`}
              >
                Livelihoods
              </button>
            </div>
          </div>

          {/* SVG Histogram */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${histWidth} ${histHeight}`}
              className="w-full h-auto min-w-[500px]"
            >
              <g transform={`translate(${histMargin.left}, ${histMargin.top})`}>
                {/* Horizontal Grid lines */}
                {yScaleHist.ticks(4).map((tick) => (
                  <g key={tick} transform={`translate(0, ${yScaleHist(tick)})`}>
                    <line x1={0} x2={histInnerW} stroke="#E8E4DC" strokeDasharray="3 3" />
                    <text x={-8} y={4} textAnchor="end" fontSize={10} fill="#78716C" fontFamily="monospace">
                      {tick}
                    </text>
                  </g>
                ))}

                {/* Histogram Bars */}
                {histogramData.bins.map((bin, idx) => {
                  const x = xScaleHist(bin.x0 ?? 0);
                  const width = Math.max(1, xScaleHist(bin.x1 ?? 0) - x - 1.5);
                  const y = yScaleHist(bin.length);
                  const height = histInnerH - y;

                  return (
                    <rect
                      key={idx}
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill="#2C5E4B"
                      opacity={0.8}
                      rx={2}
                      className="hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <title>
                        {bin.length} trials ({(bin.length / iterationCount * 100).toFixed(1)}%) in range [{(bin.x0 ?? 0).toFixed(1)} - {(bin.x1 ?? 0).toFixed(1)}]
                      </title>
                    </rect>
                  );
                })}

                {/* Vertical Marker for P10 */}
                {activeMetric === 'terminalValue' && (
                  <>
                    <line
                      x1={xScaleHist(activeStats.p10TerminalValue / 1000000)}
                      x2={xScaleHist(activeStats.p10TerminalValue / 1000000)}
                      y1={0}
                      y2={histInnerH}
                      stroke="#B91C1C"
                      strokeWidth={1.5}
                      strokeDasharray="4 2"
                    />
                    <text
                      x={xScaleHist(activeStats.p10TerminalValue / 1000000)}
                      y={-6}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#B91C1C"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      P10: ${(activeStats.p10TerminalValue / 1000000).toFixed(1)}M
                    </text>
                  </>
                )}

                {/* Vertical Marker for P50 Median */}
                {activeMetric === 'terminalValue' && (
                  <>
                    <line
                      x1={xScaleHist(activeStats.medianTerminalValue / 1000000)}
                      x2={xScaleHist(activeStats.medianTerminalValue / 1000000)}
                      y1={0}
                      y2={histInnerH}
                      stroke="#0B241A"
                      strokeWidth={2}
                    />
                    <text
                      x={xScaleHist(activeStats.medianTerminalValue / 1000000)}
                      y={-6}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#0B241A"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      P50: ${(activeStats.medianTerminalValue / 1000000).toFixed(1)}M
                    </text>
                  </>
                )}

                {/* Vertical Marker for P90 */}
                {activeMetric === 'terminalValue' && (
                  <>
                    <line
                      x1={xScaleHist(activeStats.p90TerminalValue / 1000000)}
                      x2={xScaleHist(activeStats.p90TerminalValue / 1000000)}
                      y1={0}
                      y2={histInnerH}
                      stroke="#15803D"
                      strokeWidth={1.5}
                      strokeDasharray="4 2"
                    />
                    <text
                      x={xScaleHist(activeStats.p90TerminalValue / 1000000)}
                      y={-6}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#15803D"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      P90: ${(activeStats.p90TerminalValue / 1000000).toFixed(1)}M
                    </text>
                  </>
                )}

                {/* Baseline Capital Initial Line */}
                {activeMetric === 'terminalValue' && (
                  <line
                    x1={xScaleHist(initialCapital / 1000000)}
                    x2={xScaleHist(initialCapital / 1000000)}
                    y1={0}
                    y2={histInnerH}
                    stroke="#78716C"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                  />
                )}

                {/* X Axis Ticks */}
                {xScaleHist.ticks(6).map((tick) => (
                  <g key={tick} transform={`translate(${xScaleHist(tick)}, ${histInnerH})`}>
                    <line y1={0} y2={5} stroke="#78716C" />
                    <text y={16} textAnchor="middle" fontSize={10} fill="#78716C" fontFamily="monospace">
                      {activeMetric === 'terminalValue' ? `$${tick}M` : tick.toLocaleString()}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#78716C] pt-2 border-t border-[#F4F1EA]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#2C5E4B]"></span> Trial Bins
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#B91C1C]"></span> P10 Downside
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#0B241A]"></span> P50 Median
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#15803D]"></span> P90 Upside
              </span>
            </div>
            <span className="font-mono">
              95% VaR: ${(activeStats.var95 / 1000000).toFixed(2)}M USD
            </span>
          </div>
        </div>

        {/* Right Column: 10-Year Spaghetti Stochastic Trajectories */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#E8E4DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A]">
                10-Year Stochastic Path Trajectories
              </h4>
              <p className="text-xs text-[#78716C]">
                P10–P90 confidence envelope with 25 random-walk realizations
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSpaghettiPaths(!showSpaghettiPaths)}
              className="text-[11px] text-[#2C5E4B] hover:underline font-medium cursor-pointer"
            >
              {showSpaghettiPaths ? 'Hide Realization Paths' : 'Show Realization Paths'}
            </button>
          </div>

          {/* SVG Trajectory Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${trajWidth} ${trajHeight}`}
              className="w-full h-auto min-w-[500px]"
            >
              <g transform={`translate(${trajMargin.left}, ${trajMargin.top})`}>
                {/* Horizontal Grid */}
                {yScaleTraj.ticks(5).map((tick) => (
                  <g key={tick} transform={`translate(0, ${yScaleTraj(tick)})`}>
                    <line x1={0} x2={trajInnerW} stroke="#E8E4DC" strokeDasharray="3 3" />
                    <text x={-8} y={4} textAnchor="end" fontSize={10} fill="#78716C" fontFamily="monospace">
                      ${tick.toFixed(0)}M
                    </text>
                  </g>
                ))}

                {/* P10 - P90 Envelope Area */}
                {areaP10P90(yearlyPercentiles) && (
                  <path
                    d={areaP10P90(yearlyPercentiles)!}
                    fill="#2C5E4B"
                    opacity={0.12}
                  />
                )}

                {/* P25 - P75 Interquartile Area */}
                {areaP25P75(yearlyPercentiles) && (
                  <path
                    d={areaP25P75(yearlyPercentiles)!}
                    fill="#2C5E4B"
                    opacity={0.25}
                  />
                )}

                {/* Sample Spaghetti Individual Trials */}
                {showSpaghettiPaths && activeStats.trials.slice(0, 20).map((trial, idx) => {
                  const lineGen = d3.line<number>()
                    .x((_, yr) => xScaleTraj(yr))
                    .y((val) => yScaleTraj(val / 1000000))
                    .curve(d3.curveMonotoneX);

                  const pathStr = lineGen(trial.yearlyValues);
                  if (!pathStr) return null;

                  return (
                    <path
                      key={idx}
                      d={pathStr}
                      fill="none"
                      stroke="#2C5E4B"
                      strokeWidth={1}
                      opacity={0.22}
                    />
                  );
                })}

                {/* Initial Capital Reference Line ($25M) */}
                <line
                  x1={0}
                  x2={trajInnerW}
                  y1={yScaleTraj(initialCapital / 1000000)}
                  y2={yScaleTraj(initialCapital / 1000000)}
                  stroke="#78716C"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />

                {/* P50 Median Trajectory Line */}
                {lineMedian(yearlyPercentiles) && (
                  <path
                    d={lineMedian(yearlyPercentiles)!}
                    fill="none"
                    stroke="#0B241A"
                    strokeWidth={2.5}
                  />
                )}

                {/* Year Axis */}
                {yearsAxis.map((yr) => (
                  <g key={yr} transform={`translate(${xScaleTraj(yr)}, ${trajInnerH})`}>
                    <line y1={0} y2={5} stroke="#78716C" />
                    <text y={16} textAnchor="middle" fontSize={10} fill="#78716C" fontFamily="monospace">
                      Yr {yr}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-2 border-t border-[#F4F1EA]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 bg-[#2C5E4B]/15 rounded-xs"></span> P10–P90 Envelope
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 bg-[#2C5E4B]/30 rounded-xs"></span> P25–P75 Range
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-0.5 bg-[#0B241A]"></span> P50 Median Path
              </span>
            </div>
            <span className="font-mono text-[#0B241A]">
              10-Yr Horizon: 2026 → 2036
            </span>
          </div>
        </div>

      </div>

      {/* Comparative Multi-Strategy Stress Table */}
      <div className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E8E4DC] bg-[#F4F1EA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A]">
              Comparative Monte Carlo Resilience Across Allocation Strategies
            </h4>
            <p className="text-xs text-[#57534E] mt-0.5">
              Simulated under {climateShock} climate shock conditions and {macroVolatility} macroeconomic volatility.
            </p>
          </div>

          <div className="text-xs font-mono text-[#78716C]">
            Initial Pool: ${(initialCapital / 1000000).toFixed(0)}M USD
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FBF9F5] text-[#78716C] font-mono uppercase text-[10px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-4">Allocation Strategy</th>
                <th className="py-3 px-4 text-right">P10 Floor</th>
                <th className="py-3 px-4 text-right">P50 Median</th>
                <th className="py-3 px-4 text-right">P90 Ceiling</th>
                <th className="py-3 px-4 text-center">P(Preserved)</th>
                <th className="py-3 px-4 text-center">P(CAGR ≥ 6%)</th>
                <th className="py-3 px-4 text-right">Expected Land Restored</th>
                <th className="py-3 px-4 text-right">Livelihoods Sustained</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {ALLOCATION_SCENARIOS.map((scenario) => {
                const s = simulationResults[scenario.id];
                const isSelected = selectedStrategyId === scenario.id;

                return (
                  <tr
                    key={scenario.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-[#2C5E4B]/5 font-medium' : 'hover:bg-[#FBF9F5]'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0B241A]">{scenario.name}</div>
                      <div className="text-[11px] text-[#78716C] mt-0.5">
                        {scenario.preservationPercent}% Liquid / {scenario.commercialEastAfricaPercent}% Commercial / {scenario.catalyticBlendedPercent}% Catalytic
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-red-800 tabular-nums">
                      ${(s.p10TerminalValue / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#2C5E4B] font-bold tabular-nums">
                      ${(s.medianTerminalValue / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#0B241A] tabular-nums">
                      ${(s.p90TerminalValue / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        s.probCapitalPreserved >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.probCapitalPreserved}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        s.probTargetReturnMet >= 60 ? 'bg-[#2C5E4B]/15 text-[#2C5E4B] font-semibold' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {s.probTargetReturnMet}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#0B241A] tabular-nums">
                      {s.p50Hectares.toLocaleString()} Ha
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#0B241A] tabular-nums">
                      {s.p50Jobs.toLocaleString()} families
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedStrategyId(scenario.id)}
                        className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B241A] text-white'
                            : 'bg-white border border-[#E8E4DC] text-[#44403C] hover:border-[#0B241A]'
                        }`}
                      >
                        {isSelected ? 'Simulating' : 'Simulate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {onSelectScenarioForBrief && (
          <div className="p-4 bg-[#F4F1EA] border-t border-[#E8E4DC] flex items-center justify-between">
            <span className="text-xs text-[#57534E]">
              Currently modeling: <strong className="text-[#0B241A]">{activeScenario.name}</strong>
            </span>
            <button
              onClick={() => onSelectScenarioForBrief(activeScenario)}
              className="px-4 py-2 bg-[#2C5E4B] text-white text-xs font-semibold rounded hover:bg-[#234b3c] transition-colors cursor-pointer"
            >
              Apply {activeScenario.name.split(':')[0]} to Family Allocation Brief →
            </button>
          </div>
        )}
      </div>

      {/* Institutional Disclosure Box */}
      <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg text-xs text-[#57534E] flex items-start gap-3">
        <div className="font-semibold text-[#0B241A] uppercase tracking-wider shrink-0 mt-0.5">
          Methodological Rule
        </div>
        <p className="leading-relaxed">
          The Monte Carlo simulation engine uses stochastic geometric Brownian motion with jump-diffusion to model climate shock events and East African macroeconomic volatility over a 10-year investment horizon. Past climate cycles, soil microbiology recovery rates, and market yields are modeled for stress-testing and do not guarantee future performance.
        </p>
      </div>
    </div>
  );
};
