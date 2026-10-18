export type Sector = 
  | 'Regenerative Agriculture' 
  | 'Watershed & Aquatic Systems' 
  | 'Decentralized Clean Energy' 
  | 'Circular Bioeconomy' 
  | 'Community Land & Forest Trusts';

export type ReadinessLevel = 'Seed Stage' | 'Growth / Expansion' | 'Institutional Scale' | 'Rejected / Ineligible';

export type ConfidenceLevel = 'High (Verified & Audited)' | 'Moderate (Self-Reported + Field Sample)' | 'Low (Incomplete Baseline)' | 'Fails Integrity Gate';

export type ThematicImpactCategory =
  | 'Soil Restoration'
  | 'Community Sovereignty'
  | 'Aquifer & Watershed Protection'
  | 'Youth Employment & Continuity'
  | 'Clean Energy & Decentralization'
  | 'Biodiversity Corridors'
  | 'Circular Waste Biomass'
  | 'Gender Equity & Land Agency';

export interface RegenerativeAnnotation {
  id: string;
  opportunityId: string;
  category: ThematicImpactCategory;
  authorName: string;
  authorRole: UserRole;
  timestamp: string;
  note: string;
  evidenceTier: 'Direct Field Observation' | 'Audited Baseline Finding' | 'Community Testimony';
}

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
  coordinates: {
    lat: number;
    lng: number;
  };
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
  annotations?: RegenerativeAnnotation[];
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
  reviewCycle?: 'Quarterly Review' | 'Semi-Annual Audit' | 'Annual Family Assembly';
  version?: string;
  lastReviewedDate?: string;
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

/* =========================================================================
   MVP CAPABILITIES: Organizations, Evidence, Decisions, Milestones & Audit
   ========================================================================= */

export type UserRole = 
  | 'Principal Steward' 
  | 'Fiduciary Trustee' 
  | 'Investment Committee Lead' 
  | 'Next-Gen Fellow' 
  | 'Field Auditor';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  joinedDate: string;
  status: 'Active' | 'Pending Verification';
}

export interface Organization {
  id: string;
  name: string;
  type: 'Single Family Office' | 'Multi-Generational Stewardship Council' | 'Diaspora Capital Syndicate' | 'Conservation Endowment';
  headquarters: string;
  establishedYear: number;
  aumUsd: number;
  activeMandateId: string;
}

export type VerificationTier = 'Third-Party Certified' | 'Partner Self-Reported' | 'Field Inspector Signed';

export interface EvidenceDocument {
  id: string;
  opportunityId: string;
  title: string;
  category: 'Soil Telemetry' | 'Financial Audit' | 'Legal Title' | 'Hydrological Sensor' | 'Community FPIC Consent';
  authorOrOrg: string;
  date: string;
  verificationTier: VerificationTier;
  hash: string;
  summary: string;
  status: 'Approved' | 'Flagged for Review' | 'Stale / Expired';
}

export interface DecisionRecord {
  id: string;
  opportunityId: string;
  opportunityName: string;
  date: string;
  type: 'Approved for Allocation' | 'Conditional Approval with Precedent Gates' | 'Rejected / Integrity Exclusion' | 'Deferred for Telemetry';
  rationale: string;
  recordedBy: string;
  votes: {
    role: string;
    memberName: string;
    vote: 'Approve' | 'Reject' | 'Abstain';
    comment: string;
  }[];
  conditionsPrecedent: string[];
  signatureHash: string;
  status: 'Final' | 'Draft';
}

export interface Milestone {
  id: string;
  opportunityId: string;
  title: string;
  targetQuarter: string;
  status: 'Completed & Verified' | 'In Progress' | 'Delayed' | 'Pending Tranche';
  verifiedBy?: string;
  evidenceDocId?: string;
  progressPercent: number;
}

export interface OutcomeIndicator {
  id: string;
  opportunityId: string;
  metricName: string;
  unit: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  verificationMethod: string;
  lastUpdated: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
  entityType: 'Mandate' | 'Evidence' | 'Assessment' | 'Decision' | 'Milestone' | 'Organization' | 'Opportunity';
  entityId: string;
}

export interface AiDraftSynthesis {
  id: string;
  opportunityId: string;
  generatedAt: string;
  summary: string;
  confidenceScore: number;
  citedSourceIds: string[];
  humanReviewed: boolean;
  reviewedBy?: string;
}

/* =========================================================================
   MONTE CARLO SIMULATION TYPES
   ========================================================================= */

export type MonteCarloTarget = 
  | 'regeneratedHectares'
  | 'portfolioTerminalValue'
  | 'livelihoodsSustained'
  | 'soilCarbonStock';

export interface MonteCarloSummary {
  p10: number; // Downside 10th percentile
  p50: number; // Median 50th percentile
  p90: number; // Optimistic 90th percentile
  mean: number;
  stdDev: number;
  probabilityOfExceedingTarget: number;
  histogram: {
    binStart: number;
    binEnd: number;
    count: number;
    frequency: number;
  }[];
  samplePaths: {
    year: number;
    p10: number;
    p50: number;
    p90: number;
    runSample1: number;
    runSample2: number;
    runSample3: number;
  }[];
}
