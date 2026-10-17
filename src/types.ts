export type Sector = 
  | 'Regenerative Agriculture' 
  | 'Watershed & Aquatic Systems' 
  | 'Decentralized Clean Energy' 
  | 'Circular Bioeconomy' 
  | 'Community Land & Forest Trusts';

export type ReadinessLevel = 'Seed Stage' | 'Growth / Expansion' | 'Institutional Scale' | 'Rejected / Ineligible';

export type ConfidenceLevel = 'High (Verified & Audited)' | 'Moderate (Self-Reported + Field Sample)' | 'Low (Incomplete Baseline)' | 'Fails Integrity Gate';

export interface EvidenceSource {
  title: string;
  authorOrOrg: string;
  date: string;
  type: 'Satellite Telemetry' | 'Financial Audit' | 'Community Consent Record' | 'Hydrological Sensor' | 'Field Inspection';
  verified: boolean;
  notes: string;
}

export interface Opportunity {
  id: string;
  name: string;
  tagline: string;
  sector: Sector;
  county: string;
  country: string;
  readiness: ReadinessLevel;
  capitalRequirementUsd: number;
  minimumTicketUsd: number;
  instrument: 'Senior Debt' | 'Revenue Share Note' | 'Blended Equity' | 'Program-Related Grant' | 'Concessionary Debt';
  projectedFinancialReturn: string;
  rciScore: number; // 0 - 100
  confidenceLevel: ConfidenceLevel;
  image: string;
  problemStatement: string;
  operatingModel: string;
  additionality: string;
  beneficiaryCount: number;
  hectaresUnderRegeneration: number;
  rciPillars: {
    ecologicalRegeneration: number; // /25
    institutionalGovernance: number; // /25
    financialDurability: number; // /25
    additionalityAndAgency: number; // /25
  };
  evidenceSources: EvidenceSource[];
  unresolvedGaps: string[];
  keyRisks: {
    category: 'Operational' | 'Climate/Hydrological' | 'Policy/Tenure' | 'Market/Currency';
    description: string;
    mitigation: string;
  }[];
  localOwnershipPercentage: number;
  communityParticipationModel: string;
  status: 'Qualified' | 'Under Review' | 'Excluded';
  exclusionReason?: string;
}

export interface LegacyMandate {
  familyName: string;
  generationStage: 'First Generation (Wealth Creators)' | 'Second Generation (Transition in Progress)' | 'Multi-Generational Stewardship Council';
  capitalPoolUsd: number;
  timeHorizonYears: number;
  primaryMission: 'Ecological Restoration & Food Sovereignty' | 'Decentralized Productive Infrastructure' | 'Youth Employment & Enterprise Continuity' | 'Holistic Landscape Stewardship';
  philanthropicSplit: number; // percentage (0 - 100), commercial is 100 - philanthropicSplit
  geographicFocus: 'Kenya Focus (Rift Valley & Highlands)' | 'East Africa Regional (Kenya, Rwanda, Uganda)' | 'Pan-African Corridor';
  ethicalExclusions: string[];
  targetAnnualReturn: string;
  decisionGovernance: 'Unanimous Family Council' | 'Stewardship Committee Majority' | 'Independent Fiduciary + Family Veto';
  nextGenParticipationRole: 'Active Due Diligence Fellow' | 'Board Observer' | 'Philanthropic Envelope Chair' | 'Co-Principal Decision Maker';
}

export interface AllocationScenario {
  id: string;
  name: string;
  philosophy: string;
  preservationPercent: number; // Offshore liquid / treasuries
  commercialEastAfricaPercent: number; // Productive enterprises
  catalyticBlendedPercent: number; // Concessionary & watershed trusts
  expectedAnnualReturn: string;
  downsideClimateExposure: 'Low' | 'Moderate' | 'High';
  estimatedJobsSustained: number;
  estimatedHectaresProtected: number;
  intergenerationalAlignment: number; // out of 100
  narrative: string;
}

export interface DeliverableItem {
  id: number;
  numberStr: string;
  title: string;
  subtitle: string;
  keyFindings: string[];
  methodologyOrEvidence: string;
  datedCitations: { citation: string; date: string; reliability: 'Primary Empirical' | 'Institutional Consensus' | 'Analytical Estimate' }[];
  fullProse: string;
}
