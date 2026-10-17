import { Opportunity, LegacyMandate, AllocationScenario } from '../types';

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-01',
    name: 'Kilimo Hai Highlands Agroforestry',
    tagline: 'Multi-strata agroforestry, soil biological remediation, and direct-export specialty coffee & macadamia co-operative.',
    sector: 'Regenerative Agriculture',
    county: 'Nyeri & Kirinyaga Counties',
    country: 'Kenya',
    readiness: 'Growth / Expansion',
    capitalRequirementUsd: 2400000,
    minimumTicketUsd: 150000,
    instrument: 'Revenue Share Note',
    projectedFinancialReturn: '8.4% coupon + 2.1% net harvest revenue share',
    rciScore: 88,
    confidenceLevel: 'High (Verified & Audited)',
    image: '/src/assets/images/kenya_regenerative_agriculture_1792231068950.jpg',
    problemStatement: 'Severe topsoil erosion and synthetic fertilizer acidification in Mount Kenya buffer zones have reduced smallholder yields by 34% over 15 years, leaving 1,400+ farming families vulnerable to drought and volatile commodity broker margins.',
    operatingModel: 'Operates 3 centralized bio-fermentation processing hubs that provide compost inoculants, biochar, and cold storage while purchasing certified shade-grown coffee and macadamia at a 28% premium directly under forward purchase agreements.',
    additionality: 'Commercial banks in Kenya demand 18-22% collateralized interest rates and 12-month repayment horizons. Atlas capital unlocks a 5-year patient grace period, enabling 1,850 hectares to transition to complete multi-strata canopy without smallholder debt distress.',
    beneficiaryCount: 1420,
    hectaresUnderRegeneration: 1850,
    rciPillars: {
      ecologicalRegeneration: 23,
      institutionalGovernance: 22,
      financialDurability: 21,
      additionalityAndAgency: 22,
    },
    evidenceSources: [
      {
        title: 'Soil Organic Carbon (SOC) Core Testing Report (Q3 2025)',
        authorOrOrg: 'Kenya Agricultural and Livestock Research Organisation (KALRO) & SoilCares',
        date: 'September 2025',
        type: 'Field Inspection',
        verified: true,
        notes: 'Demonstrated 1.84% mean SOC increase across 48 sampled farm clusters over 24 months.'
      },
      {
        title: '3-Year Audited Financial Statements & Tax Compliance Certificate',
        authorOrOrg: 'PKF Eastern Africa',
        date: 'June 2025',
        type: 'Financial Audit',
        verified: true,
        notes: 'Unqualified audit opinion; operating break-even achieved in Year 2; debt service coverage ratio 1.82x.'
      },
      {
        title: 'Smallholder Co-operative Free, Prior, and Informed Consent (FPIC) Charter',
        authorOrOrg: 'Kirinyaga Organic Farmers Union (KOFU)',
        date: 'November 2024',
        type: 'Community Consent Record',
        verified: true,
        notes: 'Documented 94% affirmative voting record across 8 village general meetings.'
      }
    ],
    unresolvedGaps: [
      'Lack of automated digital moisture probes across 22% of high-altitude steep terrain plots.',
      'Foreign exchange hedging mechanism between USD facility and KES smallholder farmgate disbursements requires formalisation with a local Tier-1 bank.'
    ],
    keyRisks: [
      {
        category: 'Climate/Hydrological',
        description: 'Unseasonal frost or delayed March-May long rains affecting flowering canopy.',
        mitigation: 'Multi-species diversity (macadamia, avocado, indigenous shade trees) buffers microclimate and provides non-correlated income.'
      },
      {
        category: 'Market/Currency',
        description: 'Fluctuations in global specialty coffee auction pricing.',
        mitigation: 'Fixed-price direct-trade contracts with European and Nordic roasters locked for 3 rolling harvest seasons.'
      }
    ],
    localOwnershipPercentage: 64,
    communityParticipationModel: 'Farmer co-operative holds 40% equity stake in the central processing and export entity with two permanent board seats.',
    status: 'Qualified'
  },
  {
    id: 'opp-02',
    name: 'Victoria Blue Horizon Aquaculture & Cold Chain',
    tagline: 'Solar-powered offshore freshwater tilapia pens and localized cold-chain logistics combating lake depletion.',
    sector: 'Watershed & Aquatic Systems',
    county: 'Homa Bay & Kisumu Counties',
    country: 'Kenya',
    readiness: 'Growth / Expansion',
    capitalRequirementUsd: 1800000,
    minimumTicketUsd: 100000,
    instrument: 'Senior Debt',
    projectedFinancialReturn: '9.2% p.a. fixed senior secured',
    rciScore: 82,
    confidenceLevel: 'High (Verified & Audited)',
    image: '/src/assets/images/aquaculture_lake_victoria_1792231070593.jpg',
    problemStatement: 'Wild fish stocks in Lake Victoria have collapsed by over 60% due to illegal trawling and nutrient runoff, driving local post-harvest spoilage over 35% and pushing fishmonger women into exploitative middlemen debt traps.',
    operatingModel: 'Deploys HDPE deep-water circular cages powered by floating solar telemetry buoys. Supplies juvenile fingerlings, circular black soldier fly feed, and solar cold lockers along 6 beach management landing sites.',
    additionality: 'Replaces wild fishery extraction with 2,400 metric tonnes of responsibly farmed tilapia annually while eliminating chemical preservation and post-harvest spoilage across 480 women micro-retailers.',
    beneficiaryCount: 860,
    hectaresUnderRegeneration: 420,
    rciPillars: {
      ecologicalRegeneration: 21,
      institutionalGovernance: 20,
      financialDurability: 22,
      additionalityAndAgency: 19,
    },
    evidenceSources: [
      {
        title: 'Lake Water Quality & Benthic Eco-Impact Assessment (EIA)',
        authorOrOrg: 'National Environment Management Authority (NEMA) & KMFRI',
        date: 'January 2025',
        type: 'Hydrological Sensor',
        verified: true,
        notes: 'Dissolved oxygen, phosphorus, and biological oxygen demand recorded within compliant oligotrophic parameters.'
      },
      {
        title: 'Women Fishmonger Micro-Savings & Credit Cooperative Register',
        authorOrOrg: 'Kisumu County Directorate of Fisheries and Cooperatives',
        date: 'April 2025',
        type: 'Community Consent Record',
        verified: true,
        notes: 'Verification of zero predatory intermediary financing among 380 active locker subscribers.'
      }
    ],
    unresolvedGaps: [
      'Local production of Black Soldier Fly insect meal currently covers only 35% of feed demand; remaining 65% relies on regional soya imports subject to freight price variance.'
    ],
    keyRisks: [
      {
        category: 'Operational',
        description: 'Algal bloom or water hyacinth infestation obstructing deep-water circulation.',
        mitigation: 'Autonomous solar-powered satellite surface skimmers and dynamic cage submergence mechanisms.'
      },
      {
        category: 'Policy/Tenure',
        description: 'Transboundary fishing boundary disputes with Ugandan and Tanzanian maritime authorities.',
        mitigation: 'Cages installed strictly inside demarcated Kenyan gazetted aquaculture zones with GPS geofencing.'
      }
    ],
    localOwnershipPercentage: 55,
    communityParticipationModel: 'Beach Management Units (BMUs) receive 5% gross landing fees earmarked for shoreline reforestation and community clinic fund.',
    status: 'Qualified'
  },
  {
    id: 'opp-03',
    name: 'Rift Valley Productive Mini-Grid & Bio-Hubs',
    tagline: 'Decentralized 100% solar-plus-storage mini-grids powering agricultural milling, grain drying, and borehole pumping.',
    sector: 'Decentralized Clean Energy',
    county: 'Baringo & Nakuru Counties',
    country: 'Kenya',
    readiness: 'Institutional Scale',
    capitalRequirementUsd: 3800000,
    minimumTicketUsd: 250000,
    instrument: 'Concessionary Debt',
    projectedFinancialReturn: '7.5% p.a. amortizing facility',
    rciScore: 84,
    confidenceLevel: 'High (Verified & Audited)',
    image: '/src/assets/images/hero_atlas_observatory_1792231068416.jpg',
    problemStatement: 'Off-grid agro-pastoral communities in Baringo spend up to 40% of their operational cash on polluting diesel generators for maize milling and livestock boreholes, leaving them subject to diesel shortages and carbon emissions.',
    operatingModel: 'Owns and operates 12 micro-utility solar installations (total 1.8 MWp with 4.2 MWh LFP battery storage) delivering metered productive three-phase power directly to local grain processors, dairy chilling tanks, and medical clinics.',
    additionality: 'Unlike residential lighting mini-grids that struggle with household purchasing power, 78% of power consumption is anchored by verified commercial agribusiness contracts, generating predictable cash flows while abating 2,800 tons of CO2e annually.',
    beneficiaryCount: 5200,
    hectaresUnderRegeneration: 1200,
    rciPillars: {
      ecologicalRegeneration: 20,
      institutionalGovernance: 23,
      financialDurability: 22,
      additionalityAndAgency: 19,
    },
    evidenceSources: [
      {
        title: 'EPRA Mini-Grid Generation & Distribution License No. 442/2024',
        authorOrOrg: 'Energy and Petroleum Regulatory Authority (EPRA) Kenya',
        date: 'October 2024',
        type: 'Field Inspection',
        verified: true,
        notes: 'Full regulatory compliance, tariff approval under the Energy Act 2019.'
      },
      {
        title: 'Smart Meter Productive Power Ingestion Telemetry Stream',
        authorOrOrg: 'Stron Smart Metering & GridWatch Africa',
        date: 'Rolling Live Telemetry',
        type: 'Satellite Telemetry',
        verified: true,
        notes: '99.4% uptime across 12 clusters; median collection rate 98.7% via M-Pesa automated billing.'
      }
    ],
    unresolvedGaps: [
      'Battery recycling and end-of-life stewardship contract with an accredited Kenyan e-waste handler remains in draft form.'
    ],
    keyRisks: [
      {
        category: 'Operational',
        description: 'Vandalism or unauthorized transmission line tapping in remote pastoral corridors.',
        mitigation: 'Community elders council receives equity participation and manages physical security warden corps.'
      }
    ],
    localOwnershipPercentage: 48,
    communityParticipationModel: 'Community development trust holds 15% carried equity in each mini-grid SPV.',
    status: 'Qualified'
  },
  {
    id: 'opp-04',
    name: 'Upper Tana River Watershed Stewardship Trust',
    tagline: 'Endowment-backed native riparian forest restoration and water fund for municipal and agricultural security.',
    sector: 'Community Land & Forest Trusts',
    county: 'Murang’a & Embu Counties',
    country: 'Kenya',
    readiness: 'Seed Stage',
    capitalRequirementUsd: 1200000,
    minimumTicketUsd: 50000,
    instrument: 'Program-Related Grant',
    projectedFinancialReturn: 'Concessionary 2.5% ecological impact note + water offset credits',
    rciScore: 76,
    confidenceLevel: 'Moderate (Self-Reported + Field Sample)',
    image: '/src/assets/images/diaspora_stewardship_roundtable_1792231069117.jpg',
    problemStatement: 'Sediment siltation into the Ndakaini and Sasumua reservoirs supplies 85% of Nairobi’s drinking water, yet deforestation along the Aberdare catchment threatens water security and causes catastrophic flash floods downstream.',
    operatingModel: 'Partners with downstream municipal water companies, beverage manufacturers, and upstream landholders through a structured Payment for Ecosystem Services (PES) covenant protecting 4,500 hectares of indigenous bamboo and cedar buffers.',
    additionality: 'Every dollar invested reduces municipal water treatment chemical costs by $2.30 while paying direct conditional stewardship stipends to 640 upstream farming households.',
    beneficiaryCount: 3100,
    hectaresUnderRegeneration: 4500,
    rciPillars: {
      ecologicalRegeneration: 24,
      institutionalGovernance: 18,
      financialDurability: 16,
      additionalityAndAgency: 18,
    },
    evidenceSources: [
      {
        title: 'Hydrological Sedimentation Reduction Model (2023-2025)',
        authorOrOrg: 'University of Nairobi Department of Meteorology & Water Resources Authority (WRA)',
        date: 'March 2025',
        type: 'Hydrological Sensor',
        verified: true,
        notes: 'Recorded 22% reduction in turbidity at intake point 3 during seasonal peak discharge.'
      }
    ],
    unresolvedGaps: [
      'Missing 3-year baseline hydrological telemetry at secondary tributaries.',
      'Long-term off-taker contract with the Nairobi City Water & Sewerage Company requires parliamentary committee gazettement.'
    ],
    keyRisks: [
      {
        category: 'Policy/Tenure',
        description: 'Delays in county government gazetting of riparian buffer protection zones.',
        mitigation: 'Direct bilateral conservation covenants signed on private freehold title deeds held in escrow.'
      }
    ],
    localOwnershipPercentage: 80,
    communityParticipationModel: 'Governed by a tripartite board: 1/3 community watershed associations, 1/3 municipal water offtakers, 1/3 scientific trustees.',
    status: 'Qualified'
  },
  {
    id: 'opp-05',
    name: 'Savannah Carbon Tokenization Ltd [EXCLUDED CASE STUDY]',
    tagline: 'Forward issuance of speculative carbon tokens on public blockchain over pastoral rangelands.',
    sector: 'Circular Bioeconomy',
    county: 'Kajiado & Narok Counties',
    country: 'Kenya',
    readiness: 'Rejected / Ineligible',
    capitalRequirementUsd: 5000000,
    minimumTicketUsd: 500000,
    instrument: 'Blended Equity',
    projectedFinancialReturn: 'Claimed 28% IRR via secondary token trading',
    rciScore: 31,
    confidenceLevel: 'Fails Integrity Gate',
    image: '/src/assets/images/hero_atlas_observatory_1792231068416.jpg',
    problemStatement: 'Promoted as a rangeland carbon sequestration initiative using satellite NDVI modeling to mint tradable crypto carbon credits for global corporations.',
    operatingModel: 'Promoters proposed taking 60% of token sale proceeds for software and offshore holding company management, while allocating 40% to local pastoral community trusts over 20-year lockups.',
    additionality: 'Negative additionality. Land was already under traditional pastoral rotational grazing (Engusero system). The scheme proposed fencing off dry-season grazing corridors, directly threatening Maasai pastoral livelihoods.',
    beneficiaryCount: 0,
    hectaresUnderRegeneration: 0,
    rciPillars: {
      ecologicalRegeneration: 8,
      institutionalGovernance: 7,
      financialDurability: 10,
      additionalityAndAgency: 6,
    },
    evidenceSources: [
      {
        title: 'Investigative Audit on Customary Grazing Rights & Token Mechanics',
        authorOrOrg: 'Atlas Sanctum Independent Research & Legal Council',
        date: 'August 2025',
        type: 'Field Inspection',
        verified: true,
        notes: 'Disclosed serious lack of Free, Prior and Informed Consent (FPIC); predatory token dilution clauses.'
      }
    ],
    unresolvedGaps: [
      'No ground-truth soil organic carbon core samples collected.',
      'Promoters refused to disclose beneficial ownership of Seychelles holding structure.',
      'No legal authority under Kenya Climate Change Act 2023 regulations.'
    ],
    keyRisks: [
      {
        category: 'Policy/Tenure',
        description: 'High risk of community conflict, forced displacement, and regulatory sanctions under the Kenya Carbon Markets Regulations 2024.',
        mitigation: 'None viable. Project failed integrity filter.'
      }
    ],
    localOwnershipPercentage: 5,
    communityParticipationModel: 'Purely extractive token distribution without voting rights or land governance authority.',
    status: 'Excluded',
    exclusionReason: 'FAILED INTEGRITY GATE: Violates Atlas Sanctum Covenant on Human Flourishing and Just Institutions. Demonstrates speculative tokenization, predatory rangeland lock-in, absence of FPIC consent, and unverified carbon claims without soil ground-truthing.'
  }
];

