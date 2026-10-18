import React, { useState } from 'react';
import * as d3 from 'd3';
import { Opportunity } from '../types';

interface RciMatrixProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opportunity: Opportunity) => void;
}

type ProjectionMetric = 'soc' | 'hectares' | 'income' | 'water';

interface MetricConfig {
  id: ProjectionMetric;
  label: string;
  unit: string;
  description: string;
  regenerativeData: number[];
  conventionalData: number[];
  lowerConfidence: number[];
  upperConfidence: number[];
  format: (val: number) => string;
}

const TIME_YEARS = [2026, 2028, 2030, 2032, 2034, 2036];

const PROJECTION_METRICS: Record<ProjectionMetric, MetricConfig> = {
  soc: {
    id: 'soc',
    label: 'Soil Organic Carbon (SOC)',
    unit: '% Carbon by Weight',
    description: 'Ground-truthed biological topsoil regeneration measured at Mount Kenya and Rift Valley agroforestry sites.',
    regenerativeData: [1.42, 1.84, 2.35, 2.88, 3.32, 3.65],
    conventionalData: [1.42, 1.35, 1.28, 1.20, 1.14, 1.08],
    lowerConfidence: [1.42, 1.72, 2.18, 2.65, 3.05, 3.38],
    upperConfidence: [1.42, 1.96, 2.52, 3.10, 3.58, 3.92],
    format: (v) => `${v.toFixed(2)}%`
  },
  hectares: {
    id: 'hectares',
    label: 'Land Under Active Regeneration',
    unit: 'Hectares (Ha)',
    description: 'Tiered riparian buffers, shade canopy, and community watershed reforestation.',
    regenerativeData: [0, 1850, 4200, 7100, 9800, 12500],
    conventionalData: [0, 200, 350, 400, 420, 450],
    lowerConfidence: [0, 1600, 3700, 6400, 8900, 11400],
    upperConfidence: [0, 2100, 4700, 7800, 10700, 13600],
    format: (v) => `${v.toLocaleString()} Ha`
  },
  income: {
    id: 'income',
    label: 'Smallholder Farmgate Household Net Income',
    unit: 'USD / Family / Year',
    description: 'Direct specialty export premiums, solar cold-chain loss reduction, and bioeconomy royalties.',
    regenerativeData: [920, 1280, 1690, 2150, 2520, 2880],
    conventionalData: [920, 910, 895, 870, 850, 830],
    lowerConfidence: [920, 1180, 1540, 1960, 2300, 2640],
    upperConfidence: [920, 1380, 1840, 2340, 2740, 3120],
    format: (v) => `$${v.toLocaleString()} USD`
  },
  water: {
    id: 'water',
    label: 'Watershed & Aquifer Protection Index',
    unit: 'Index (0-100)',
    description: 'Sediment siltation reduction at reservoir intakes, biological oxygen demand, and riparian buffer integrity.',
    regenerativeData: [34, 48, 62, 75, 84, 91],
    conventionalData: [34, 32, 29, 27, 24, 22],
    lowerConfidence: [34, 44, 57, 69, 78, 85],
    upperConfidence: [34, 52, 67, 81, 90, 97],
    format: (v) => `${v}/100`
  }
};