export const INITIAL_MANDATE: LegacyMandate = {
  familyName: 'Ochieng & Kenyatta Intergenerational Family Council',
  generationStage: 'Second Generation (Transition in Progress)',
  capitalPoolUsd: 25000000,
  timeHorizonYears: 15,
  primaryMission: 'Ecological Restoration & Food Sovereignty',
  philanthropicSplit: 25,
  geographicFocus: 'Kenya Focus (Rift Valley & Highlands)',
  ethicalExclusions: [
    'Extractive fossil fuel exploration',
    'Speculative blockchain carbon tokens',
    'Industrial mono-cropping reliant on synthetic pesticides',
    'Land projects lacking documented FPIC community consent'
  ],
  targetAnnualReturn: '6.5% - 8.0% Blended Nominal Yield',
  decisionGovernance: 'Stewardship Committee Majority',
  nextGenParticipationRole: 'Co-Principal Decision Maker'
};

export const ALLOCATION_SCENARIOS: AllocationScenario[] = [
  {
    id: 'scen-a',
    name: 'Scenario A: Defensive Heritage',
    philosophy: 'Capital preservation focus with modest concessionary grant envelope for local institutional goodwill.',
    preservationPercent: 75,
    commercialEastAfricaPercent: 15,
    catalyticBlendedPercent: 10,
    expectedAnnualReturn: '4.8% USD net',
    downsideClimateExposure: 'Low',
    estimatedJobsSustained: 420,
    estimatedHectaresProtected: 850,
    intergenerationalAlignment: 62,
    narrative: 'Minimizes emerging market risk by anchoring 75% in US Treasuries and Swiss custodian vehicles. However, it fails to engage Gen 2/3 aspirations for meaningful African development and leaves local family business operations exposed to domestic economic stagnation.'
  },
  {
    id: 'scen-b',
    name: 'Scenario B: Catalytic Regenerative Growth (Recommended)',
    philosophy: 'Disciplined barbell: solid offshore liquidity combined with high-conviction East African regenerative productive assets and blended watershed trusts.',
    preservationPercent: 40,
    commercialEastAfricaPercent: 40,
    catalyticBlendedPercent: 20,
    expectedAnnualReturn: '7.6% USD blended',
    downsideClimateExposure: 'Moderate',
    estimatedJobsSustained: 2850,
    estimatedHectaresProtected: 4100,
    intergenerationalAlignment: 94,
    narrative: 'Balances family wealth security (40% liquid reserve) with direct ownership of cash-generating agroforestry hubs, cold chains, and productive mini-grids. Next-generation family members actively serve on project advisory councils, transforming wealth from a source of conflict into an intergenerational stewardship school.'
  },
  {
    id: 'scen-c',
    name: 'Scenario C: Diaspora Community Endowment',
    philosophy: 'High-additionality catalytic vehicle pooled with organized UK & North American diaspora syndicates for maximum regional transformation.',
    preservationPercent: 20,
    commercialEastAfricaPercent: 50,
    catalyticBlendedPercent: 30,
    expectedAnnualReturn: '6.8% USD blended',
    downsideClimateExposure: 'Moderate',
    estimatedJobsSustained: 4100,
    estimatedHectaresProtected: 6200,
    intergenerationalAlignment: 88,
    narrative: 'Treats wealth as a catalytic bridge for African self-determination. Leverages diaspora co-investment syndicates to scale regional watershed protection and smallholder infrastructure. High social and ecological return, with moderate liquidity lockup over a 10-year horizon.'
  }
];