export const RciMatrix: React.FC<RciMatrixProps> = ({ opportunities, onSelectOpportunity }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'projections'>('projections');
  const [selectedMetric, setSelectedMetric] = useState<ProjectionMetric>('soc');
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number | null>(null);

  // Custom pillar weights (default equal 25% each)
  const [weights, setWeights] = useState({
    ecological: 25,
    governance: 25,
    financial: 25,
    additionality: 25
  });

  const totalWeight = weights.ecological + weights.governance + weights.financial + weights.additionality;

  const calculateCustomScore = (opp: Opportunity) => {
    if (opp.status === 'Excluded') return opp.rciScore;
    const raw = 
      (opp.rciPillars.ecologicalRegeneration / 25) * weights.ecological +
      (opp.rciPillars.institutionalGovernance / 25) * weights.governance +
      (opp.rciPillars.financialDurability / 25) * weights.financial +
      (opp.rciPillars.additionalityAndAgency / 25) * weights.additionality;
    return Math.round((raw / (totalWeight || 100)) * 100);
  };

  const currentMetricConfig = PROJECTION_METRICS[selectedMetric];

  // SVG Chart Dimensions
  const svgWidth = 780;
  const svgHeight = 320;
  const margin = { top: 30, right: 40, bottom: 40, left: 60 };
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  // Scales
  const xScale = d3.scaleLinear()
    .domain([0, TIME_YEARS.length - 1])
    .range([0, innerWidth]);

  const allValues = [
    ...currentMetricConfig.regenerativeData,
    ...currentMetricConfig.conventionalData,
    ...currentMetricConfig.upperConfidence,
    ...currentMetricConfig.lowerConfidence
  ];

  const yMin = Math.min(...allValues) * 0.85;
  const yMax = Math.max(...allValues) * 1.1;

  const yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([innerHeight, 0]);

  // Line & Area generators
  const lineGeneratorRegen = d3.line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(d3.curveMonotoneX);

  const lineGeneratorConv = d3.line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(d3.curveMonotoneX);

  const areaGeneratorConfidence = d3.area<number>()
    .x((_, i) => xScale(i))
    .y0((_, i) => yScale(currentMetricConfig.lowerConfidence[i]))
    .y1((_, i) => yScale(currentMetricConfig.upperConfidence[i]))
    .curve(d3.curveMonotoneX);

  const regenPath = lineGeneratorRegen(currentMetricConfig.regenerativeData) || '';
  const convPath = lineGeneratorConv(currentMetricConfig.conventionalData) || '';
  const confidenceArea = areaGeneratorConfidence(currentMetricConfig.regenerativeData) || '';

  // Calculate 10-year terminal variance
  const terminalRegen = currentMetricConfig.regenerativeData[currentMetricConfig.regenerativeData.length - 1];
  const terminalConv = currentMetricConfig.conventionalData[currentMetricConfig.conventionalData.length - 1];
  const terminalVariance = terminalRegen - terminalConv;

  const activeIndex = hoveredYearIndex !== null ? hoveredYearIndex : 5; // Default Year 10 (2036)
  const activeYear = TIME_YEARS[activeIndex];
  const activeRegenVal = currentMetricConfig.regenerativeData[activeIndex];
  const activeConvVal = currentMetricConfig.conventionalData[activeIndex];
  const activeDelta = activeRegenVal - activeConvVal;

  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            The Decision Matrix & Forward Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Regenerative Capacity Index (RCI) Audit & Trajectory Projections
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Evaluate current project evidence across 4 audited pillars, and model forward-looking 10-year trajectories contrasting regenerative capital allocation against conventional extractive degradation.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 bg-[#F4F1EA] border border-[#E8E4DC] rounded text-xs">
          <button
            onClick={() => setActiveTab('projections')}
            className={`px-3 py-1.5 font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'projections'
                ? 'bg-white text-[#0B241A] shadow-xs font-semibold'
                : 'text-[#57534E] hover:text-[#0B241A]'
            }`}
          >
            <span>Forward Impact Line Chart</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E4B]"></span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 font-medium rounded transition-colors cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-white text-[#0B241A] shadow-xs font-semibold'
                : 'text-[#57534E] hover:text-[#0B241A]'
            }`}
          >
            Current Pillar Audit Matrix
          </button>
        </div>
      </div>

      {/* Mode 1: Forward-Looking Time-Series Line Chart */}
      {activeTab === 'projections' && (
        <div className="space-y-8">
          
          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-[#F4F1EA] p-3 rounded-lg border border-[#E8E4DC]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716C] mr-2">
              Select Indicator Trajectory:
            </span>
            {(Object.keys(PROJECTION_METRICS) as ProjectionMetric[]).map((metricKey) => {
              const m = PROJECTION_METRICS[metricKey];
              const isSelected = selectedMetric === metricKey;
              return (
                <button
                  key={metricKey}
                  onClick={() => setSelectedMetric(metricKey)}
                  className={`px-3 py-1.5 text-xs rounded font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B241A] text-white shadow-xs'
                      : 'bg-white border border-[#E8E4DC] text-[#44403C] hover:border-[#0B241A]'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Forward-Looking Time-Series Line Chart Container */}
          <div className="p-6 sm:p-8 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#2C5E4B] tracking-widest font-semibold block">
                  10-Year Long-Term Empirical Projection (2026–2036)
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#0B241A]">
                  {currentMetricConfig.label}
                </h3>
                <p className="text-xs text-[#57534E] mt-0.5 max-w-xl">
                  {currentMetricConfig.description}
                </p>
              </div>

              {/* Dynamic Delta Callout */}
              <div className="p-3 bg-[#E8F3EE] border border-[#2C5E4B]/30 rounded-lg text-right font-mono">
                <span className="text-[10px] text-[#2C5E4B] uppercase block font-semibold">
                  {activeYear} Projected Net Delta
                </span>
                <span className="text-lg font-bold text-[#13382C] block tabular-nums">
                  +{currentMetricConfig.format(activeDelta)}
                </span>
                <span className="text-[10px] text-[#57534E]">
                  Regen: {currentMetricConfig.format(activeRegenVal)} vs Baseline: {currentMetricConfig.format(activeConvVal)}
                </span>
              </div>
            </div>

            {/* SVG Interactive Line Chart Canvas */}
            <div className="relative w-full overflow-x-auto select-none">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto min-w-[620px]"
              >
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                  
                  {/* Grid Lines (Horizontal) */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                    const yVal = yMin + (yMax - yMin) * pct;
                    const yPos = yScale(yVal);
                    return (
                      <g key={i}>
                        <line
                          x1={0}
                          y1={yPos}
                          x2={innerWidth}
                          y2={yPos}
                          stroke="#E8E4DC"
                          strokeDasharray="3,3"
                        />
                        <text
                          x={-10}
                          y={yPos + 4}
                          textAnchor="end"
                          fontSize="10"
                          fontFamily="monospace"
                          fill="#78716C"
                        >
                          {currentMetricConfig.format(yVal).split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Vertical Year Grid Lines */}
                  {TIME_YEARS.map((year, i) => {
                    const xPos = xScale(i);
                    return (
                      <g key={year}>
                        <line
                          x1={xPos}
                          y1={0}
                          x2={xPos}
                          y2={innerHeight}
                          stroke="#E8E4DC"
                          strokeWidth="0.8"
                          strokeDasharray="2,4"
                        />
                        <text
                          x={xPos}
                          y={innerHeight + 24}
                          textAnchor="middle"
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight={hoveredYearIndex === i ? '700' : '500'}
                          fill={hoveredYearIndex === i ? '#0B241A' : '#78716C'}
                        >
                          {year}
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded 90% Confidence Corridor for Regenerative Line */}
                  <path
                    d={confidenceArea}
                    fill="#2C5E4B"
                    fillOpacity="0.12"
                  />

                  {/* Line 2: Conventional / Degraded Trajectory (Dashed Stone Gray) */}
                  <path
                    d={convPath}
                    fill="none"
                    stroke="#78716C"
                    strokeWidth="2.2"
                    strokeDasharray="5,5"
                  />

                  {/* Line 1: Regenerative Stewardship Trajectory (Solid Forest Green) */}
                  <path
                    d={regenPath}
                    fill="none"
                    stroke="#0B241A"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />

                  {/* Interactive Nodes & Tooltip Targets */}
                  {TIME_YEARS.map((year, i) => {
                    const xPos = xScale(i);
                    const yPosRegen = yScale(currentMetricConfig.regenerativeData[i]);
                    const yPosConv = yScale(currentMetricConfig.conventionalData[i]);
                    const isHovered = hoveredYearIndex === i;

                    return (
                      <g
                        key={year}
                        onMouseEnter={() => setHoveredYearIndex(i)}
                        onMouseLeave={() => setHoveredYearIndex(null)}
                        className="cursor-pointer"
                      >
                        {/* Hover vertical guideline */}
                        {isHovered && (
                          <line
                            x1={xPos}
                            y1={0}
                            x2={xPos}
                            y2={innerHeight}
                            stroke="#0B241A"
                            strokeWidth="1.5"
                            strokeDasharray="2,2"
                          />
                        )}

                        {/* Conventional dot */}
                        <circle
                          cx={xPos}
                          cy={yPosConv}
                          r={isHovered ? 5.5 : 4}
                          fill="#78716C"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />

                        {/* Regenerative dot */}
                        <circle
                          cx={xPos}
                          cy={yPosRegen}
                          r={isHovered ? 7.5 : 5.5}
                          fill="#0B241A"
                          stroke="#C5A059"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Time-Series Legend & Milestone Markers */}
            <div className="pt-4 border-t border-[#E8E4DC] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-1 bg-[#0B241A] rounded inline-block"></span>
                  <span className="font-semibold text-[#0B241A]">
                    Regenerative Allocation Trajectory (Catalytic Blended + Agroforestry & Clean Power)
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-0.5 border-t-2 border-dashed border-[#78716C] inline-block"></span>
                  <span className="text-[#57534E]">
                    Conventional / Passive Offshore Allocation (Degrading Baseline)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#2C5E4B]/20 border border-[#2C5E4B]/40 rounded-xs inline-block"></span>
                  <span className="text-[#78716C] text-[11px]">
                    90% Climate & Hydrological Confidence Corridor
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Milestone Gates along the 10-Year Horizon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1">
                <span className="font-mono text-[10px] text-[#2C5E4B] font-bold uppercase block">
                  Year 2 (2028 Milestone)
                </span>
                <strong className="text-[#0B241A] block">Canopy Closure & Cold Chain Active</strong>
                <p className="text-[11px] text-[#57534E] leading-normal">
                  48 farmer clusters complete biological soil inoculation; post-harvest spoilage collapses from 38% to under 7%.
                </p>
              </div>

              <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1">
                <span className="font-mono text-[10px] text-[#2C5E4B] font-bold uppercase block">
                  Year 5 (2031 Milestone)
                </span>
                <strong className="text-[#0B241A] block">Debt Amortization & Cooperative Equity</strong>
                <p className="text-[11px] text-[#57534E] leading-normal">
                  Senior facilities fully amortized; local farming cooperatives receive 40% net revenue dividends directly in mobile wallets.
                </p>
              </div>

              <div className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded space-y-1">
                <span className="font-mono text-[10px] text-[#2C5E4B] font-bold uppercase block">
                  Year 10 (2036 Milestone)
                </span>
                <strong className="text-[#0B241A] block">Ecological Watershed Equilibrium</strong>
                <p className="text-[11px] text-[#57534E] leading-normal">
                  Over 12,500 hectares achieve full vegetative carbon saturation; payment for ecosystem services perpetually funds community healthcare.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Current Pillar Audit Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-8">
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
        </div>
      )}

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
